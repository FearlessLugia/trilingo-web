import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PaneType = 'search' | 'word' | 'synset' | 'saved' | 'me';

export interface Pane {
  id: string;
  type: PaneType;
  params: any;
}

interface PaneStackState {
  panes: Pane[];
  activeIndex: number; // The index of the pane that is currently focused/centered
}

const initialState: PaneStackState = {
  panes: [{ id: 'root-search', type: 'search', params: {} }],
  activeIndex: 0,
};

const paneStackSlice = createSlice({
  name: 'paneStack',
  initialState,
  reducers: {
    pushPane: (state, action: PayloadAction<{ type: PaneType; params: any; sourceIndex: number }>) => {
      const { type, params, sourceIndex } = action.payload;
      const id = `${type}-${Date.now()}`;
      
      // When pushing from sourceIndex, we remove everything after sourceIndex
      state.panes = state.panes.slice(0, sourceIndex + 1);
      state.panes.push({ id, type, params });
      state.activeIndex = state.panes.length - 1;
    },
    popPane: (state) => {
      if (state.panes.length > 1) {
        state.panes.pop();
        state.activeIndex = Math.max(0, state.panes.length - 1);
      }
    },
    setActiveIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.panes.length) {
        state.activeIndex = action.payload;
      }
    },
    resetStack: (state) => {
      state.panes = [{ id: 'root-search', type: 'search', params: {} }];
      state.activeIndex = 0;
    },
  },
});

export const { pushPane, popPane, setActiveIndex, resetStack } = paneStackSlice.actions;
export default paneStackSlice.reducer;
