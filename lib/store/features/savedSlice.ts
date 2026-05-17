import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SavedEntry {
  headword: string;
  pivot: string;
  timestamp: number;
}

interface SavedState {
  entries: SavedEntry[];
}

const initialState: SavedState = {
  entries: [],
};

const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    toggleSaved: (state, action: PayloadAction<{ headword: string; pivot: string }>) => {
      const { headword, pivot } = action.payload;
      const index = state.entries.findIndex(e => e.headword === headword && e.pivot === pivot);
      if (index >= 0) {
        state.entries.splice(index, 1);
      } else {
        state.entries.unshift({ headword, pivot, timestamp: Date.now() });
      }
    },
    clearSaved: (state) => {
      state.entries = [];
    },
  },
});

export const { toggleSaved, clearSaved } = savedSlice.actions;
export default savedSlice.reducer;
