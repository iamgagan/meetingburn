import { CostCalculation, CostSeverity } from './types';

const WORKING_HOURS_PER_YEAR = 2080; // 40 hrs/week * 52 weeks
const SECONDS_PER_HOUR = 3600;

export function calculateHourlyCost(annualSalary: number, attendees: number): number {
    return (annualSalary / WORKING_HOURS_PER_YEAR) * attendees;
}

export function calculateCostPerSecond(annualSalary: number, attendees: number): number {
    return calculateHourlyCost(annualSalary, attendees) / SECONDS_PER_HOUR;
}

export function calculateTotalCost(
    annualSalary: number,
    attendees: number,
    elapsedSeconds: number
): CostCalculation {
    const hourlyCost = calculateHourlyCost(annualSalary, attendees);
    const costPerSecond = hourlyCost / SECONDS_PER_HOUR;
    const totalCost = costPerSecond * elapsedSeconds;

    return {
        hourlyCost,
        costPerSecond,
        totalCost,
        elapsedSeconds,
    };
}

export function getCostSeverity(totalCost: number): CostSeverity {
    if (totalCost < 50) return 'low';
    if (totalCost < 200) return 'medium';
    if (totalCost < 500) return 'high';
    return 'critical';
}

export function getCostColor(severity: CostSeverity): string {
    switch (severity) {
        case 'low':
            return 'text-emerald-400';
        case 'medium':
            return 'text-yellow-400';
        case 'high':
            return 'text-orange-400';
        case 'critical':
            return 'text-red-400';
    }
}

export function getCostGlowColor(severity: CostSeverity): string {
    switch (severity) {
        case 'low':
            return '0 0 30px rgba(52, 211, 153, 0.3)';
        case 'medium':
            return '0 0 30px rgba(250, 204, 21, 0.3)';
        case 'high':
            return '0 0 30px rgba(251, 146, 60, 0.3)';
        case 'critical':
            return '0 0 30px rgba(248, 113, 113, 0.4)';
    }
}

export function formatCost(cost: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(cost);
}

export function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
        return `${hrs}h ${mins}m ${secs}s`;
    }
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}
