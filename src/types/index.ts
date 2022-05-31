export interface Params {
  [key: string]: string | boolean;
}

export interface RestaurantDishMap {
  [key: string]: Card[];
}

export interface Coefficients {
  [key: number]: number;
}

export interface Dish {
  dish_id: string;
  name: string;
  price: number;
  dish_atomichub_template_id: number;
  profit: number;
  time: number;
}

export interface DishPull {
  atomichub_template_id: number;
  cooked_count: number;
  cooked_dish_mining_modifier: number;
  id: "string";
  name: "string";
  price: number;
  rarity: "string";
}

export interface Card {
  atomichub_template_id: number;
  card_id: string;
  created: string;
  id: string;
  owner_id: string;
  updated: string;
}

export interface RestaurantTimerInfo {
  openTime: number;
  currentTime: number;
  timeSinceOpening: number;
  isRestaurantOpened: boolean;
}

export interface DishToCook {
  coin_boost_modifier: number;
  dish_atomichub_template_id: number;
  dish_id: string;
  restaurant_id: string;
  worker_card_id: string;
}

export interface RestaurantDishesToCook {
  chef_dishes: (DishToCook | Card)[];
  next_dishes_to_cook_update: string;
  restaurant_dishes: (DishToCook | Card)[];
  worker_dishes: (DishToCook | Card)[];
}

export interface CharacterTimerInfo {
  cookEnd: number;
  currentTime: number;
  restEnd: number;
  isRestaurantOpened: boolean;
  isCharacterCanStartCook: boolean;
  isCharacterResting: boolean;
}

export interface RestaurantContract {
  actual_end: string;
  card_type: string;
  close_initiator: string;
  created: string;
  days_duration: number;
  dishes_to_cook_last_update: string;
  end: string;
  fee: number;
  id: string;
  is_internal_team: boolean;
  restaurant_id: string;
  start: string;
  updated: string;
  worker_card_atomichub_template_id: string;
  worker_card_id: string;
}

export interface WorkerContract {
  is_internal_team: boolean;
  next_dishes_to_cook_update: string;
  restaurant_end_work: string;
  restaurant_id: string;
  restaurant_start_work: string;
}

export interface Restaurant {
  atomichub_template_id: number;
  bought_dish_slots: number;
  bought_external_team_slots: number;
  bought_internal_team_slots: number;
  card_id: string;
  created: string;
  end_work: string;
  external_team_free_slots: number;
  external_team_total_slots: number;
  fee: number;
  id: string;
  internal_team_free_slots: number;
  internal_team_total_slots: number;
  last_calculated: string;
  min_staff_rating: number;
  name: "Restaurant";
  restaurant_dishes?: { dish: Card }[];
  chefs_dishes?: { dish: Card }[];
  restaurant_worker_contracts: RestaurantContract[];
  owner_id: string;
  rating: number;
  start_work: string;
  start_working_hours: string;
  updated: string;
}

export interface Character {
  atomichub_template_id: number;
  card_id: string;
  card_type: string;

  contract_end: string;
  cook_end: string;
  created: string;
  id: string;
  name: string;
  owner_id: string;
  rating: number;
  rest_end: string;
  restaurant_worker_contracts: WorkerContract[];
  status: string;
  updated: string;
  work_end: string;
}

export interface CharacterChef extends Character {
  chef_dishes: { dish: Card }[];
  chef_helpers: { helper: Card }[];
}
export interface CharacterCook extends Character {
  cook_dishes: { dish: Card }[];
  cook_helpers: { helper: Card }[];
}

export interface CharacterResponse {
  character_list: {
    count: number;
    next: any;
    previous: any;
    results: Character[];
  };
  status: string;
}

export interface RestaurantResponse {
  restaurant_list: {
    count: number;
    next: any;
    previous: any;
    results: Restaurant[];
  };
  status: string;
}

export interface HelperCard {
  helper: Card;
}

export interface InternalConfig {
  templateIdNames: { [key: number]: string };
  templateImages: { [key: number]: string };
}

export interface GameConfig {
  rarities: string[];
  rarity_names: {
    RARITY_RAW: string;
    RARITY_RARE: string;
    RARITY_MEDIUM_RARE: string;
    RARITY_MEDIUM_WELL: string;
    RARITY_WELL_DONE: string;
  };
  rarity_levels: {
    RARITY_RAW: number;
    RARITY_RARE: number;
    RARITY_MEDIUM_RARE: number;
    RARITY_MEDIUM_WELL: number;
    RARITY_WELL_DONE: number;
  };
  templates_in_game: number[];
  restaurant_statuses: {
    RESTAURANT_STATUS_OPENED: string;
    RESTAURANT_STATUS_CLOSED: string;
  };
  character_statuses: {
    CHARACTER_STATUS_READY: string;
    CHARACTER_STATUS_WAITING_FOR_COOK: string;
    CHARACTER_STATUS_COOKING: string;
    CHARACTER_STATUS_ON_CONTRACT: string;
    CHARACTER_STATUS_ON_REST: string;
    CHARACTER_STATUS_WAITING_TO_OPEN_RESTAURANT: string;
    CHARACTER_STATUS_ON_PVP: string;
  };
  sort_types: {
    fee: "Fee";
    "-end_work": "Time";
  };
  cook_templates: number[];
  chef_templates: number[];
  card_types: {
    CARD_TYPE_COOK: string;
    CARD_TYPE_CHEF: string;
    CARD_TYPE_HELPER: string;
    CARD_TYPE_RESTAURANT: string;
    CARD_TYPE_DISH: string;
    CARD_TYPE_SLICE_OF_CAKE: string;
  };
  character_contracts: {
    CARD_TYPE_COOK: number[];
    CARD_TYPE_CHEF: number[];
  };
  helper_speed_up: {
    [key: string]: number;
  };
  dishes_to_cook_max_count_by_category: {
    restaurant_dishes: number;
    chef_dishes: number;
    worker_dishes: number;
  };
  dishes_time_to_cook: {
    [key: string]: number;
  };
  dish_slots_by_template_id: {
    [key: string]: number;
  };
  helper_slots_by_template_id: {
    [key: string]: number;
  };
  restaurant_working_hours_by_template_id: {
    [key: string]: number;
  };
  HELPER_DROP_CHANCES: {
    [key: string]: number;
  };
  GAME_WALLET_NAME: string;
  GAME_COINS_WALLET_NAME: string;
  GAME_COINS_PRODUCTION_WALLET_NAME: string;
  GAME_NFTS_COLLECTION_NAME: string;
  GAME_COINS_SHORT_NAME: string;
  COIN_PRECISION_AFTER_DOT: string;
  DISHES_TO_COOK_UPDATE_MINUTES: number;
  PRICE_SHOP_HELPER: number;
  SHOP_MAX_COUNT_TO_BUY_HELPER: number;
  CRAFT_COOK_FROM_HELPER_CHANCES: {
    [key: string]: { [key: string]: number };
  };
  CRAFT_COOK_FROM_HELPER_ALLOWED_COOK_TEMPLATE_IDS: number[];
  CRAFT_COOK_FROM_HELPER_HELPERS_COUNT: number;
  CRAFT_COOK_FROM_HELPER_PRICE: number;
  PRICE_RESTAURANT_SLOT_INTERNAL_TEAM: {
    [key: string]: number;
  };
  PRICE_RESTAURANT_SLOT_EXTERNAL_TEAM: {
    [key: string]: number;
  };
  RESTAURANT_BUY_SLOT_TYPES: {
    [key: string]: string;
  };
  EXCHANGE_SLICE_OF_CAKE_COUNT: number;
  CHEF_CONTRACT_REWARD_PERCENTS: {
    [key: string]: number;
  };
  PRICE_SLICE_OF_CAKE: {
    [key: string]: number;
  };
  RARITY_LEVELS_BY_TEMPLATE_ID: {
    [key: string]: number;
  };
  RESTAURANT_NAME_PRICE: number;
  COIN_CLAIM_TYPES: {
    [key: string]: string;
  };
  COIN_TRANSACTION_TYPES: {
    [key: string]: string;
  };
  WITHDRAW_FEE_DAYS_COUNT: number;
  PRICE_UPGRADE_UNITS: {
    [key: string]: number;
  };
  QUEST_SPEED_PERCENT_REQUIREMENTS: {
    CARD_TYPE_COOK: {
      [key: string]: number;
    };
    CARD_TYPE_CHEF: {
      [key: string]: number;
    };
  };
  UPGRADE_RELATIONS_BY_TEMPLATE_ID: {
    [key: string]: number;
  };
  DISH_PRICES: {
    [key: string]: number;
  };
  PRICE_PVP_COOK_JOIN: 400;
  PVP_COOK_STAGES: {
    [key: string]: {
      title: string;
      stage_number: number;
      sub_stages: {
        [key: string]: {
          sub_stage_number: number;
          end: string;
        };
      };
    };
  };
  PRICE_QUEST_COOK_BY_RARITY_LEVEL: {
    [key: string]: number;
  };
}

export interface NextActionInfo {
  restaurants?: Restaurant[];
  characters?: Character[];
  timeToNextAction?: number;
}
