'use client';

import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Flame, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.72_0.19_160_/_0.08),_transparent_70%)]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mb-8 justify-center group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Flame className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl">
                        Meeting<span className="text-emerald-400">Burn</span>
                    </span>
                </Link>

                <Card className="border-border/30 bg-card/30 backdrop-blur-md">
                    <CardContent className="pt-8 pb-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                            <p className="text-muted-foreground text-sm">
                                Sign in to track your meeting costs and save your data across devices.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                                size="lg"
                                className="w-full gap-3 bg-white hover:bg-gray-100 text-gray-900 font-medium h-12 text-sm"
                            >
                                <Chrome className="w-5 h-5" />
                                Sign in with Google
                            </Button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border/20 text-center">
                            <p className="text-xs text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <button
                                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                                >
                                    Sign up for free
                                </button>
                            </p>
                        </div>

                        <div className="mt-4 text-center">
                            <Link
                                href="/"
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ← Continue without signing in
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-xs text-muted-foreground text-center mt-6">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
}
