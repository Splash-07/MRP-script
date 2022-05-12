import {
  CharacterChef,
  CharacterCook,
  Restaurant,
  Params,
  DishPull,
  RestaurantDishesToCook,
  RestaurantResponse,
} from "../types";
import { queryParamsToString, sleep } from "../utils";
import logger from "./logger.service";
import navigation from "./navigation.service";

const API = {
  async getMyRestaurants() {
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
      const res = await fetch(`/v1/user/restaurants/?${queryParamsToString(params)}`, options);
      const resData = await res.json();

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Restaurant request failed");
      }

      const restaurantList: Restaurant[] = resData.restaurant_list.results;

      return restaurantList;
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },

  async getDishesToCook(restaurantId: string, characterCardId: string, characterId: string) {
    await navigation.openCookModal(characterId);

    const options = {
      method: "POST",
      headers: {
        "api-key": JSON.parse(window.localStorage.getItem("user")!).api_key,
        Accept: "application/json, text/plain, */*",
        Referer: "https://game.medium-rare-potato.io/characters",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_card_id: characterCardId,
      }),
    };

    try {
      const res = await fetch(`/v1/restaurants/${restaurantId}/dishes-to-cook/get-or-create/`, options);
      const resData = await res.json();

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Get dishes to cook request failed");
      }

      const restaurantDishesToCook: RestaurantDishesToCook = resData.restaurant_dishes_to_cook;

      return restaurantDishesToCook;
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },

  async getOpenedRestaurants(next?: string) {
    const params: Params = {
      search: "",
      fee: "",
      min_staff_rating: "",
      rating: "",
      sort: "",
      rarity: "",
      status: "RESTAURANT_STATUS_OPENED",
      is_chef_exist: false,
      is_free_slot_exist: true,
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
      const res = await fetch(next ? next : `/v1/restaurants/?${queryParamsToString(params)}`, options);
      const resData: RestaurantResponse = await res.json();

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Restaurant request failed");
      }

      return resData;
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },

  async getMyCharacters() {
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

      const characterList: (CharacterChef | CharacterCook)[] = resData.character_list.results;

      return characterList;
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },

  async setWorker(characterCardId: string, restaurantId: string) {
    // await navigation.myRestaurants();

    const options = {
      method: "post",
      headers: {
        "api-key": JSON.parse(window.localStorage.getItem("user")!).api_key,
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_card_id: characterCardId,
        days_duration: 1,
      }),
    };

    try {
      const res = await fetch(`/v1/restaurants/${restaurantId}/set-worker/`, options);
      const resData = await res.json();

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Set worker request failure");
      }

      logger(`Restaurant (id: ${restaurantId}) has signed contract with our cook (id:${characterCardId})`);
      console.log("Set worker response data:", resData);
      console.log("Await 1 minute after contract signing, before continue");
      await sleep(60000);
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },

  async getDishPullList() {
    const options = {
      method: "get",
      headers: {
        "api-key": JSON.parse(window.localStorage.getItem("user")!).api_key,
        Accept: "application/json, text/plain, */*",
      },
    };

    try {
      const res = await fetch(`v1/dish-pool/`, options);
      const resData = await res.json();

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Dish pull request failed");
      }

      const dishPullList: DishPull[] = resData.dish_pool;
      // console.log("dishPullList:", dishPullList);
      return dishPullList;
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },

  async startCooking(restaurantId: string, characterCardId: string, dishIds: string[]) {
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
      const res = await fetch(`/v1/restaurants/${restaurantId}/start-cook/`, options);
      const resData = await res.json();

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Start cooking request failed");
      }

      logger(`Character (id: ${characterCardId} start cooking in restaurant (id: ${restaurantId})`);
      console.log("Start cooking with response data:", resData);
      await sleep(5000);
      await navigation.closeModal();
      await navigation.myCharacters();
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },

  async openRestaurant(restaurantId: string) {
    await navigation.myRestaurants();

    const options = {
      method: "post",
      headers: {
        "api-key": JSON.parse(window.localStorage.getItem("user")!).api_key,
        Accept: "application/json, text/plain, */*",
      },
    };

    try {
      const res = await fetch(`/v1/user/restaurants/${restaurantId}/open/`, options);
      const resData = await res.json();

      if (resData.status === "STATUS_FAILURE") {
        console.log(resData);
        throw new Error("Open restaurant request failed");
      }

      logger("Restaurant has been opened");
      console.log("Open restaurant response data:", resData);
      await sleep(5000);
      await navigation.myRestaurants(); // update page
    } catch (error: any) {
      logger(`${error.message}`);
    }
  },
};

export default API;
