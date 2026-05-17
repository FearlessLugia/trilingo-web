import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HistoryEntry {
  headword: string;
  pivot: string;
  timestamp: number;
}

interface HistoryState {
  entries: HistoryEntry[];
}

const initialState: HistoryState = {
  entries: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistory: (state, action: PayloadAction<{ headword: string; pivot: string }>) => {
      const { headword, pivot } = action.payload;
      // Remove existing entry if it exists to avoid duplicates and move it to top
      state.entries = state.entries.filter(e => !(e.headword === headword && e.pivot === pivot));
      state.entries.unshift({ headword, pivot, timestamp: Date.now() });
      // Limit to 100 entries
      if (state.entries.length > 100) {
        state.entries.pop();
      }
    },
    clearHistory: (state) => {
      state.entries = [];
    },
  },
});

export const { addHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;
