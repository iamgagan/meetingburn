import { supabase } from './supabase';
import { MeetingRecord, SalaryPreset } from './types';

// ============================================
// MEETINGS — Supabase with localStorage fallback
// ============================================

export async function getMeetings(): Promise<MeetingRecord[]> {
    // Try Supabase first
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('meetings')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && data) return data as MeetingRecord[];
        }
    } catch {
        // Fall through to localStorage
    }

    // Fallback: localStorage
    const saved = localStorage.getItem('meetingburn_meetings');
    if (saved) {
        try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
}

export async function saveMeeting(meeting: MeetingRecord): Promise<MeetingRecord> {
    // Try Supabase first
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const row = { ...meeting, user_id: user.id };
            const { data, error } = await supabase
                .from('meetings')
                .insert(row)
                .select()
                .single();
            if (!error && data) return data as MeetingRecord;
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
    // Try Supabase first
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('meetings').delete().eq('id', id);
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

export async function getPresets(): Promise<SalaryPreset[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('salary_presets')
                .select('*')
                .order('created_at', { ascending: true });
            if (!error && data) return data as SalaryPreset[];
        }
    } catch {
        // Fall through
    }

    const saved = localStorage.getItem('meetingburn_presets');
    if (saved) {
        try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
}

export async function savePresets(presets: SalaryPreset[]): Promise<void> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Delete existing and re-insert (simple upsert for hackathon)
            await supabase.from('salary_presets').delete().eq('user_id', user.id);
            if (presets.length > 0) {
                await supabase.from('salary_presets').insert(
                    presets.map(p => ({ ...p, user_id: user.id }))
                );
            }
            return;
        }
    } catch {
        // Fall through
    }

    localStorage.setItem('meetingburn_presets', JSON.stringify(presets));
}

export async function getDefaultSalary(): Promise<number> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('default_salary')
                .eq('id', user.id)
                .single();
            if (data?.default_salary) return Number(data.default_salary);
        }
    } catch {
        // Fall through
    }

    const saved = localStorage.getItem('meetingburn_default_salary');
    return saved ? Number(saved) : 120000;
}

export async function saveDefaultSalary(salary: number): Promise<void> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('profiles').update({ default_salary: salary }).eq('id', user.id);
            return;
        }
    } catch {
        // Fall through
    }

    localStorage.setItem('meetingburn_default_salary', salary.toString());
}
