import { createSlice } from '@reduxjs/toolkit';

export interface AppState {
  expanded: boolean;
}

const initialState: AppState = {
  expanded: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleMenuExpand: (state) => {
      state.expanded = !state.expanded;
    },
  },
});

export const { toggleMenuExpand } = appSlice.actions;

export default appSlice.reducer;
