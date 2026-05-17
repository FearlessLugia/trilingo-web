'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pushPane } from '@/lib/store/features/paneStackSlice';
import { toggleSaved } from '@/lib/store/features/savedSlice';
import { RootState } from '@/lib/store/store';
import { fetchAlign } from '@/lib/api';
import { Star, ChevronRight, BookOpen } from 'lucide-react';
import { cn, formatWord } from '@/lib/utils';

interface LemmaGroup {
  eng: string[];
  fra: string[];
  spa: string[];
}

interface Synset {
  id: string;
  pos: string;
  gloss: Record<string, string>;
  lemmas: LemmaGroup;
  examples: Record<string, string[]>;
}

export function WordPane({ index, params }: { index: number; params: { headword: string; pivot: string } }) {
  const dispatch = useDispatch();
  const saved = useSelector((state: RootState) => state.saved.entries);
  const isSaved = saved.some(e => e.headword === params.headword && e.pivot === params.pivot);
  const [synsets, setSynsets] = useState<Synset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchAlign(params.headword, params.pivot);
        setSynsets(data.synsets);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.headword, params.pivot]);

  const handleLemmaClick = (e: React.MouseEvent, headword: string, pivot: string) => {
    e.stopPropagation();
    dispatch(pushPane({ 
      type: 'word', 
      params: { headword, pivot },
      sourceIndex: index
    }));
  };

  const handleSynsetClick = (synset: Synset) => {
    dispatch(pushPane({ 
      type: 'synset', 
      params: { id: synset.id, data: synset },
      sourceIndex: index
    }));
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10 h-[89px]">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold capitalize">{formatWord(params.headword)}</h2>
          <span className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border",
            params.pivot === 'eng' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
            params.pivot === 'fra' ? "bg-red-500/10 text-red-600 border-red-500/20" :
            "bg-amber-500/10 text-amber-600 border-amber-500/20"
          )}>
            {params.pivot}
          </span>
        </div>
        <button
          onClick={() => dispatch(toggleSaved(params))}
          className={cn(
            "p-2 rounded-full transition-colors",
            isSaved ? "text-yellow-500 bg-yellow-500/10" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Star className={cn("w-6 h-6", isSaved && "fill-current")} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : synsets.length > 0 ? (
          synsets.map((s) => (
            <div
              key={s.id}
              onClick={() => handleSynsetClick(s)}
              className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold font-mono text-primary bg-primary/10 px-4 py-1.5 rounded-lg tracking-tight">
                  {s.id}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <p className="text-base leading-relaxed mb-5 text-foreground/90 pl-2">
                {s.gloss[params.pivot] || s.gloss['eng']}
              </p>

              <div className="space-y-3">
                {(['eng', 'fra', 'spa'] as const).map(lang => (
                  <div key={lang} className="flex flex-wrap gap-2">
                    {s.lemmas[lang]?.map(lemma => (
                      <button
                        key={lemma}
                        onClick={(e) => handleLemmaClick(e, lemma, lang)}
                        className={cn(
                          "text-[13px] font-bold px-3 py-1 rounded-lg transition-all border",
                          lang === 'eng' ? "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20" :
                          lang === 'fra' ? "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20" :
                          "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                        )}
                      >
                        {formatWord(lemma)}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground">No synsets found for this word.</p>
          </div>
        )}
      </div>
    </div>
  );
}
