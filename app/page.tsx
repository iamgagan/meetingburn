'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  Calendar,
  BarChart3,
  Zap,
  Clock,
  Share2,
  Users,
  CheckCircle2,
  Flame,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CostTicker from '@/components/CostTicker';
import MeetingForm from '@/components/MeetingForm';
import { MeetingFormData } from '@/lib/types';

export default function LandingPage() {
  const [activeMode, setActiveMode] = useState<'hero' | 'calculator' | 'result'>('hero');
  const [meetingData, setMeetingData] = useState<MeetingFormData | null>(null);
  const [finalResult, setFinalResult] = useState<{
    duration: number;
    cost: number;
    name: string;
  } | null>(null);

  const handleStart = (data: MeetingFormData) => {
    setMeetingData(data);
    setActiveMode('calculator');
  };

  const handleStop = (durationSeconds: number, totalCost: number) => {
    setFinalResult({
      duration: durationSeconds,
      cost: totalCost,
      name: meetingData?.meetingName || 'Meeting',
    });
    setActiveMode('result');
  };

  const handleReset = () => {
    setMeetingData(null);
    setFinalResult(null);
    setActiveMode('hero');
  };

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navbar />

      {/* ============================== */}
      {/* HERO SECTION — Nexus-inspired  */}
      {/* ============================== */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 glow-emerald" />
        <div className="absolute inset-0 glow-purple" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="relative max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Badge
                variant="outline"
                className="mb-8 border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-5 py-2 text-sm backdrop-blur-sm"
              >
                <Flame className="w-3.5 h-3.5 mr-1.5 animate-pulse" /> Real-time meeting cost tracking
              </Badge>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[0.95]">
              See what your
              <br />
              meetings{' '}
              <span className="gradient-text">really cost</span>
              <span className="gradient-text">.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Watch the dollars tick up in real-time. Connect your calendar to auto-track.
              Finally quantify &quot;this could have been an email.&quot;
            </p>

            {/* Demo ticker — Glassmorphism card */}
            <motion.div
              className="inline-block mb-14"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="glass-card rounded-2xl p-10 shadow-2xl shadow-emerald-500/5 animated-border">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-6 font-medium">
                  Live Demo — 8 people × $120k avg salary
                </p>
                <CostTicker
                  attendees={8}
                  avgSalary={120000}
                  meetingName=""
                  autoStart
                  demo
                />
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-background font-semibold px-8 h-13 shadow-lg shadow-emerald-500/25 text-base transition-all hover:shadow-emerald-500/40 hover:scale-[1.02]"
                onClick={() =>
                  document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Try It Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/50 h-13 px-8 text-base hover:bg-accent/50 transition-all"
                asChild
              >
                <a href="/dashboard">
                  <Calendar className="w-4 h-4 mr-2" /> Connect Calendar
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================== */}
      {/* SOCIAL PROOF BAR               */}
      {/* ============================== */}
      <section className="border-y border-border/10 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2,080', label: 'Working hours/year' },
              { value: '$288', label: 'Avg cost/hour (5 devs)' },
              { value: '31hrs', label: 'Avg meetings/week' },
              { value: '$37k+', label: 'Meeting cost/year/team' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="text-2xl font-bold font-mono stat-glow">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* HOW IT WORKS — Bento Grid      */}
      {/* ============================== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-[0.2em] mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold">
              Three steps to stop
              <br />
              <span className="text-muted-foreground">meeting waste</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Calculator,
                title: 'Enter Details',
                desc: 'Add attendee count and average salary, or connect Google Calendar for auto-import.',
                step: '01',
              },
              {
                icon: Clock,
                title: 'Watch It Tick',
                desc: 'Start the meeting timer and watch the real dollar cost climb every second.',
                step: '02',
              },
              {
                icon: TrendingDown,
                title: 'Track & Reduce',
                desc: 'View cost history, identify expensive meetings, and share reports to drive change.',
                step: '03',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Card className="border-border/10 bg-card/40 h-full bento-card glow-card">
                  <CardContent className="pt-8 pb-8 px-7">
                    <div className="text-6xl font-bold text-emerald-500/10 mb-5 font-mono leading-none">
                      {item.step}
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 border border-emerald-500/10">
                      <item.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* CALCULATOR SECTION              */}
      {/* ============================== */}
      <section id="calculator" className="py-24 px-4 relative">
        <div className="absolute inset-0 glow-emerald opacity-50" />
        <div className="relative max-w-2xl mx-auto z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-[0.2em] mb-3">
              Free Calculator
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Calculate your meeting cost
            </h2>
            <p className="text-muted-foreground text-lg">
              No sign-up required. Start tracking right now.
            </p>
          </motion.div>

          {activeMode === 'hero' && <MeetingForm onStart={handleStart} />}

          {activeMode === 'calculator' && meetingData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-10 animated-border"
            >
              <CostTicker
                attendees={meetingData.attendees}
                avgSalary={meetingData.avgSalary}
                meetingName={meetingData.meetingName}
                autoStart
                onStop={handleStop}
              />
            </motion.div>
          )}

          {activeMode === 'result' && finalResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/20 glass-card">
                <CardContent className="pt-10 pb-10 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-3">
                    {finalResult.name} — Final Cost
                  </p>
                  <p className="text-6xl sm:text-7xl font-mono font-bold text-emerald-400 mb-6 stat-glow">
                    ${finalResult.cost.toFixed(2)}
                  </p>
                  <p className="text-muted-foreground mb-8">
                    Duration: {Math.floor(finalResult.duration / 60)}m{' '}
                    {finalResult.duration % 60}s • {meetingData?.attendees} attendees
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleReset} variant="outline" className="gap-2">
                      <Calculator className="w-4 h-4" /> New Meeting
                    </Button>
                    <Button
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-background"
                      asChild
                    >
                      <a href="/dashboard">
                        <Share2 className="w-4 h-4" /> Save & View Dashboard
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* ============================== */}
      {/* FEATURES — Bento Grid          */}
      {/* ============================== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-[0.2em] mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold">
              Everything you need to fight
              <br />
              <span className="text-muted-foreground">meeting waste</span>
            </h2>
          </motion.div>

          {/* Bento-style grid with varying sizes */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Large feature — spans 2 cols */}
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-border/10 bg-card/30 h-full bento-card glow-card">
                <CardContent className="pt-8 pb-8 px-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 border border-emerald-500/10">
                        <Zap className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Real-time Cost Ticker</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                        Watch the dollar amount climb every second with severity-based color
                        coding. Colors shift from green to red as costs escalate. The
                        &quot;oh wow&quot; moment that makes meetings feel real.
                      </p>
                    </div>
                    <div className="hidden sm:block font-mono text-4xl font-bold text-emerald-400/20">
                      $$$
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Regular feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/10 bg-card/30 h-full bento-card glow-card">
                <CardContent className="pt-8 pb-8 px-7">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5 border border-blue-500/10">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Calendar Sync</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Auto-import from Google Calendar. No manual entry needed.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Regular feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border-border/10 bg-card/30 h-full bento-card glow-card">
                <CardContent className="pt-8 pb-8 px-7">
                  <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-5 border border-yellow-500/10">
                    <Users className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Salary Presets</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Set role-based salaries for accurate cost calculations across your team.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Large feature — spans 2 cols */}
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/10 bg-card/30 h-full bento-card glow-card">
                <CardContent className="pt-8 pb-8 px-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center mb-5 border border-purple-500/10">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Cost Analytics</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                        Weekly and monthly charts showing your team&apos;s meeting spend trends.
                        Identify expensive patterns, share reports, and drive real change.
                      </p>
                    </div>
                    <div className="hidden sm:flex gap-1 items-end h-16">
                      {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                        <div
                          key={i}
                          className="w-3 rounded-sm bg-emerald-500/20"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bottom row — 3 equal */}
            {[
              {
                icon: Share2,
                color: 'rose',
                title: 'Shareable Reports',
                desc: 'Generate a public link to share meeting cost summaries.',
              },
              {
                icon: Clock,
                color: 'cyan',
                title: 'Meeting History',
                desc: 'Full log with duration, cost, and attendee data.',
              },
              {
                icon: TrendingDown,
                color: 'amber',
                title: 'CSV Export',
                desc: 'Download your data for deeper analysis in spreadsheets.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.08 }}
              >
                <Card className="border-border/10 bg-card/30 h-full bento-card">
                  <CardContent className="pt-7 pb-7 px-7">
                    <feature.icon className="w-5 h-5 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* PRICING SECTION                */}
      {/* ============================== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 glow-purple opacity-40" />
        <div className="relative max-w-5xl mx-auto z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-[0.2em] mb-3">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-lg">Start free. Upgrade when your team is ready.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: [
                  'Manual calculator',
                  '5 saved meetings/month',
                  'Basic cost display',
                ],
                cta: 'Get Started',
                popular: false,
              },
              {
                name: 'Pro',
                price: '$9',
                period: '/month',
                features: [
                  'Google Calendar sync',
                  'Unlimited meeting history',
                  'Salary presets',
                  'Cost analytics charts',
                  'Shareable reports',
                ],
                cta: 'Start Free Trial',
                popular: true,
              },
              {
                name: 'Team',
                price: '$29',
                period: '/month',
                features: [
                  'Everything in Pro',
                  'Multi-user workspace',
                  'Slack integration',
                  'Weekly cost reports',
                  'Priority support',
                ],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card
                  className={`h-full relative bento-card ${plan.popular
                      ? 'border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/10 animated-border'
                      : 'border-border/10 bg-card/30'
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-emerald-500 text-background border-0 px-4 py-1 font-medium">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4 pt-8">
                    <CardTitle className="text-lg font-medium">{plan.name}</CardTitle>
                    <div className="mt-3">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3.5 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full h-11 ${plan.popular
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-background font-semibold shadow-lg shadow-emerald-500/20'
                          : ''
                        }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* FINAL CTA                      */}
      {/* ============================== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 glow-emerald opacity-30" />
        <div className="relative max-w-3xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Ready to see the
              <br />
              <span className="gradient-text">real cost?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
              Start your next meeting with MeetingBurn running. You might be surprised.
            </p>
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-background font-semibold px-10 h-13 shadow-xl shadow-emerald-500/25 text-base transition-all hover:shadow-emerald-500/40 hover:scale-[1.02]"
              onClick={() =>
                document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Calculate Your Meeting Cost <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
