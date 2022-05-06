import { RawConfig } from "../lib/config";

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
  id: string;
  templateId: number;
  profit: number;
  time: number;
}

export interface Card {
  atomichub_template_id: number;
  card_id: string;
  created: string;
  id: string;
  owner_id: string;
  updated: string;
}

export interface CharacterHelper {}

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
  restaurant_dishes: { dish: Card }[];
  restaurant_worker_contracts: RestaurantContract[];
  owner_id: string;
  rating: number;
}

export interface Character {
  atomichub_template_id: number;
  card_id: string;
  card_type: string;
  chef_dishes: { dish: Card }[];
  chef_helpers: { helper: Card }[];
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

export interface Config
  extends Omit<
    RawConfig,
    | "helper_speed_up"
    | "dishes_time_to_cook"
    | "dish_slots_by_template_id"
    | "helper_slots_by_template_id"
    | "restaurant_working_hours_by_template_id"
    | "HELPER_DROP_CHANCES"
    | "PRICE_RESTAURANT_SLOT_INTERNAL_TEAM"
    | "PRICE_RESTAURANT_SLOT_EXTERNAL_TEAM"
    | "CHEF_CONTRACT_REWARD_PERCENTS"
    | "PRICE_SLICE_OF_CAKE"
    | "RARITY_LEVELS_BY_TEMPLATE_ID"
  > {
  helper_speed_up: {
    [key: string]: number;
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
  PRICE_RESTAURANT_SLOT_INTERNAL_TEAM: {
    [key: string]: number;
  };
  PRICE_RESTAURANT_SLOT_EXTERNAL_TEAM: {
    [key: string]: number;
  };
  CHEF_CONTRACT_REWARD_PERCENTS: {
    [key: string]: number;
  };
  PRICE_SLICE_OF_CAKE: {
    [key: string]: number;
  };
  RARITY_LEVELS_BY_TEMPLATE_ID: {
    [key: string]: number;
  };
}
