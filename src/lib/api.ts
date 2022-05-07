import { Restaurant } from "./../types/index";
import { Character, Params } from "../types";
import Helper from "./helper";
import restaurantManager from "./restaurantManager";
import logger from "./logger";
import navigation from "./navigation";

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
        Referer: "https://game.medium-rare-potato.io/restaurants",
      },
    };

    try {
      const res = await fetch(
        `/v1/user/restaurants/?${Helper.queryParamsToString(params)}`,
        options
      );
      const resData = await res.json();

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Restaurant request failed");
      }

      const restaurantList: Restaurant[] = resData.restaurant_list.results;
      console.log("restaurant:", restaurantList);
      return restaurantList;
    } catch (error: any) {
      logger(`${error.message}`);
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

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Character request failed");
      }

      const characterList: Character[] = resData.character_list.results;
      console.log("characters:", characterList);
      return characterList;
    } catch (error: any) {
      logger(`${error.message}`);
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

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Dish request failed");
      }

      const dishesList = resData.dish_list.results;
      console.log("dishes:", dishesList);
      return dishesList;
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },

  startCooking: async (
    restaurantId: string,
    characterCardId: string,
    characterId: string,
    dishIds: string[]
  ) => {
    await navigation.openCookModal(characterId);

    const options = {
      method: "post",
      headers: {
        "api-key": JSON.parse(window.localStorage.getItem("user")!).api_key,
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        worker_card_id: characterCardId,
        dish_ids: dishIds,
      }),
    };

    try {
      const res = await fetch(
        `/v1/restaurants/${restaurantId}/start-cook/`,
        options
      );
      const resData = await res.json();

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Start cooking request failed");
      }

      logger(`Started cooking`);
      console.log("Start cooking with response data:", resData);
      await Helper.sleep(5000);
      await navigation.closeModal();
      await navigation.myCharacters();
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },

  openRestaurant: async (restaurantId: string) => {
    await navigation.myRestaurants();

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

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Open restaurant request failed");
      }

      logger("Restaurant has been opened");
      console.log("Open restaurant response data:", resData);
      await Helper.sleep(5000);
      await navigation.myRestaurants(); // update page
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },
};

export default API;
