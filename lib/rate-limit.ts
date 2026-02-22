import { NextRequest } from 'next/server';

// Simple in-memory token bucket for rate limiting.
// In a production environment with multiple serverless functions,
// you'd use Upstash Redis or Vercel KV for this.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(req: NextRequest, limit: number, windowMs: number, userId?: string): boolean {
    const forwardedFor = req.headers.get('x-forwarded-for');
    // Take the first IP from a comma-separated list
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const key = userId ? `${ip}_${userId}` : ip;
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now - entry.lastReset > windowMs) {
        rateLimitMap.set(key, { count: 1, lastReset: now });
        return true;
    }

    if (entry.count >= limit) {
        return false; // Rate limit exceeded
    }

    entry.count += 1;
    return true;
}
