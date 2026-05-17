'use client';

import { useDispatch } from 'react-redux';
import { pushPane } from '@/lib/store/features/paneStackSlice';
import { Quote, Languages, Info, Tag } from 'lucide-react';
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

export function SynsetPane({ index, params }: { index: number; params: { id: string; data: Synset } }) {
  const dispatch = useDispatch();
  const synset = params.data;

  const handleLemmaClick = (headword: string, pivot: string) => {
    dispatch(pushPane({ 
      type: 'word', 
      params: { headword, pivot },
      sourceIndex: index
    }));
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10 h-[89px]">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{synset.id}</h2>
          <span className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border flex items-center gap-1.5",
            synset.pos === 'noun' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
            synset.pos === 'verb' ? "bg-green-500/10 text-green-600 border-green-500/20" :
            synset.pos === 'adj' ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
            "bg-orange-500/10 text-orange-600 border-orange-500/20"
          )}>
            <Tag className="w-3 h-3" />
            {synset.pos}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em] flex items-center gap-2">
            <Info className="w-3.5 h-3.5" />
            Definition
          </h3>
          <p className="text-base leading-relaxed text-foreground/90">
            {synset.gloss['eng']}
          </p>
        </section>

        <section className="space-y-5">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em] flex items-center gap-2">
            <Languages className="w-3.5 h-3.5" />
            Aligned Lemmas
          </h3>
          <div className="space-y-5">
            {(['eng', 'fra', 'spa'] as const).map(lang => (
              <div key={lang}>
                <span className="block text-[11px] font-black uppercase text-muted-foreground/60 px-1 tracking-wider mb-4">
                  {lang === 'eng' ? 'English' : lang === 'fra' ? 'French' : 'Spanish'}
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {synset.lemmas[lang]?.map(lemma => (
                    <button
                      key={lemma}
                      onClick={() => handleLemmaClick(lemma, lang)}
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
                  {(!synset.lemmas[lang] || synset.lemmas[lang].length === 0) && (
                    <span className="text-sm text-muted-foreground italic px-1">No mapping found</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {synset.examples && Object.keys(synset.examples).length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Quote className="w-3 h-3" />
              Example Sentences
            </h3>
            <div className="space-y-4">
              {Object.entries(synset.examples).map(([lang, examples]) => (
                <div key={lang} className="space-y-3">
                   {examples.map((ex, i) => (
                    <div key={i} className="flex gap-3 text-sm group">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/20 shrink-0 group-hover:bg-primary transition-colors" />
                      <p className="italic leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                        "{ex}"
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="pt-8 border-t border-border">
          <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">About Synsets</p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                A synset (synonym set) represents a specific meaning of a word. 
                In Trilingo, synsets are aligned across English, French, and Spanish 
                to help you discover cross-lingual semantic equivalents.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
