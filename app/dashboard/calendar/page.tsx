'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Clock,
    Users,
    DollarSign,
    RefreshCw,
    Play,
    Zap,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent, MeetingFormData } from '@/lib/types';
import { calculateCostPerSecond, formatCost } from '@/lib/calculations';

export default function CalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [synced, setSynced] = useState(false);
    const [defaultSalary, setDefaultSalary] = useState(120000);
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('meetingburn_default_salary');
        if (saved) setDefaultSalary(Number(saved));
    }, []);

    const fetchCalendar = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/calendar');
            const data = await res.json();
            setEvents(data.events || []);
            setSynced(true);
        } catch {
            // Handle error silently
        }
        setLoading(false);
    };

    const getEventDuration = (event: CalendarEvent) => {
        const start = new Date(event.start).getTime();
        const end = new Date(event.end).getTime();
        return Math.round((end - start) / 60000); // in minutes
    };

    const getEventCost = (event: CalendarEvent) => {
        const durationMinutes = getEventDuration(event);
        const costPerSecond = calculateCostPerSecond(defaultSalary, event.attendeeCount);
        return costPerSecond * durationMinutes * 60;
    };

    const totalDayCost = events.reduce((sum, e) => sum + getEventCost(e), 0);
    const totalMinutes = events.reduce((sum, e) => sum + getEventDuration(e), 0);

    const startMeetingFromEvent = (event: CalendarEvent) => {
        const data: MeetingFormData = {
            meetingName: event.summary,
            attendees: event.attendeeCount,
            avgSalary: defaultSalary,
        };
        // Store in sessionStorage and redirect to dashboard
        sessionStorage.setItem('meetingburn_autostart', JSON.stringify(data));
        window.location.href = '/dashboard';
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Calendar Sync</h1>
                    <p className="text-muted-foreground text-sm">
                        Import meetings from Google Calendar and preview costs.
                    </p>
                </div>
                <Button
                    onClick={fetchCalendar}
                    disabled={loading}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {synced ? 'Refresh' : 'Sync Calendar'}
                </Button>
            </div>

            {/* Status Banner */}
            {!synced && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-emerald-500/20 bg-emerald-500/5">
                        <CardContent className="py-6 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <CalendarIcon className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm mb-1">Connect Google Calendar</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Sync your calendar to automatically see upcoming meetings and their estimated costs.
                                    Click &quot;Sync Calendar&quot; to preview with demo data.
                                </p>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                                        <Zap className="w-3 h-3 mr-1" /> Pro Feature
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Today's Summary */}
            {synced && events.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    <Card className="border-border/20 bg-card/30">
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Today&apos;s Meeting Cost
                                </span>
                            </div>
                            <p className="text-2xl font-bold font-mono">{formatCost(totalDayCost)}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border/20 bg-card/30">
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarIcon className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Meetings Today
                                </span>
                            </div>
                            <p className="text-2xl font-bold font-mono">{events.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border/20 bg-card/30">
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Total Time
                                </span>
                            </div>
                            <p className="text-2xl font-bold font-mono">
                                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Event List */}
            {synced && (
                <Card className="border-border/20 bg-card/20">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-emerald-400" />
                            Today&apos;s Meetings
                            <Badge variant="outline" className="ml-auto border-border/30 text-xs">
                                {events.length} events
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {events.map((event, i) => {
                            const duration = getEventDuration(event);
                            const cost = getEventCost(event);
                            const startTime = new Date(event.start).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                            });
                            const endTime = new Date(event.end).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                            });
                            const isSelected = selectedEvent === event.id;
                            const isPast = new Date(event.end).getTime() < Date.now();
                            const isNow = new Date(event.start).getTime() <= Date.now() && new Date(event.end).getTime() > Date.now();

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                                    className={`rounded-lg border p-4 cursor-pointer transition-all ${isSelected
                                            ? 'border-emerald-500/40 bg-emerald-500/5'
                                            : 'border-border/20 bg-background/30 hover:border-border/40'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${isNow ? 'bg-red-500 animate-pulse' : isPast ? 'bg-muted-foreground/30' : 'bg-emerald-500'
                                                }`} />
                                            <div>
                                                <p className="font-medium text-sm flex items-center gap-2">
                                                    {event.summary}
                                                    {isNow && (
                                                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                                                            LIVE
                                                        </Badge>
                                                    )}
                                                    {isPast && (
                                                        <CheckCircle className="w-3.5 h-3.5 text-muted-foreground/50" />
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {startTime} – {endTime} • {duration}min • {event.attendeeCount} attendees
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-3">
                                            <div>
                                                <p className="font-mono font-semibold text-emerald-400">{formatCost(cost)}</p>
                                                <p className="text-xs text-muted-foreground">estimated</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 pt-4 border-t border-border/20"
                                        >
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">Cost/min</p>
                                                    <p className="font-mono text-sm">{formatCost(cost / duration)}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">Cost/attendee</p>
                                                    <p className="font-mono text-sm">{formatCost(cost / event.attendeeCount)}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">Avg Salary Used</p>
                                                    <p className="font-mono text-sm">{formatCost(defaultSalary)}</p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startMeetingFromEvent(event);
                                                }}
                                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
                                                size="sm"
                                            >
                                                <Play className="w-3.5 h-3.5" /> Start Live Tracking
                                            </Button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Empty state */}
            {synced && events.length === 0 && (
                <Card className="border-border/20 bg-card/20 border-dashed">
                    <CardContent className="py-16 text-center">
                        <AlertCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            No meetings found on your calendar today.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
