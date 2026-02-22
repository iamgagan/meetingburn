import { NextRequest } from 'next/server';

// Simple in-memory token bucket for rate limiting.
// In a production environment with multiple serverless functions,
// you'd use Upstash Redis or Vercel KV for this.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(req: NextRequest, limit: number, windowMs: number): boolean {
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now - entry.lastReset > windowMs) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
        return true;
    }

    if (entry.count >= limit) {
        return false; // Rate limit exceeded
    }

    entry.count += 1;
    return true;
}
