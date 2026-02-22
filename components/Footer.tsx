import { Flame } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-border/30 bg-background/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <Flame className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-semibold text-sm">
                            Meeting<span className="text-emerald-400">Burn</span>
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Built for the 48-Hour Vibe Coding Hackathon 🚀 &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </footer>
    );
}
