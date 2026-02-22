'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Flame, LayoutDashboard, History, Settings, ArrowLeft, Calendar, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/calendar', icon: Calendar, label: 'Calendar Sync' },
        { href: '/dashboard/history', icon: History, label: 'History' },
        { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-border/30 bg-card/20 flex-col">
                <div className="p-4 border-b border-border/20">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Flame className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg">
                            Meeting<span className="text-emerald-400">Burn</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User / Auth Section */}
                <div className="p-4 border-t border-border/20 space-y-2">
                    {session?.user ? (
                        <div className="flex items-center gap-3 px-2 mb-2">
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt=""
                                    className="w-7 h-7 rounded-full"
                                />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                                    {session.user.name?.[0] || '?'}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{session.user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-emerald-400 hover:text-emerald-300"
                            asChild
                        >
                            <Link href="/signin">
                                <LogIn className="w-4 h-4 mr-2" /> Sign In
                            </Link>
                        </Button>
                    )}

                    {session?.user && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-muted-foreground"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-muted-foreground"
                        asChild
                    >
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Link>
                    </Button>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
                <div className="flex items-center justify-between px-4 h-14">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <Flame className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="font-bold">
                            Meeting<span className="text-emerald-400">Burn</span>
                        </span>
                    </Link>
                    <div className="flex gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Button
                                    key={item.href}
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    size="sm"
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <item.icon className="w-4 h-4" />
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <div className="pt-16 md:pt-0 p-4 md:p-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
