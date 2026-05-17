'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { pushPane } from '@/lib/store/features/paneStackSlice';
import { toggleSaved } from '@/lib/store/features/savedSlice';
import { Bookmark, Star, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { cn, formatWord } from '@/lib/utils';

export function SavedPane({ index }: { index: number }) {
  const dispatch = useDispatch();
  const saved = useSelector((state: RootState) => state.saved.entries);
  const [filter, setFilter] = useState('');

  const filtered = saved.filter(e => 
    e.headword.toLowerCase().includes(filter.toLowerCase())
  );

  const handleWordClick = (headword: string, pivot: string) => {
    dispatch(pushPane({ 
      type: 'word', 
      params: { headword, pivot },
      sourceIndex: index
    }));
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-primary" />
          Saved Words
        </h2>
        
        <div className="relative">
          <input
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
            placeholder="Filter saved words..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length > 0 ? (
          filtered.map((entry, i) => (
            <div
              key={`${entry.headword}-${entry.pivot}-${i}`}
              className="group flex items-center gap-2"
            >
              <button
                onClick={() => handleWordClick(entry.headword, entry.pivot)}
                className="flex-1 px-4 py-3 flex items-center justify-between hover:bg-accent rounded-xl transition-colors text-left"
              >
                <div className="space-y-0.5">
                  <p className="font-medium capitalize">{formatWord(entry.headword)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Saved on {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-mono uppercase">
                    {entry.pivot}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
              <button 
                onClick={() => dispatch(toggleSaved(entry))}
                className="p-3 text-yellow-500 hover:text-yellow-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <Bookmark className="w-12 h-12 text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground">
              {filter ? "No matches found" : "Your saved list is empty"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
