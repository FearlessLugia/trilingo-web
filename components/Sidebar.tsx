'use client';

import { Search, Bookmark, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { resetStack, pushPane } from '@/lib/store/features/paneStackSlice';
import { RootState } from '@/lib/store/store';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const dispatch = useDispatch();
  const { panes } = useSelector((state: RootState) => state.paneStack);

  const handleNav = (type: 'search' | 'saved' | 'me') => {
    if (type === 'search') {
      dispatch(resetStack());
    } else {
      dispatch(pushPane({ type, params: {}, sourceIndex: 0 }));
    }
  };

  return (
    <div className="w-16 h-full border-r border-border bg-card flex flex-col items-center py-6 gap-8 flex-shrink-0 z-20">
      <div className="text-primary font-black text-2xl mb-4 tracking-tighter">T</div>
      
      <button 
        onClick={() => handleNav('search')}
        className={cn(
          "p-3 rounded-xl transition-all duration-200",
          panes.some(p => p.type === 'search') && panes.length === 1 ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-accent text-muted-foreground"
        )}
        title="Search"
      >
        <Search className="w-6 h-6" />
      </button>

      <button 
        onClick={() => handleNav('saved')}
        className={cn(
          "p-3 rounded-xl transition-all duration-200",
          panes.some(p => p.type === 'saved') ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-accent text-muted-foreground"
        )}
        title="Saved"
      >
        <Bookmark className="w-6 h-6" />
      </button>

      <div className="mt-auto flex flex-col gap-6">
        <button 
          onClick={() => handleNav('me')}
          className={cn(
            "p-3 rounded-xl transition-all duration-200",
            panes.some(p => p.type === 'me') ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-accent text-muted-foreground"
          )}
          title="Profile"
        >
          <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
