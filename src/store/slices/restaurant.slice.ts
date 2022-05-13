import { Restaurant, Character, NextActionInfo } from "./../../types/index";
import { createSlice } from "@reduxjs/toolkit";

export interface RestaurantState {
  isInitialized: boolean;
  isLoading: boolean;
  isNextActionAllowed: boolean;
  isStartButtonDisabled: boolean;
  data: {
    restaurants?: Restaurant[];
    characters?: Character[];
  };
  next: number | null;
}

const initialState: RestaurantState = {
  isInitialized: false,
  isLoading: false,
  isNextActionAllowed: false,
  isStartButtonDisabled: false,
  data: {
    restaurants: undefined,
    characters: undefined,
  },
  next: null,
};

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    update: (state, { payload }: { payload: NextActionInfo }) => {
      const { characters, restaurants, timeToNextAction } = payload;
      state.data.characters = characters;
      state.data.restaurants = restaurants;
      state.next = timeToNextAction;
    },
    setLoading: (state, { payload }: { payload: boolean }) => {
      state.isLoading = payload;
      state.isStartButtonDisabled = payload;
    },
    setInitialize: (state, { payload }: { payload: boolean }) => {
      state.isInitialized = payload;
    },
    setNextActionAllowance: (state, { payload }: { payload: boolean }) => {
      state.isNextActionAllowed = payload;
    },
  },
});

export const { update, setLoading, setInitialize, setNextActionAllowance } = restaurantSlice.actions;

export default restaurantSlice.reducer;
