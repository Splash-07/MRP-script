import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
  findContractForCookIsEnabled: boolean;
  signContractWithRestaurant: {
    state: boolean;
    restaurantId: string;
  };
}

const initialState: SettingsState = {
  findContractForCookIsEnabled: false,
  signContractWithRestaurant: {
    state: false,
    restaurantId: "",
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleFindContractForCook: (state) => {
      state.findContractForCookIsEnabled = !state.findContractForCookIsEnabled;
    },
    toggleSignContractWithRestaurant: (state) => {
      state.signContractWithRestaurant.state = !state.signContractWithRestaurant.state;
    },
    setRestaurantId: (state, { payload }: { payload: string }) => {
      state.signContractWithRestaurant.restaurantId = payload;
    },
  },
});

export const { toggleFindContractForCook, toggleSignContractWithRestaurant, setRestaurantId } = settingsSlice.actions;

export default settingsSlice.reducer;
