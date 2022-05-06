import { Restaurant } from "./../types/index";
import { Character, Params } from "../types";
import Helper from "./helper";
import restaurantManager from "./restaurantManager";

const API = {
  getRestaurants: async () => {
    const params: Params = {
      search: "",
      fee: "",
      min_staff_rating: "",
      rating: "",
      sort: "",
      rarity: "",
      status: "",
      is_chef_exist: false,
      is_free_slot_exist: false,
    };
    const options = {
      method: "get",
      headers: {
        "api-key": JSON.parse(window.localStorage.getItem("user")!).api_key,
        Accept: "application/json, text/plain, */*",
      },
    };

    try {
      const res = await fetch(
        `/v1/user/restaurants/?${Helper.queryParamsToString(params)}`,
        options
      );
      const resData = await res.json();
      const restaurantList: Restaurant[] = resData.restaurant_list.results;
      console.log("restaurant:", restaurantList);
      return restaurantList;
    } catch (error) {
      console.log(error);
    }
  },

  getCharacters: async () => {
    const options = {
      method: "get",
      headers: {
        "api-key": JSON.parse(window.localStorage.getItem("user")!).api_key,
        Accept: "application/json, text/plain, */*",
      },
    };

    try {
      const res = await fetch(`/v1/user/characters/`, options);
      const resData = await res.json();
      const characterList: Character[] = resData.character_list.results;
      console.log("characters:", characterList);
      return characterList;
    } catch (error) {
      console.log(error);
    }
  },

  getDishes: async () => {
    const options = {
      method: "get",
      headers: {
        "api-key": JSON.parse(window.localStorage.getItem("user")!).api_key,
        Accept: "application/json, text/plain, */*",
      },
    };

    try {
      const res = await fetch(`/v1/user/dishes/`, options);
      const resData = await res.json();
      const dishesList = resData.dish_list.results;
      console.log("dishes:", dishesList);
      return dishesList;
    } catch (error) {
      console.log(error);
    }
  },

  startCooking: async (
    restaurantId: string,
    workerCardId: string,
    dishIds: string[]
  ) => {
    const options = {
      method: "post",
      headers: {
        "api-key": JSON.parse(window.localStorage.getItem("user")!).api_key,
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        worker_card_id: workerCardId,
        dish_ids: dishIds,
      }),
    };

    try {
      const res = await fetch(
        `/v1/restaurants/${restaurantId}/start-cook/`,
        options
      );
      const resData = await res.json();
      console.log("Started cooking", resData);
      await Helper.sleep(5000);
      await restaurantManager.manageRestaurants();
    } catch (error) {
      console.log("Failed to start cooking", error);
    }
  },
  openRestaurant: async (restaurantId: string) => {
    const options = {
      method: "post",
      headers: {
        "api-key": JSON.parse(window.localStorage.getItem("user")!).api_key,
        Accept: "application/json, text/plain, */*",
      },
    };

    try {
      const res = await fetch(
        `/v1/user/restaurants/${restaurantId}/open/`,
        options
      );
      const resData = await res.json();
      console.log("Restaurant has been opened", resData);
      await Helper.sleep(5000);
      await restaurantManager.manageRestaurants();
    } catch (error) {
      console.log("Failed to open restaurant", error);
    }
  },
};

export default API;
