'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Flame, LayoutDashboard, Github, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                        <Flame className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg">
                        Meeting<span className="text-emerald-400">Burn</span>
                    </span>
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard" className="gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <a
                            href="https://github.com/iamgagan/meetingburn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                        >
                            <Github className="w-4 h-4" />
                            <span className="hidden sm:inline">GitHub</span>
                        </a>
                    </Button>

                    {session?.user ? (
                        <Link href="/dashboard" className="ml-1">
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt=""
                                    className="w-8 h-8 rounded-full border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-colors"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 border-2 border-emerald-500/30">
                                    {session.user.name?.[0] || '?'}
                                </div>
                            )}
                        </Link>
                    ) : (
                        <Button
                            size="sm"
                            className="ml-1 bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
                            asChild
                        >
                            <Link href="/signin">
                                <LogIn className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Sign In</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
