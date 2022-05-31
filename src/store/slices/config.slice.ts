import { createSlice } from "@reduxjs/toolkit";
import { GameConfig, InternalConfig } from "../../types";

const TEMPLATE_ID_LOGOTYPE = 101;
const TEMPLATE_ID_COOK_RAW = 434217;
const TEMPLATE_ID_COOK_RARE = 434222;
const TEMPLATE_ID_COOK_MEDIUM_RARE = 434221;
const TEMPLATE_ID_COOK_MEDIUM_WELL = 434219;
const TEMPLATE_ID_COOK_WELL_DONE = 434218;
const TEMPLATE_ID_CHEF_RAW = 441193;
const TEMPLATE_ID_CHEF_RARE = -1;
const TEMPLATE_ID_CHEF_MEDIUM_RARE = -1;
const TEMPLATE_ID_CHEF_MEDIUM_WELL = -1;
const TEMPLATE_ID_CHEF_WELL_DONE = -1;
const TEMPLATE_ID_RESTAURANT_RAW = 485187;
const TEMPLATE_ID_RESTAURANT_RARE = -1;
const TEMPLATE_ID_RESTAURANT_MEDIUM_RARE = -1;
const TEMPLATE_ID_RESTAURANT_MEDIUM_WELL = -1;
const TEMPLATE_ID_RESTAURANT_WELL_DONE = -1;

const internalConfig: InternalConfig = {
  templateIdNames: {
    [TEMPLATE_ID_COOK_RAW]: "Cook Raw",
    [TEMPLATE_ID_COOK_RARE]: "Cook Rare",
    [TEMPLATE_ID_COOK_MEDIUM_RARE]: "Cook Medium Rare",
    [TEMPLATE_ID_COOK_MEDIUM_WELL]: "Cook Medium Well",
    [TEMPLATE_ID_COOK_WELL_DONE]: "Cook Well Done",
    [TEMPLATE_ID_CHEF_RAW]: "Chef Raw",
    [TEMPLATE_ID_CHEF_RARE]: "Chef Rare",
    [TEMPLATE_ID_CHEF_MEDIUM_RARE]: "Chef Medium Rare",
    [TEMPLATE_ID_CHEF_MEDIUM_WELL]: "Chef Medium Well",
    [TEMPLATE_ID_CHEF_WELL_DONE]: "Chef Well Done",
    [TEMPLATE_ID_RESTAURANT_RAW]: "Restaurant Raw",
    [TEMPLATE_ID_RESTAURANT_RARE]: "",
    [TEMPLATE_ID_RESTAURANT_MEDIUM_RARE]: "",
    [TEMPLATE_ID_RESTAURANT_MEDIUM_WELL]: "",
    [TEMPLATE_ID_RESTAURANT_WELL_DONE]: "",
  },
  templateImages: {
    [TEMPLATE_ID_LOGOTYPE]:
      "https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/logo.svg?alt=media&token=99a1e356-a5cf-45f1-bd7a-4527b7ca7a5c",
    [TEMPLATE_ID_COOK_RAW]:
      "https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/cook_raw.png?alt=media&token=d23e340d-aa2e-472c-b5f7-aaa05991779c",
    [TEMPLATE_ID_COOK_RARE]:
      "https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/cook_rare.png?alt=media&token=6e2ab2d9-7797-4d76-a985-38b634c8498f",
    [TEMPLATE_ID_COOK_MEDIUM_RARE]:
      "https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/cook_medium_rare.png?alt=media&token=8002fa09-e248-4a10-ba3a-e12745dc994a",
    [TEMPLATE_ID_COOK_MEDIUM_WELL]:
      "https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/cook_medium_well.png?alt=media&token=004943ca-1b68-41bc-96cd-5c464e94be94",
    [TEMPLATE_ID_COOK_WELL_DONE]:
      "https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/cook_well_done.png?alt=media&token=90ff20f5-954c-4c21-bdf8-5e7128c1931d",
    [TEMPLATE_ID_CHEF_RAW]:
      "https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/chef_raw.png?alt=media&token=aafc7c67-d5ff-4ca4-bab5-c2d2840dd9db",
    // [TEMPLATE_ID_CHEF_RARE]: imageChefRare,
    // [TEMPLATE_ID_CHEF_MEDIUM_RARE]: imageChefMediumRare,
    // [TEMPLATE_ID_CHEF_MEDIUM_WELL]: imageChefMediumWell,
    // [TEMPLATE_ID_CHEF_WELL_DONE]: imageChefWellDone,
    [TEMPLATE_ID_RESTAURANT_RAW]:
      "https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/restaurant_raw.png?alt=media&token=252f69f5-5ebe-405f-aedf-c6aac732c841",
    // [TEMPLATE_ID_RESTAURANT_RARE]: imageRestaurantRare,
    // [TEMPLATE_ID_RESTAURANT_MEDIUM_RARE]: imageRestaurantMediumRare,
    // [TEMPLATE_ID_RESTAURANT_MEDIUM_WELL]: imageRestaurantMediumWell,
    // [TEMPLATE_ID_RESTAURANT_WELL_DONE]: imageRestaurantWellDone,
  },
};

export interface ConfigState {
  game?: GameConfig;
  internal: InternalConfig;
}

const initialState: ConfigState = {
  game: undefined,
  internal: internalConfig,
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setGameConfig: (state) => {
      state.game = (window as any).Config;
    },
  },
});

export const { setGameConfig } = configSlice.actions;

export default configSlice.reducer;
