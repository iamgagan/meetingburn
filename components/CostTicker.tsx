'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    calculateCostPerSecond,
    getCostSeverity,
    getCostColor,
    getCostGlowColor,
    formatDuration,
} from '@/lib/calculations';

interface CostTickerProps {
    attendees: number;
    avgSalary: number;
    meetingName?: string;
    onStop?: (durationSeconds: number, totalCost: number) => void;
    autoStart?: boolean;
    demo?: boolean;
}

export default function CostTicker({
    attendees,
    avgSalary,
    meetingName = 'Meeting',
    onStop,
    autoStart = false,
    demo = false,
}: CostTickerProps) {
    const [isRunning, setIsRunning] = useState(autoStart);
    const [elapsedMs, setElapsedMs] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const accumulatedRef = useRef<number>(0);

    const costPerSecond = calculateCostPerSecond(avgSalary, attendees);
    const totalCost = costPerSecond * (elapsedMs / 1000);
    const severity = getCostSeverity(totalCost);
    const colorClass = getCostColor(severity);
    const glowStyle = getCostGlowColor(severity);

    const startTimer = useCallback(() => {
        if (intervalRef.current) return;
        startTimeRef.current = Date.now();
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const delta = now - (startTimeRef.current || now);
            setElapsedMs(accumulatedRef.current + delta);
        }, 50);
    }, []);

    const pauseTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        accumulatedRef.current = elapsedMs;
        setIsRunning(false);
    }, [elapsedMs]);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        const finalSeconds = elapsedMs / 1000;
        const finalCost = costPerSecond * finalSeconds;
        setIsRunning(false);
        if (onStop) {
            onStop(Math.round(finalSeconds), finalCost);
        }
    }, [elapsedMs, costPerSecond, onStop]);

    const resetTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setElapsedMs(0);
        accumulatedRef.current = 0;
        startTimeRef.current = null;
        setIsRunning(false);
    }, []);

    useEffect(() => {
        if (autoStart && attendees > 0 && avgSalary > 0) {
            startTimer();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [autoStart, attendees, avgSalary, startTimer]);

    // Format the dollar amount with splitting for animation
    const dollars = Math.floor(totalCost);
    const cents = Math.floor((totalCost % 1) * 100)
        .toString()
        .padStart(2, '0');

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Meeting name */}
            <AnimatePresence>
                {meetingName && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-medium text-muted-foreground uppercase tracking-widest"
                    >
                        {meetingName}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* The big cost display */}
            <motion.div
                className="relative"
                animate={{
                    textShadow: isRunning ? glowStyle : 'none',
                }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className={`font-mono font-bold tracking-tight transition-colors duration-500 ${colorClass}`}
                    style={{ fontSize: demo ? 'clamp(2.5rem, 8vw, 5rem)' : 'clamp(3rem, 10vw, 7rem)' }}
                >
                    <span className="opacity-70">$</span>
                    <AnimatedNumber value={dollars} />
                    <span className="opacity-50">.{cents}</span>
                </motion.div>
            </motion.div>

            {/* Stats row */}
            <div className="flex gap-6 text-sm text-muted-foreground">
                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider opacity-60">Elapsed</span>
                    <span className="font-mono font-semibold text-foreground">
                        {formatDuration(elapsedMs / 1000)}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider opacity-60">Per Second</span>
                    <span className="font-mono font-semibold text-foreground">
                        ${costPerSecond.toFixed(3)}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider opacity-60">Attendees</span>
                    <span className="font-mono font-semibold text-foreground">{attendees}</span>
                </div>
            </div>

            {/* Controls */}
            {!demo && (
                <div className="flex gap-3">
                    {!isRunning && elapsedMs === 0 && (
                        <Button
                            onClick={startTimer}
                            size="lg"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 px-8"
                        >
                            <Play className="w-4 h-4" /> Start
                        </Button>
                    )}
                    {isRunning && (
                        <>
                            <Button
                                onClick={pauseTimer}
                                size="lg"
                                variant="outline"
                                className="gap-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                            >
                                <Pause className="w-4 h-4" /> Pause
                            </Button>
                            <Button
                                onClick={stopTimer}
                                size="lg"
                                variant="outline"
                                className="gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
                            >
                                <Square className="w-4 h-4" /> End Meeting
                            </Button>
                        </>
                    )}
                    {!isRunning && elapsedMs > 0 && (
                        <>
                            <Button
                                onClick={startTimer}
                                size="lg"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
                            >
                                <Play className="w-4 h-4" /> Resume
                            </Button>
                            <Button
                                onClick={stopTimer}
                                size="lg"
                                variant="outline"
                                className="gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
                            >
                                <Square className="w-4 h-4" /> End Meeting
                            </Button>
                            <Button
                                onClick={resetTimer}
                                size="lg"
                                variant="ghost"
                                className="gap-2 text-muted-foreground"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function AnimatedNumber({ value }: { value: number }) {
    const formatted = value.toLocaleString('en-US');
    return (
        <span>
            {formatted.split('').map((char, i) => (
                <motion.span
                    key={`${i}-${char}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'inline-block' }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
}
