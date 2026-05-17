'use client';

import { useDispatch } from 'react-redux';
import { clearHistory } from '@/lib/store/features/historySlice';
import { clearSaved } from '@/lib/store/features/savedSlice';
import { Trash2, User, Info, GitGraph as Github } from 'lucide-react';

export function MePane({ index }: { index: number }) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Me
        </h2>
        <p className="text-sm text-muted-foreground">Local Settings & Maintenance</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            Maintenance
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => dispatch(clearHistory())}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors group"
            >
              <span className="text-sm font-medium">Clear Search History</span>
              <Trash2 className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            </button>
            <button
              onClick={() => dispatch(clearSaved())}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors group"
            >
              <span className="text-sm font-medium">Clear Saved Words</span>
              <Trash2 className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            About
          </h3>
          <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Trilingo Web is a modern trilingual dictionary designed for deep semantic exploration across English, French, and Spanish.
              </p>
            </div>
            <a 
              href="https://github.com/FearlessLugia/trilingo-web" 
              target="_blank" 
              className="flex items-center gap-2 text-xs text-primary hover:underline"
            >
              <Github className="w-3.5 h-3.5" />
              Source Code
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
