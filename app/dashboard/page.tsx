'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Clock, DollarSign, TrendingUp, Calendar, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CostTicker from '@/components/CostTicker';
import MeetingForm from '@/components/MeetingForm';
import { MeetingFormData, MeetingRecord } from '@/lib/types';
import { formatCost, formatDuration } from '@/lib/calculations';
import { getMeetings, saveMeeting } from '@/lib/storage';
import Link from 'next/link';

export default function DashboardPage() {
    const [activeMeeting, setActiveMeeting] = useState<MeetingFormData | null>(null);
    const [meetings, setMeetings] = useState<MeetingRecord[]>([]);

    // Load meetings from Supabase / localStorage on mount
    const loadMeetings = useCallback(async () => {
        const data = await getMeetings();
        setMeetings(data);
    }, []);

    useEffect(() => {
        loadMeetings();
        // Check for autostart from calendar
        const autostart = sessionStorage.getItem('meetingburn_autostart');
        if (autostart) {
            try {
                const data: MeetingFormData = JSON.parse(autostart);
                setActiveMeeting(data);
            } catch { /* ignore */ }
            sessionStorage.removeItem('meetingburn_autostart');
        }
    }, [loadMeetings]);

    const handleStart = (data: MeetingFormData) => {
        setActiveMeeting(data);
    };

    const handleStop = async (durationSeconds: number, totalCost: number) => {
        const newMeeting: MeetingRecord = {
            id: crypto.randomUUID(),
            user_id: 'local',
            meeting_name: activeMeeting?.meetingName || 'Untitled Meeting',
            attendees: activeMeeting?.attendees || 0,
            avg_salary: activeMeeting?.avgSalary || 0,
            duration_seconds: durationSeconds,
            total_cost: totalCost,
            source: 'manual',
            is_public: false,
            created_at: new Date().toISOString(),
        };

        const saved = await saveMeeting(newMeeting);
        setMeetings((prev) => [saved, ...prev]);
        setActiveMeeting(null);
    };

    // Stats
    const totalCostToday = meetings
        .filter((m) => {
            const d = new Date(m.created_at);
            const today = new Date();
            return d.toDateString() === today.toDateString();
        })
        .reduce((sum, m) => sum + m.total_cost, 0);

    const totalMeetingsToday = meetings.filter((m) => {
        const d = new Date(m.created_at);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    }).length;

    const avgCost =
        meetings.length > 0
            ? meetings.reduce((sum, m) => sum + m.total_cost, 0) / meetings.length
            : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
                <p className="text-muted-foreground text-sm">
                    Track and analyze your meeting costs in real-time.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: "Today's Cost",
                        value: formatCost(totalCostToday),
                        icon: DollarSign,
                        color: 'text-emerald-400',
                    },
                    {
                        label: 'Meetings Today',
                        value: totalMeetingsToday.toString(),
                        icon: Calendar,
                        color: 'text-blue-400',
                    },
                    {
                        label: 'Avg. Cost',
                        value: formatCost(avgCost),
                        icon: TrendingUp,
                        color: 'text-yellow-400',
                    },
                    {
                        label: 'Total Tracked',
                        value: meetings.length.toString(),
                        icon: Clock,
                        color: 'text-purple-400',
                    },
                ].map((stat) => (
                    <Card key={stat.label} className="border-border/20 bg-card/30">
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                    {stat.label}
                                </span>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-bold font-mono">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Active Meeting or Start New */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        {activeMeeting ? (
                            <>
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                Active Meeting
                            </>
                        ) : (
                            <>
                                <Calculator className="w-4 h-4 text-muted-foreground" />
                                Start New Meeting
                            </>
                        )}
                    </h2>

                    {activeMeeting ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-2xl border border-border/40 bg-card/30 p-8"
                        >
                            <CostTicker
                                attendees={activeMeeting.attendees}
                                avgSalary={activeMeeting.avgSalary}
                                meetingName={activeMeeting.meetingName}
                                autoStart
                                onStop={handleStop}
                            />
                        </motion.div>
                    ) : (
                        <MeetingForm onStart={handleStart} />
                    )}
                </div>

                {/* Recent Meetings */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Recent Meetings
                    </h2>

                    {meetings.length === 0 ? (
                        <Card className="border-border/20 bg-card/20 border-dashed">
                            <CardContent className="pt-12 pb-12 text-center">
                                <Clock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                                <p className="text-muted-foreground text-sm">
                                    No meetings tracked yet. Start your first meeting to see it here.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {meetings.slice(0, 5).map((meeting, i) => (
                                <motion.div
                                    key={meeting.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="border-border/20 bg-card/20 hover:bg-card/40 transition-colors">
                                        <CardContent className="py-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">{meeting.meeting_name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {meeting.attendees} attendees •{' '}
                                                    {formatDuration(meeting.duration_seconds)} •{' '}
                                                    {new Date(meeting.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right flex items-center gap-2">
                                                <div>
                                                    <p className="font-mono font-semibold text-emerald-400">
                                                        {formatCost(meeting.total_cost)}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs mt-1 border-border/30"
                                                    >
                                                        {meeting.source}
                                                    </Badge>
                                                </div>
                                                <Link
                                                    href={`/report/${meeting.id}`}
                                                    className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-emerald-400 transition-colors"
                                                    title="Share Report"
                                                >
                                                    <Share2 className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
