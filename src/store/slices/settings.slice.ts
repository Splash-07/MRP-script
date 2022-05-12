import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
  findContractForCookIsEnabled: boolean;
}

const initialState: SettingsState = {
  findContractForCookIsEnabled: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleFindContractForCook: (state) => {
      state.findContractForCookIsEnabled = !state.findContractForCookIsEnabled;
    },
  },
});

export const { toggleFindContractForCook } = settingsSlice.actions;

export default settingsSlice.reducer;
