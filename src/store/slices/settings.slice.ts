import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
  findContractForCookIsEnabled: boolean;
  signWithChoosenRestaurant: {
    isEnabled: boolean;
    restaurant_id: string;
  };
}

const initialState: SettingsState = {
  findContractForCookIsEnabled: true,
  signWithChoosenRestaurant: {
    isEnabled: false,
    restaurant_id: "",
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleFindContractForCook: (state) => {
      state.findContractForCookIsEnabled = !state.findContractForCookIsEnabled;
      state.signWithChoosenRestaurant.isEnabled = false;
    },
    toggleSignContractWithRestaurant: (state) => {
      state.signWithChoosenRestaurant.isEnabled = !state.signWithChoosenRestaurant.isEnabled;
      state.findContractForCookIsEnabled = false;
    },
    setRestaurantId: (state, { payload }: { payload: string }) => {
      state.signWithChoosenRestaurant.restaurant_id = payload;
    },
  },
});

export const { toggleFindContractForCook, toggleSignContractWithRestaurant, setRestaurantId } = settingsSlice.actions;

export default settingsSlice.reducer;
