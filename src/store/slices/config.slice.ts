import { createSlice } from '@reduxjs/toolkit';
import { GameConfig, InternalConfig } from '../../types';

const TEMPLATE_ID_LOGOTYPE = 101;
const TEMPLATE_ID_COOK_RAW = 434217;
const TEMPLATE_ID_COOK_RARE = 434222;
const TEMPLATE_ID_COOK_MEDIUM_RARE = 434221;
const TEMPLATE_ID_COOK_MEDIUM_WELL = 434219;
const TEMPLATE_ID_COOK_WELL_DONE = 434218;
const TEMPLATE_ID_CHEF_RAW = 441193;
const TEMPLATE_ID_CHEF_RARE = 516765;
const TEMPLATE_ID_CHEF_MEDIUM_RARE = -1;
const TEMPLATE_ID_CHEF_MEDIUM_WELL = -1;
const TEMPLATE_ID_CHEF_WELL_DONE = -1;
const TEMPLATE_ID_RESTAURANT_RAW = 485187;
const TEMPLATE_ID_RESTAURANT_RARE = 512769;
const TEMPLATE_ID_RESTAURANT_MEDIUM_RARE = 526003;
const TEMPLATE_ID_RESTAURANT_MEDIUM_WELL = -1;
const TEMPLATE_ID_RESTAURANT_WELL_DONE = -1;

const internalConfig: InternalConfig = {
  templateIdNames: {
    [TEMPLATE_ID_COOK_RAW]: 'Cook Raw',
    [TEMPLATE_ID_COOK_RARE]: 'Cook Rare',
    [TEMPLATE_ID_COOK_MEDIUM_RARE]: 'Cook Medium Rare',
    [TEMPLATE_ID_COOK_MEDIUM_WELL]: 'Cook Medium Well',
    [TEMPLATE_ID_COOK_WELL_DONE]: 'Cook Well Done',
    [TEMPLATE_ID_CHEF_RAW]: 'Chef Raw',
    [TEMPLATE_ID_CHEF_RARE]: 'Chef Rare',
    [TEMPLATE_ID_CHEF_MEDIUM_RARE]: 'Chef Medium Rare',
    [TEMPLATE_ID_CHEF_MEDIUM_WELL]: 'Chef Medium Well',
    [TEMPLATE_ID_CHEF_WELL_DONE]: 'Chef Well Done',
    [TEMPLATE_ID_RESTAURANT_RAW]: 'Restaurant Raw',
    [TEMPLATE_ID_RESTAURANT_RARE]: 'Restaurant Rare',
    [TEMPLATE_ID_RESTAURANT_MEDIUM_RARE]: 'Restaurant Medium Rare',
    [TEMPLATE_ID_RESTAURANT_MEDIUM_WELL]: '',
    [TEMPLATE_ID_RESTAURANT_WELL_DONE]: '',
  },
  templateImages: {
    [TEMPLATE_ID_LOGOTYPE]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/logo.svg?alt=media&token=99a1e356-a5cf-45f1-bd7a-4527b7ca7a5c',
    [TEMPLATE_ID_COOK_RAW]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/cook_raw.png?alt=media&token=d23e340d-aa2e-472c-b5f7-aaa05991779c',
    [TEMPLATE_ID_COOK_RARE]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/cook_rare.png?alt=media&token=6e2ab2d9-7797-4d76-a985-38b634c8498f',
    [TEMPLATE_ID_COOK_MEDIUM_RARE]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/cook_medium_rare.png?alt=media&token=8002fa09-e248-4a10-ba3a-e12745dc994a',
    [TEMPLATE_ID_COOK_MEDIUM_WELL]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/cook_medium_well.png?alt=media&token=004943ca-1b68-41bc-96cd-5c464e94be94',
    [TEMPLATE_ID_COOK_WELL_DONE]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/cook_well_done.png?alt=media&token=90ff20f5-954c-4c21-bdf8-5e7128c1931d',
    [TEMPLATE_ID_CHEF_RAW]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/chef_raw.png?alt=media&token=aafc7c67-d5ff-4ca4-bab5-c2d2840dd9db',
    [TEMPLATE_ID_CHEF_RARE]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/chef_rare.png?alt=media&token=bd1ac7cc-5f21-49f0-b28e-32251c339574',
    // [TEMPLATE_ID_CHEF_MEDIUM_RARE]: imageChefMediumRare,
    // [TEMPLATE_ID_CHEF_MEDIUM_WELL]: imageChefMediumWell,
    // [TEMPLATE_ID_CHEF_WELL_DONE]: imageChefWellDone,
    [TEMPLATE_ID_RESTAURANT_RAW]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/restaurant_raw.png?alt=media&token=252f69f5-5ebe-405f-aedf-c6aac732c841',
    [TEMPLATE_ID_RESTAURANT_RARE]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/restaurant_rare.png?alt=media&token=f1ed2d09-bdbb-4c30-8a31-610704568111',
    [TEMPLATE_ID_RESTAURANT_MEDIUM_RARE]:
      'https://firebasestorage.googleapis.com/v0/b/mrp-bot-6f496.appspot.com/o/restaurant_medium_rare.png?alt=media&token=0e3e4c02-202f-481f-8bbe-fc1ef4840409',
    // [TEMPLATE_ID_RESTAURANT_MEDIUM_WELL]: imageRestaurantMediumWell,
    // [TEMPLATE_ID_RESTAURANT_WELL_DONE]: imageRestaurantWellDone,
  },
};
const gameConfig: GameConfig = (window as any).Config ?? {
  rarities: [
    'RARITY_RAW',
    'RARITY_RARE',
    'RARITY_MEDIUM_RARE',
    'RARITY_MEDIUM_WELL',
    'RARITY_WELL_DONE',
  ],
  rarity_names: {
    RARITY_RAW: 'Raw',
    RARITY_RARE: 'Rare',
    RARITY_MEDIUM_RARE: 'Medium Rare',
    RARITY_MEDIUM_WELL: 'Medium Well',
    RARITY_WELL_DONE: 'Well Done',
  },
  rarity_levels: {
    RARITY_RAW: 1,
    RARITY_RARE: 2,
    RARITY_MEDIUM_RARE: 3,
    RARITY_MEDIUM_WELL: 4,
    RARITY_WELL_DONE: 5,
  },
  templates_in_game: [
    434217, 434222, 434221, 434219, 434218, 441193, 516765, -1, -1, -1, 434228,
    434226, 434232, 434233, 434234, 485187, 512769, 526003, 533786, -1, 407037,
    407038, 407040, 407041, 407042, 437349, 437345, 485208, 485207, 485216,
    485204, 485190, 485193, 534043, 437346, 441209, 441208, 442120, 485212,
    441210, 485202, 441212, 525696, 437343, 437344, 416361, 441207, 512776,
    512774, 437347, 441194, 534025, 437350, 433259, 525663, 534026, 475222,
    475223, 475224,
  ],
  restaurant_statuses: {
    RESTAURANT_STATUS_OPENED: 'Opened',
    RESTAURANT_STATUS_CLOSED: 'Closed',
  },
  character_statuses: {
    CHARACTER_STATUS_READY: 'Ready',
    CHARACTER_STATUS_WAITING_FOR_COOK: 'Waiting',
    CHARACTER_STATUS_COOKING: 'Cooking',
    CHARACTER_STATUS_ON_CONTRACT: 'On contract',
    CHARACTER_STATUS_ON_REST: 'Rest',
    CHARACTER_STATUS_WAITING_TO_OPEN_RESTAURANT: 'Waiting restaurant open',
    CHARACTER_STATUS_ON_PVP: 'On pvp',
    CHARACTER_STATUS_ON_BATTLE_PVP: 'On battle',
  },
  sort_types: {
    fee: 'Fee',
    '-end_work': 'Time',
  },
  cook_templates: [434217, 434222, 434221, 434219, 434218, 475222],
  chef_templates: [441193, 516765, -1, -1, -1],
  card_types: {
    CARD_TYPE_COOK: 'CARD_TYPE_COOK',
    CARD_TYPE_CHEF: 'CARD_TYPE_CHEF',
    CARD_TYPE_HELPER: 'CARD_TYPE_HELPER',
    CARD_TYPE_RESTAURANT: 'CARD_TYPE_RESTAURANT',
    CARD_TYPE_DISH: 'CARD_TYPE_DISH',
    CARD_TYPE_SLICE_OF_CAKE: 'CARD_TYPE_SLICE_OF_CAKE',
  },
  character_contracts: {
    CARD_TYPE_COOK: [1],
    CARD_TYPE_CHEF: [3, 7, 30],
  },
  helper_speed_up: {
    '434226': 10,
    '434228': 5,
    '434232': 15,
    '434233': 20,
    '434234': 25,
    '475223': 25,
  },
  dishes_to_cook_max_count_by_category: {
    restaurant_dishes: 1,
    chef_dishes: 1,
    worker_dishes: 100,
  },
  dishes_time_to_cook: {
    '416361': 70,
    '433259': 80,
    '437343': 60,
    '437344': 40,
    '437345': 40,
    '437346': 30,
    '437347': 60,
    '437349': 30,
    '437350': 60,
    '441194': 70,
    '441207': 80,
    '441208': 60,
    '441209': 50,
    '441210': 80,
    '441212': 90,
    '442120': 70,
    '475224': 60,
    '485190': 30,
    '485193': 90,
    '485202': 30,
    '485204': 80,
    '485207': 60,
    '485208': 50,
    '485212': 40,
    '485216': 70,
    '512774': 50,
    '512776': 50,
    '525663': 70,
    '525696': 60,
    '534025': 90,
    '534026': 90,
    '534043': 40,
  },
  dish_slots_by_template_id: {
    '434217': 2,
    '434218': 4,
    '434219': 4,
    '434221': 3,
    '434222': 3,
    '441193': 4,
    '475222': 2,
    '485187': 2,
    '512769': 3,
    '516765': 4,
    '526003': 4,
    '533786': 4,
    '-1': 4,
  },
  helper_slots_by_template_id: {
    '434217': 1,
    '434218': 3,
    '434219': 2,
    '434221': 2,
    '434222': 1,
    '441193': 3,
    '475222': 1,
    '516765': 4,
    '-1': 5,
  },
  restaurant_working_hours_by_template_id: {
    '485187': 12,
    '512769': 15,
    '526003': 15,
    '533786': 15,
    '-1': 15,
  },
  HELPER_DROP_CHANCES: {
    '434226': 17,
    '434228': 66,
    '434232': 9,
    '434233': 6,
    '434234': 2,
  },
  GAME_WALLET_NAME: 'mrpgamesnfts',
  GAME_COINS_WALLET_NAME: 'mrptokenprod',
  GAME_COINS_PRODUCTION_WALLET_NAME: 'mrptokenprod',
  GAME_NFTS_COLLECTION_NAME: 'mrpotatogame',
  GAME_COINS_SHORT_NAME: 'MRP',
  COIN_PRECISION_AFTER_DOT: '4',
  DISHES_TO_COOK_UPDATE_MINUTES: 180,
  PRICE_SHOP_HELPER: 250,
  SHOP_MAX_COUNT_TO_BUY_HELPER: 10,
  CRAFT_COOK_FROM_HELPER_CHANCES: {
    '3': {
      '434217': 100,
      '434221': 0,
      '434222': 0,
    },
    '4': {
      '434217': 97,
      '434221': 0,
      '434222': 3,
    },
    '5': {
      '434217': 94,
      '434221': 0,
      '434222': 6,
    },
    '6': {
      '434217': 90,
      '434221': 0,
      '434222': 10,
    },
    '7': {
      '434217': 85,
      '434221': 0,
      '434222': 15,
    },
    '8': {
      '434217': 79,
      '434221': 0,
      '434222': 21,
    },
    '9': {
      '434217': 70,
      '434221': 0,
      '434222': 30,
    },
    '10': {
      '434217': 66.7,
      '434221': 0.3,
      '434222': 33,
    },
    '11': {
      '434217': 60.4,
      '434221': 0.6,
      '434222': 39,
    },
    '12': {
      '434217': 44.8,
      '434221': 1.2,
      '434222': 54,
    },
    '13': {
      '434217': 44.4,
      '434221': 1.6,
      '434222': 54,
    },
    '14': {
      '434217': 34.7,
      '434221': 2.3,
      '434222': 63,
    },
    '15': {
      '434217': 0,
      '434221': 4,
      '434222': 96,
    },
  },
  CRAFT_COOK_FROM_HELPER_ALLOWED_COOK_TEMPLATE_IDS: [434217, 434222, 434221],
  CRAFT_COOK_FROM_HELPER_HELPERS_COUNT: 3,
  CRAFT_COOK_FROM_HELPER_PRICE: 250,
  PRICE_RESTAURANT_SLOT_INTERNAL_TEAM: {
    '485187': 2000,
    '512769': 2000,
    '526003': 2000,
    '533786': 2000,
    '-1': 2000,
  },
  PRICE_RESTAURANT_SLOT_EXTERNAL_TEAM: {
    '485187': 1000,
    '512769': 1000,
    '526003': 1000,
    '533786': 1000,
    '-1': 1000,
  },
  RESTAURANT_BUY_SLOT_TYPES: {
    RESTAURANT_BUY_SLOT_TYPE_INTERNAL: 'RESTAURANT_BUY_SLOT_TYPE_INTERNAL',
    RESTAURANT_BUY_SLOT_TYPE_EXTERNAL: 'RESTAURANT_BUY_SLOT_TYPE_EXTERNAL',
  },
  EXCHANGE_SLICE_OF_CAKE_COUNT: 6,
  CHEF_CONTRACT_REWARD_PERCENTS: {
    '3': 5,
    '7': 15,
    '30': 100,
  },
  CHEF_CONTRACT_REWARD_PERCENTS_BY_RARITY_LEVEL: {
    '1': {
      '3': 5,
      '7': 15,
      '30': 100,
    },
    '2': {
      '3': 7,
      '7': 21,
      '30': 140,
    },
    '3': {
      '3': 9,
      '7': 27,
      '30': 185,
    },
    '4': {
      '3': 11,
      '7': 33,
      '30': 235,
    },
  },
  PRICE_SLICE_OF_CAKE: {
    '407037': 20,
    '407038': 40,
    '407040': 56,
    '407041': 68,
    '407042': 78,
  },
  RARITY_LEVELS_BY_TEMPLATE_ID: {
    '407037': 1,
    '407038': 2,
    '407040': 3,
    '407041': 4,
    '407042': 5,
    '416361': 3,
    '433259': 5,
    '434217': 1,
    '434218': 5,
    '434219': 4,
    '434221': 3,
    '434222': 2,
    '434226': 2,
    '434228': 1,
    '434232': 3,
    '434233': 4,
    '434234': 5,
    '437343': 3,
    '437344': 3,
    '437345': 1,
    '437346': 2,
    '437347': 4,
    '437349': 1,
    '437350': 5,
    '441193': 1,
    '441194': 4,
    '441207': 3,
    '441208': 2,
    '441209': 2,
    '441210': 2,
    '441212': 2,
    '442120': 2,
    '485187': 1,
    '485190': 1,
    '485193': 1,
    '485202': 2,
    '485204': 1,
    '485207': 1,
    '485208': 1,
    '485212': 2,
    '485216': 1,
    '512769': 2,
    '512774': 4,
    '512776': 3,
    '516765': 2,
    '525663': 5,
    '525696': 2,
    '526003': 3,
    '533786': 4,
    '534025': 4,
    '534026': 5,
    '534043': 1,
    '-1': 5,
  },
  RESTAURANT_NAME_PRICE: 500,
  COIN_CLAIM_TYPES: {
    COIN_CLAIM_TYPE_COOKING: 'Cooking',
    COIN_CLAIM_TYPE_RESTAURANT_FEE: 'Restaurant fee',
    COIN_CLAIM_TYPE_CHEF_CONTRACT_REWARD: 'Chef contract reward',
    COIN_CLAIM_TYPE_CHEF_DISH_EVENT: 'Chef dish event',
  },
  COIN_TRANSACTION_TYPES: {
    COIN_TRANSACTION_TYPE_WITHDRAWN: 'Withdrawn',
    COIN_TRANSACTION_TYPE_DEPOSIT: 'Deposit',
    COIN_TRANSACTION_TYPE_BURN_SLICES_CAKE: 'Cakes exchange',
    COIN_TRANSACTION_TYPE_BUY_HELPER: 'Buy helper',
    COIN_TRANSACTION_TYPE_BUY_DISH: 'Buy dish',
    COIN_TRANSACTION_TYPE_BUY_AD: 'Restaurant ad',
    COIN_TRANSACTION_TYPE_BUY_RESTAURANT_NAME: 'Restaurant name',
    COIN_TRANSACTION_TYPE_BUY_RESTAURANT_INTERNAL_SLOT: 'Internal slot',
    COIN_TRANSACTION_TYPE_BUY_RESTAURANT_EXTERNAL_SLOT: 'External slot',
    COIN_TRANSACTION_TYPE_CLAIM_COIN: 'Claim',
    COIN_TRANSACTION_TYPE_CRAFT_COOK_FROM_HELPERS: 'Helpers exchange',
    COIN_TRANSACTION_TYPE_WITHDRAWN_FEE: 'Withdrawn fee',
    COIN_TRANSACTION_UPGRADE_COOK: 'Upgrade cook',
    COIN_TRANSACTION_UPGRADE_CHEF: 'Upgrade chef',
    COIN_TRANSACTION_UPGRADE_RESTAURANT: 'Upgrade restaurant',
    COIN_TRANSACTION_PVP_COOK: 'Pvp cook',
    COIN_TRANSACTION_BATTLE_PVP: 'Battle pvp',
    COIN_TRANSACTION_COOK_BUY_QUESTS: 'Buy quests',
  },
  WITHDRAW_FEE_DAYS_COUNT: 20,
  PRICE_UPGRADE_UNITS: {
    '434217': 100,
    '434218': 1600,
    '434219': 800,
    '434221': 400,
    '434222': 200,
    '441193': 5000,
    '485187': 12000,
    '512769': 36000,
    '516765': 10000,
    '526003': 72000,
    '-1': 2500,
  },
  QUEST_SPEED_PERCENT_REQUIREMENTS: {
    CARD_TYPE_COOK: {
      '1': 5,
      '2': 10,
      '3': 24,
      '4': 35,
      '5': 45,
    },
    CARD_TYPE_CHEF: {
      '1': 45,
      '2': 54,
      '3': 55,
      '4': 55,
      '5': 55,
    },
  },
  UPGRADE_RELATIONS_BY_TEMPLATE_ID: {
    '434217': 434222,
    '434218': 441193,
    '434219': 434218,
    '434221': 434219,
    '434222': 434221,
    '441193': 516765,
    '485187': 512769,
    '512769': 526003,
    '516765': -1,
    '526003': 533786,
    '533786': -1,
    '-1': -1,
  },
  DISH_PRICES: {
    '416361': 19.6,
    '433259': 60.8,
    '437343': 16.8,
    '437344': 11.2,
    '437345': 4,
    '437346': 4.8,
    '437347': 27.6,
    '437349': 3,
    '437350': 45.6,
    '441194': 32.2,
    '441207': 22.4,
    '441208': 9.6,
    '441209': 8,
    '441210': 12.8,
    '441212': 14.4,
    '442120': 11.2,
    '485190': 3,
    '485193': 9,
    '485202': 4.8,
    '485204': 8,
    '485207': 6,
    '485208': 5,
    '485212': 6.4,
    '485216': 7,
    '512774': 23,
    '512776': 14,
    '525663': 53.2,
    '525696': 9.6,
    '534025': 41.4,
    '534026': 68.4,
    '534043': 4,
  },
  PRICE_PVP_COOK_JOIN: 400,
  PVP_COOK_STAGES: {
    '12:00': {
      title: 'Preparing',
      stage_number: 1,
      sub_stages: {
        '12:00': {
          sub_stage_number: 1,
          end: '12:10',
        },
        '12:10': {
          sub_stage_number: 2,
          end: '12:20',
        },
        '12:20': {
          sub_stage_number: 3,
          end: '12:30',
        },
        '12:30': {
          sub_stage_number: 4,
          end: '12:40',
        },
        '12:40': {
          sub_stage_number: 5,
          end: '12:50',
        },
        '12:50': {
          sub_stage_number: 6,
          end: '13:00',
        },
      },
    },
    '13:00': {
      title: 'Cooking',
      stage_number: 2,
      sub_stages: {
        '13:00': {
          sub_stage_number: 1,
          end: '15:00',
        },
      },
    },
    '15:00': {
      title: 'Serving',
      stage_number: 3,
      sub_stages: {
        '15:00': {
          sub_stage_number: 1,
          end: '15:00',
        },
      },
    },
  },
  PRICE_QUEST_COOK_BY_RARITY_LEVEL: {
    '1': 4,
    '2': 5,
    '3': 6,
    '4': 7,
    '5': 8,
  },
  BATTLE_PVP_JOIN_PRICE_BY_CARD_TYPES: {
    CARD_TYPE_COOK: 200,
    CARD_TYPE_CHEF: 1000,
  },
  BATTLE_PVP_EVENT_TYPES_BY_CARD_TYPE: {
    CARD_TYPE_COOK: 'BATTLE_PVP_EVENT_TYPE_COOK',
    CARD_TYPE_CHEF: 'BATTLE_PVP_EVENT_TYPE_CHEF',
  },
  BATTLE_PVP_PARTICIPANT_TYPES_BY_CARD_TYPE: {
    CARD_TYPE_COOK: 'BATTLE_PVP_PARTICIPANT_TYPE_COOK',
    CARD_TYPE_CHEF: 'BATTLE_PVP_PARTICIPANT_TYPE_COOK',
  },
  PVP_BATTLE_DISH_BOOST_LIMIT: 80,
  KARMA_PERCENT_RELATIONS: {
    '0': 99,
    '10': 84,
    '20': 68,
    '30': 52,
    '40': 36,
    '50': 20,
    '60': 16,
    '70': 12,
    '80': 8,
    '90': 4,
    '100': 0,
  },
};

export interface ConfigState {
  game: GameConfig;
  internal: InternalConfig;
}

const initialState: ConfigState = {
  game: gameConfig,
  internal: internalConfig,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setGameConfig: (state) => {
      state.game = (window as any).Config;
    },
  },
});

export const { setGameConfig } = configSlice.actions;

export default configSlice.reducer;
