export interface MeetingFormData {
  meetingName: string;
  attendees: number;
  avgSalary: number;
}

export interface MeetingRecord {
  id: string;
  user_id: string;
  meeting_name: string;
  attendees: number;
  avg_salary: number;
  duration_seconds: number;
  total_cost: number;
  source: 'manual' | 'calendar';
  calendar_event_id?: string | null;
  is_public: boolean;
  public_slug?: string;
  created_at: string;
}

export interface SalaryPreset {
  id: string;
  user_id: string;
  role_name: string;
  annual_salary: number;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  attendeeCount: number;
}

export interface CostCalculation {
  hourlyCost: number;
  costPerSecond: number;
  totalCost: number;
  elapsedSeconds: number;
}

export type CostSeverity = 'low' | 'medium' | 'high' | 'critical';
