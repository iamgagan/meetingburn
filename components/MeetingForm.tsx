'use client';

import { useState } from 'react';
import { Users, DollarSign, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MeetingFormData } from '@/lib/types';

interface MeetingFormProps {
    onStart: (data: MeetingFormData) => void;
}

const QUICK_PRESETS = [
    { label: 'Standup (5 devs)', attendees: 5, salary: 130000 },
    { label: 'Sprint Planning (8)', attendees: 8, salary: 120000 },
    { label: 'All-Hands (25)', attendees: 25, salary: 100000 },
    { label: 'Board Meeting (6)', attendees: 6, salary: 250000 },
];

export default function MeetingForm({ onStart }: MeetingFormProps) {
    const [meetingName, setMeetingName] = useState('');
    const [attendees, setAttendees] = useState<number>(5);
    const [avgSalary, setAvgSalary] = useState<number>(120000);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (attendees > 0 && avgSalary > 0) {
            onStart({
                meetingName: meetingName || 'Untitled Meeting',
                attendees,
                avgSalary,
            });
        }
    };

    const applyPreset = (preset: (typeof QUICK_PRESETS)[number]) => {
        setMeetingName(preset.label);
        setAttendees(preset.attendees);
        setAvgSalary(preset.salary);
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Quick Presets */}
                    <div>
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                            Quick Presets
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_PRESETS.map((preset) => (
                                <Button
                                    key={preset.label}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => applyPreset(preset)}
                                    className="text-xs border-border/50 hover:bg-accent hover:border-emerald-500/30"
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Meeting Name */}
                    <div className="space-y-2">
                        <Label htmlFor="meetingName" className="flex items-center gap-2 text-sm">
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                            Meeting Name
                        </Label>
                        <Input
                            id="meetingName"
                            type="text"
                            placeholder="e.g. Sprint Planning"
                            value={meetingName}
                            onChange={(e) => setMeetingName(e.target.value)}
                            className="bg-background/50"
                        />
                    </div>

                    {/* Attendees and Salary side by side */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="attendees" className="flex items-center gap-2 text-sm">
                                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                Attendees
                            </Label>
                            <Input
                                id="attendees"
                                type="number"
                                min={1}
                                max={500}
                                value={attendees}
                                onChange={(e) => setAttendees(Number(e.target.value))}
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avgSalary" className="flex items-center gap-2 text-sm">
                                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                                Avg. Annual Salary
                            </Label>
                            <Input
                                id="avgSalary"
                                type="number"
                                min={1000}
                                step={1000}
                                value={avgSalary}
                                onChange={(e) => setAvgSalary(Number(e.target.value))}
                                className="bg-background/50"
                            />
                        </div>
                    </div>

                    {/* Cost Preview */}
                    <div className="rounded-lg bg-background/30 border border-border/30 p-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Estimated cost per hour:</span>
                            <span className="font-mono font-semibold text-foreground">
                                ${((avgSalary / 2080) * attendees).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>Cost per minute:</span>
                            <span className="font-mono font-semibold text-foreground">
                                ${((avgSalary / 2080 / 60) * attendees).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Start Button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-base h-12 shadow-lg shadow-emerald-500/20"
                    >
                        Start Meeting Timer
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
