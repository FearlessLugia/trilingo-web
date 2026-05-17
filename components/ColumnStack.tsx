'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { SearchPane } from './panes/SearchPane';
import { WordPane } from './panes/WordPane';
import { SynsetPane } from './panes/SynsetPane';
import { SavedPane } from './panes/SavedPane';
import { MePane } from './panes/MePane';
import { Pane } from '@/lib/store/features/paneStackSlice';
import { useEffect, useRef } from 'react';

export function ColumnStack() {
  useKeyboardShortcuts();
  const { panes, activeIndex } = useSelector((state: RootState) => state.paneStack);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smoothly scroll to the active pane
    if (containerRef.current) {
      const paneWidth = 400; // Fixed width for now
      containerRef.current.scrollTo({
        left: Math.max(0, (activeIndex - 0.5) * paneWidth),
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const renderPane = (pane: Pane, index: number) => {
    switch (pane.type) {
      case 'search':
        return <SearchPane key={pane.id} index={index} />;
      case 'word':
        return <WordPane key={pane.id} index={index} params={pane.params} />;
      case 'synset':
        return <SynsetPane key={pane.id} index={index} params={pane.params} />;
      case 'saved':
        return <SavedPane key={pane.id} index={index} />;
      case 'me':
        return <MePane key={pane.id} index={index} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 relative overflow-hidden h-full">
      <div 
        ref={containerRef}
        className="flex h-full overflow-x-auto no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {panes.map((pane, index) => (
          <div
            key={pane.id}
            className="min-w-[400px] w-[400px] h-full border-r border-border bg-card flex-shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            {renderPane(pane, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
