'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Trash2,
    Download,
    BarChart3,
    ArrowUpDown,
    Calendar,
    DollarSign,
    Clock,
    Share2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MeetingRecord } from '@/lib/types';
import { formatCost, formatDuration } from '@/lib/calculations';
import { getMeetings, deleteMeeting as deleteFromStorage } from '@/lib/storage';
import Link from 'next/link';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

type SortField = 'created_at' | 'total_cost' | 'duration_seconds' | 'attendees';
type SortDir = 'asc' | 'desc';

export default function HistoryPage() {
    const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    useEffect(() => {
        getMeetings().then(setMeetings);
    }, []);

    const sortedMeetings = useMemo(() => {
        return [...meetings].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDir === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            return sortDir === 'asc'
                ? (aVal as number) - (bVal as number)
                : (bVal as number) - (aVal as number);
        });
    }, [meetings, sortField, sortDir]);

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    const deleteMeeting = async (id: string) => {
        await deleteFromStorage(id);
        setMeetings((prev) => prev.filter((m) => m.id !== id));
    };

    const exportCSV = () => {
        const headers = 'Name,Date,Attendees,Avg Salary,Duration (s),Cost\n';
        const rows = meetings
            .map(
                (m) =>
                    `"${m.meeting_name}",${m.created_at},${m.attendees},${m.avg_salary},${m.duration_seconds},${m.total_cost.toFixed(2)}`
            )
            .join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meetingburn_history.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Chart data — daily cost for last 7 days
    const chartData = useMemo(() => {
        const days: Record<string, number> = {};
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
        }
        meetings.forEach((m) => {
            const d = new Date(m.created_at);
            const key = d.toLocaleDateString('en-US', { weekday: 'short' });
            if (key in days) {
                days[key] += m.total_cost;
            }
        });
        return Object.entries(days).map(([name, cost]) => ({ name, cost: Math.round(cost * 100) / 100 }));
    }, [meetings]);

    const totalCost = meetings.reduce((sum, m) => sum + m.total_cost, 0);
    const totalDuration = meetings.reduce((sum, m) => sum + m.duration_seconds, 0);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Meeting History</h1>
                    <p className="text-muted-foreground text-sm">
                        All your tracked meetings and cost analytics.
                    </p>
                </div>
                {meetings.length > 0 && (
                    <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="border-border/20 bg-card/30">
                    <CardContent className="pt-5 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                Total Spent
                            </span>
                        </div>
                        <p className="text-2xl font-bold font-mono">{formatCost(totalCost)}</p>
                    </CardContent>
                </Card>
                <Card className="border-border/20 bg-card/30">
                    <CardContent className="pt-5 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                Total Meetings
                            </span>
                        </div>
                        <p className="text-2xl font-bold font-mono">{meetings.length}</p>
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
                        <p className="text-2xl font-bold font-mono">{formatDuration(totalDuration)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            {meetings.length > 0 && (
                <Card className="border-border/20 bg-card/20">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-emerald-400" />
                            Cost This Week
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                                <XAxis dataKey="name" stroke="oklch(0.65 0.01 260)" fontSize={12} />
                                <YAxis stroke="oklch(0.65 0.01 260)" fontSize={12} tickFormatter={(v) => `$${v}`} />
                                <Tooltip
                                    contentStyle={{
                                        background: 'oklch(0.16 0.005 260)',
                                        border: '1px solid oklch(1 0 0 / 10%)',
                                        borderRadius: '8px',
                                        color: 'oklch(0.96 0 0)',
                                    }}
                                    formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'Cost']}
                                />
                                <Bar dataKey="cost" fill="oklch(0.72 0.19 160)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Table */}
            {meetings.length === 0 ? (
                <Card className="border-border/20 bg-card/20 border-dashed">
                    <CardContent className="py-16 text-center">
                        <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            No meeting history yet. Start tracking meetings from the dashboard.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-border/20 bg-card/20 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/20">
                                <TableHead>Meeting</TableHead>
                                <TableHead>
                                    <button
                                        onClick={() => toggleSort('created_at')}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                                    >
                                        Date <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </TableHead>
                                <TableHead>
                                    <button
                                        onClick={() => toggleSort('attendees')}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                                    >
                                        Attendees <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </TableHead>
                                <TableHead>
                                    <button
                                        onClick={() => toggleSort('duration_seconds')}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                                    >
                                        Duration <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </TableHead>
                                <TableHead>
                                    <button
                                        onClick={() => toggleSort('total_cost')}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                                    >
                                        Cost <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </TableHead>
                                <TableHead className="w-10" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedMeetings.map((m, i) => (
                                <motion.tr
                                    key={m.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="border-border/10 hover:bg-accent/20"
                                >
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-sm">{m.meeting_name}</p>
                                            <Badge variant="outline" className="text-xs mt-1 border-border/20">
                                                {m.source}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(m.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{m.attendees}</TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {formatDuration(m.duration_seconds)}
                                    </TableCell>
                                    <TableCell className="font-mono font-semibold text-emerald-400">
                                        {formatCost(m.total_cost)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                                className="text-muted-foreground hover:text-emerald-400"
                                            >
                                                <Link href={`/report/${m.public_slug || m.id}`} title="Share Report">
                                                    <Share2 className="w-3.5 h-3.5" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteMeeting(m.id)}
                                                className="text-muted-foreground hover:text-red-400"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
