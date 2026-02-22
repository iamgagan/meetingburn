'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, Users, DollarSign, Flame, ArrowRight, Calendar, Copy, Check, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MeetingRecord } from '@/lib/types';
import { formatCost, formatDuration, getCostSeverity, getCostColor, calculateCostPerSecond } from '@/lib/calculations';
import Link from 'next/link';
import { getMeetings } from '@/lib/storage';

export default function ReportPage() {
    const params = useParams();
    const meetingId = params.id as string;
    const [meeting, setMeeting] = useState<MeetingRecord | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const load = async () => {
            const meetings = await getMeetings();
            const found = meetings.find((m) => m.id === meetingId);
            if (found) {
                setMeeting(found);
            } else {
                setNotFound(true);
            }
        };
        load();
    }, [meetingId]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (notFound) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="border-border/20 bg-card/30 max-w-md w-full">
                    <CardContent className="pt-10 pb-10 text-center">
                        <DollarSign className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h1 className="text-xl font-bold mb-2">Report Not Found</h1>
                        <p className="text-muted-foreground text-sm mb-6">
                            This meeting report doesn&apos;t exist or has been deleted.
                        </p>
                        <Button asChild>
                            <Link href="/">
                                Go to MeetingBurn <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!meeting) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const severity = getCostSeverity(meeting.total_cost);
    const colorClass = getCostColor(severity);
    const costPerSecond = calculateCostPerSecond(meeting.avg_salary, meeting.attendees);
    const costPerMinute = costPerSecond * 60;
    const costPerHour = costPerMinute * 60;

    // Fun comparisons
    const comparisons = [];
    if (meeting.total_cost >= 5) {
        comparisons.push({ emoji: '☕', text: `${Math.floor(meeting.total_cost / 5)} lattes`, sub: 'at $5 each' });
    }
    if (meeting.total_cost >= 15) {
        comparisons.push({ emoji: '🍕', text: `${Math.floor(meeting.total_cost / 15)} pizzas`, sub: 'at $15 each' });
    }
    if (meeting.total_cost >= 100) {
        comparisons.push({ emoji: '🎮', text: `${(meeting.total_cost / 70).toFixed(1)} games`, sub: 'at $70 each' });
    }
    if (meeting.total_cost >= 500) {
        comparisons.push({ emoji: '✈️', text: `${(meeting.total_cost / 350).toFixed(1)} flights`, sub: 'domestic avg' });
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Background */}
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.72_0.19_160_/_0.06),_transparent_70%)]" />

            <div className="relative max-w-2xl mx-auto px-4 py-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mb-12 justify-center group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Flame className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg">
                        Meeting<span className="text-emerald-400">Burn</span>
                    </span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-border/30 bg-card/30 backdrop-blur-md overflow-hidden">
                        {/* Header */}
                        <div className="border-b border-border/20 px-8 py-6 flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Share2 className="w-3 h-3" /> Meeting Cost Report
                                </p>
                                <h1 className="text-2xl font-bold">{meeting.meeting_name}</h1>
                                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(meeting.created_at).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyLink}
                                className="gap-2 border-border/30 shrink-0"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </Button>
                        </div>

                        {/* Cost */}
                        <CardContent className="pt-10 pb-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Total Cost</p>
                            <p className={`text-6xl font-mono font-bold ${colorClass} mb-2`}>
                                {formatCost(meeting.total_cost)}
                            </p>
                            <p className="text-xs text-muted-foreground mb-8">
                                That&apos;s {formatCost(costPerMinute)} per minute
                            </p>

                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                                        <Clock className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Duration</span>
                                    <span className="font-mono font-semibold">
                                        {formatDuration(meeting.duration_seconds)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                                        <Users className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Attendees</span>
                                    <span className="font-mono font-semibold">{meeting.attendees}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2">
                                        <DollarSign className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Cost/Hour</span>
                                    <span className="font-mono font-semibold">
                                        {formatCost(costPerHour)}
                                    </span>
                                </div>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="rounded-lg border border-border/20 bg-background/30 p-4 text-left space-y-2 mb-8">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Cost Breakdown</p>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Avg. yearly salary</span>
                                    <span className="font-mono">{formatCost(meeting.avg_salary)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Hourly rate (per person)</span>
                                    <span className="font-mono">{formatCost(meeting.avg_salary / 2080)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">× {meeting.attendees} attendees</span>
                                    <span className="font-mono">{formatCost(costPerHour)}/hr</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">× {formatDuration(meeting.duration_seconds)}</span>
                                    <span className="font-mono font-semibold text-foreground">{formatCost(meeting.total_cost)}</span>
                                </div>
                            </div>

                            {/* Fun Comparisons */}
                            {comparisons.length > 0 && (
                                <div className="rounded-lg border border-border/20 bg-background/30 p-4 text-left">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                                        This meeting could have bought...
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {comparisons.map((c, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                                className="flex items-center gap-3 rounded-md bg-background/40 p-3"
                                            >
                                                <span className="text-2xl">{c.emoji}</span>
                                                <div>
                                                    <p className="font-semibold text-sm">{c.text}</p>
                                                    <p className="text-xs text-muted-foreground">{c.sub}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        {/* Footer CTA */}
                        <div className="border-t border-border/20 px-8 py-6 text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                Curious how much your meetings cost?
                            </p>
                            <Button
                                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white gap-2"
                                asChild
                            >
                                <Link href="/">
                                    Try MeetingBurn Free <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
