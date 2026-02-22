import { MeetingRecord, SalaryPreset } from './types';

// ============================================
// MEETINGS — API with localStorage fallback
// ============================================

export async function getMeetings(): Promise<MeetingRecord[]> {
    try {
        const response = await fetch('/api/meetings');
        if (response.ok) {
            const data = await response.json();
            return data.meetings as MeetingRecord[];
        }
    } catch {
        // Fall through to localStorage if API fails or user is unauthenticated
    }

    // Fallback: localStorage
    const saved = localStorage.getItem('meetingburn_meetings');
    if (saved) {
        try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
}

export async function saveMeeting(meeting: MeetingRecord): Promise<MeetingRecord> {
    try {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meeting),
        });

        if (response.ok) {
            const data = await response.json();
            return data.meeting as MeetingRecord;
        }
    } catch {
        // Fall through to localStorage
    }

    // Fallback: localStorage
    const existing = await getMeetings();
    const updated = [meeting, ...existing];
    localStorage.setItem('meetingburn_meetings', JSON.stringify(updated));
    return meeting;
}

export async function deleteMeeting(id: string): Promise<void> {
    try {
        const response = await fetch(`/api/meetings/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            return;
        }
    } catch {
        // Fall through to localStorage
    }

    // Fallback: localStorage
    const existing = await getMeetings();
    const filtered = existing.filter(m => m.id !== id);
    localStorage.setItem('meetingburn_meetings', JSON.stringify(filtered));
}

// ============================================
// SALARY PRESETS
// ============================================

// TODO: Create dedicated API routes for presets and profile if full persistence is needed.
// For now, these utilize localStorage as the API for profiles isn't fully wired for NextAuth yet.

export async function getPresets(): Promise<SalaryPreset[]> {
    const saved = localStorage.getItem('meetingburn_presets');
    if (saved) {
        try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
}

export async function savePresets(presets: SalaryPreset[]): Promise<void> {
    localStorage.setItem('meetingburn_presets', JSON.stringify(presets));
}

export async function getDefaultSalary(): Promise<number> {
    const saved = localStorage.getItem('meetingburn_default_salary');
    return saved ? Number(saved) : 120000;
}

export async function saveDefaultSalary(salary: number): Promise<void> {
    localStorage.setItem('meetingburn_default_salary', salary.toString());
}
