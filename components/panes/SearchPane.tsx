'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pushPane } from '@/lib/store/features/paneStackSlice';
import { addHistory } from '@/lib/store/features/historySlice';
import { setSearchQuery } from '@/lib/store/features/searchSlice';
import { RootState } from '@/lib/store/store';
import { fetchLanguages } from '@/lib/api';
import { Search, History, Languages } from 'lucide-react';
import { cn, formatWord } from '@/lib/utils';

type PivotType = 'auto' | 'eng' | 'fra' | 'spa';

export function SearchPane({ index }: { index: number }) {
  const dispatch = useDispatch();
  const { activeIndex } = useSelector((state: RootState) => state.paneStack);
  const history = useSelector((state: RootState) => state.history.entries);
  const query = useSelector((state: RootState) => state.search.query);
  const [pivot, setPivot] = useState<PivotType>('auto');
  const [candidates, setCandidates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when this pane becomes active
  useEffect(() => {
    if (activeIndex === index && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeIndex, index]);

  useEffect(() => {
    if (query.length > 1) {
      const delayDebounceFn = setTimeout(async () => {
        setLoading(true);
        try {
          const data = await fetchLanguages(query);
          setCandidates(data.languages);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setCandidates([]);
    }
  }, [query]);

  const handleSearch = (selectedHeadword: string, selectedPivot: string) => {
    dispatch(addHistory({ headword: selectedHeadword, pivot: selectedPivot }));
    dispatch(pushPane({ 
      type: 'word', 
      params: { headword: selectedHeadword, pivot: selectedPivot },
      sourceIndex: index
    }));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      if (pivot !== 'auto') {
        handleSearch(query.trim(), pivot);
      } else if (candidates.length > 0) {
        handleSearch(query.trim(), candidates[0]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Search className="w-6 h-6 text-primary" />
          Trilingo
        </h1>
        
        <div className="relative">
          <input
            ref={inputRef}
            id="search-input"
            autoFocus
            autoComplete="off"
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="Search words..."
            value={query}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            onKeyDown={onKeyDown}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(['auto', 'eng', 'fra', 'spa'] as PivotType[]).map((p) => (
            <button
              key={p}
              onClick={() => setPivot(p)}
              className={cn(
                "flex-1 py-1.5 text-xs font-medium rounded-md transition-all uppercase",
                pivot === p ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-6">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {query.length > 0 && !loading ? (
          <div className="space-y-1">
            <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Languages className="w-3 h-3" />
              Possibilities
            </h3>
            {candidates.map((c) => (
              <button
                key={c}
                onClick={() => handleSearch(query.trim(), c)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent rounded-xl transition-colors group"
              >
                <span className="font-medium">{formatWord(query.trim())}</span>
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border transition-colors",
                  c === 'eng' ? "bg-blue-500/10 text-blue-600 border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white" :
                  c === 'fra' ? "bg-red-500/10 text-red-600 border-red-500/20 group-hover:bg-red-600 group-hover:text-white" :
                  "bg-amber-500/10 text-amber-600 border-amber-500/20 group-hover:bg-amber-600 group-hover:text-white"
                )}>
                  {c}
                </span>
              </button>
            ))}
            {!loading && candidates.length === 0 && query.length > 1 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">No matches found</p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <History className="w-3 h-3" />
              Recent History
            </h3>
            {history.length > 0 ? (
              history.map((entry, i) => (
                <button
                  key={`${entry.headword}-${entry.pivot}-${i}`}
                  onClick={() => handleSearch(entry.headword, entry.pivot)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent rounded-xl transition-colors group"
                >
                  <span className="font-medium">{formatWord(entry.headword)}</span>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border transition-colors",
                    entry.pivot === 'eng' ? "bg-blue-500/10 text-blue-600 border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white" :
                    entry.pivot === 'fra' ? "bg-red-500/10 text-red-600 border-red-500/20 group-hover:bg-red-600 group-hover:text-white" :
                    "bg-amber-500/10 text-amber-600 border-amber-500/20 group-hover:bg-amber-600 group-hover:text-white"
                  )}>
                    {entry.pivot}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">No search history</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
