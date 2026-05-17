'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { setActiveIndex, resetStack } from '@/lib/store/features/paneStackSlice';
import { clearSearch } from '@/lib/store/features/searchSlice';

export function useKeyboardShortcuts() {
  const dispatch = useDispatch();
  const { activeIndex, panes } = useSelector((state: RootState) => state.paneStack);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, UNLESS it's the Escape key
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      if (e.key === 'Escape') {
        dispatch(resetStack());
        dispatch(clearSearch());
        return;
      }

      if (isInput) return;

      if (e.key === 'ArrowLeft') {
        if (activeIndex > 0) {
          dispatch(setActiveIndex(activeIndex - 1));
        }
      } else if (e.key === 'ArrowRight') {
        if (activeIndex < panes.length - 1) {
          dispatch(setActiveIndex(activeIndex + 1));
        }
      } else if (e.key.length === 1 && e.key.match(/[a-z0-9]/i)) {
        // Auto-focus search input if alphanumeric key is pressed
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        } else if (activeIndex !== 0) {
          dispatch(setActiveIndex(0));
          // We might need a small delay or use another effect to focus after transition
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, panes.length, dispatch]);
}
