import { NextActionInfo } from "./../types/index";
import {
  Card,
  Character,
  Dish,
  Restaurant,
  Coefficients,
  DishPull,
  RestaurantTimerInfo,
  CharacterTimerInfo,
  CharacterCook,
  CharacterChef,
  RestaurantDishesToCook,
  DishToCook,
} from "../types";
import { isChef, isCook } from "../types/typeguards";
import API from "./api.service";
import config from "../configs/gameConfig";
import logger from "./logger.service";
import { msToTime, sleep } from "../utils";
import { store } from "../store";

const restaurantManager = {
  async manageRestaurants(): Promise<NextActionInfo> {
    const myRestaurants = await API.getMyRestaurants();
    console.log("restaurant:", myRestaurants);

    if (myRestaurants) {
      for (let i = 0; i < myRestaurants.length; i++) {
        const restaurant = myRestaurants[i];
        await this.handleRestaurantStatus(restaurant);
      }
    }

    const myCharacters = await API.getMyCharacters();
    console.log("characters:", myCharacters);

    if (myCharacters) {
      for (let i = 0; i < myCharacters.length; i++) {
        const character = myCharacters[i];
        await this.handleCharacterStatus(character);
      }
    }

    const timeToNextAction = await this.getNextActionInfo();
    return timeToNextAction;
  },

  async handleRestaurantStatus(restaurant: Restaurant) {
    const { openTime, currentTime } = this.getRestaurantTimerInfo(restaurant);
    const isCDIsOver = openTime <= currentTime;

    if (!isCDIsOver) return;

    await API.openRestaurant(restaurant.id);
  },

  async handleCharacterStatus(character: CharacterCook | CharacterChef) {
    const findContractForCookIsEnabled = store.getState().settings.findContractForCookIsEnabled;
    const { isRestaurantOpened, isCharacterCanStartCook, isCharacterResting } = this.getCharacterTimerInfo(character);
    // if char is cook and he is resting do nothing
    if (isCook(character) && isCharacterResting) return;
    // If we have free cook, who is not resting at this moment -> sign contract for him
    if (isCook(character) && !this.hasContract(character) && findContractForCookIsEnabled) {
      return await this.findAndSignContractForCharacter(character);
    }

    // if character still dont have contract do nothing
    if (!this.hasContract(character)) return;

    const characterCardId = character.card_id;
    const characterId = character.id;
    const restaurantId = character.restaurant_worker_contracts[0].restaurant_id;

    // If character has contract in opened restaurant
    if (isRestaurantOpened) {
      // If character can cook
      if (isCharacterCanStartCook) {
        const dishPullList = await API.getDishPullList();
        const dishesToCook = await API.getDishesToCook(restaurantId, character.card_id, character.id);
        if (!dishPullList) return logger("Cant fetch dishPull list");
        if (!dishesToCook) return logger(`Cant fetch dishes to cook for ${character.name}(id: ${characterId})`);

        const dishCombination = this.getBestDishCombination(dishesToCook, dishPullList, character);
        console.log("Best dish combination", dishCombination);

        const dishIdsToCook = dishCombination.map((dish) => dish.dish_id);
        if (dishIdsToCook) {
          await API.startCooking(restaurantId, characterCardId, dishIdsToCook);
        }
      } else {
        logger(`${character.name}(id:${character.card_id}) already cooking atm`);
      }
    } else {
      logger(
        `Restaurant(id:${character.restaurant_worker_contracts[0].restaurant_id}), in which ${character.name}(id:${character.card_id}) has contract, is closed`
      );
    }
  },

  async getNextActionInfo(): Promise<NextActionInfo> {
    const restaurants = await API.getMyRestaurants();
    const characters = await API.getMyCharacters();
    // nft status
    // next action to do

    const listOfTimers: number[] = [];
    const restaurantCDMap: { [key: string]: number } = {};
    const additionalTime = 60000; // idk where im loosing ~40 sec when trying to calculate character timer
    if (restaurants) {
      restaurants.forEach((restaurant) => {
        const { currentTime, openTime, isOpened } = this.getRestaurantTimerInfo(restaurant);

        const timer = openTime - currentTime + additionalTime;
        listOfTimers.push(timer);

        const timerForCDMap = isOpened ? 0 : timer;
        restaurantCDMap[restaurant.id] = timerForCDMap;
      });
    }

    if (characters) {
      const findContractForCookIsEnabled = store.getState().settings.findContractForCookIsEnabled;
      characters.forEach((character) => {
        const signContractWithRestaurantIsEnabled = store.getState().settings.signContractWithRestaurant;
        const { cookEnd, restEnd, currentTime, isRestaurantOpened, isCharacterResting } =
          this.getCharacterTimerInfo(character);

        if (this.hasContract(character) && isRestaurantOpened) {
          const timer = cookEnd - currentTime + additionalTime;
          listOfTimers.push(timer);
        }

        if (isCook(character) && (findContractForCookIsEnabled || signContractWithRestaurantIsEnabled)) {
          if (isCharacterResting) {
            const timer = restEnd - currentTime + additionalTime;
            listOfTimers.push(timer);
          }

          if (!isCharacterResting && !this.hasContract(character)) {
            // if cant find suitable restaurant, do it again in 2 minutes
            let timer = 45000;
            if (signContractWithRestaurantIsEnabled) {
              listOfTimers.push(timer);
              return;
            }
            timer = 12000;
            listOfTimers.push(timer);
          }
        }
      });
    }
    console.log(listOfTimers.map((timer) => msToTime(timer)));
    const timeToNextAction = Math.min(...listOfTimers) ?? 0;
    return {
      restaurants,
      characters,
      timeToNextAction,
    };
  },

  getRestaurantTimerInfo(restaurant: Restaurant): RestaurantTimerInfo {
    const currentTime = Date.now();
    const msInHour = 3600000; // 1 hour
    const restaurantWorkingHours = config.restaurant_working_hours_by_template_id[restaurant.atomichub_template_id];

    const restaurantCD = (24 - restaurantWorkingHours) * msInHour;
    const openTime = new Date(restaurant.end_work).getTime() + restaurantCD;

    const timeSinceOpening = currentTime - new Date(restaurant.start_work).getTime();
    const isOpened = timeSinceOpening < restaurantWorkingHours * msInHour;
    return {
      openTime,
      currentTime,
      timeSinceOpening,
      isOpened,
    };
  },

  getCharacterTimerInfo(character: Character): CharacterTimerInfo {
    const restaurantStartWork = new Date(character.restaurant_worker_contracts[0]?.restaurant_start_work).getTime();
    const restaurantEndWork = new Date(character.restaurant_worker_contracts[0]?.restaurant_end_work).getTime();
    const characterWorkEnd = new Date(character.work_end).getTime();
    const cookEnd = new Date(character.cook_end).getTime();
    const restEnd = new Date(character.rest_end).getTime();
    const currentTime = Date.now();

    const isRestaurantOpened = currentTime > restaurantStartWork && currentTime < restaurantEndWork;
    const isCharacterCanStartCook = currentTime > cookEnd;
    const isWorkHasEnded = currentTime > characterWorkEnd;
    const isCharacterResting = isWorkHasEnded && currentTime < restEnd;
    return {
      cookEnd,
      restEnd,
      currentTime,
      isRestaurantOpened,
      isCharacterCanStartCook,
      isCharacterResting,
    };
  },

  getHelpersAccelerationRate(helpers: Card[]): number {
    if (helpers.length < 1) return 0;
    const helpersValues = helpers.map((helperObj) => config.helper_speed_up[helperObj.atomichub_template_id]);
    const coefficients: number[] = [];

    let i = 0;
    while (i < helpersValues.length) {
      if (i === 0) {
        coefficients.push(1);
        i++;
        continue;
      }
      const current = coefficients[i - 1];
      const coefficientValue = current - current * (helpersValues[i - 1] / 100);
      coefficients.push(coefficientValue);
      i++;
    }

    return helpersValues.reduce((acc, cur, index) => (acc += cur * coefficients[index]), 0);
  },

  getDishInfo(dish: DishToCook | Card, helpersAccelerationRate: number, dishPullList: DishPull[]): Dish {
    const coefficient: Coefficients = {
      1: 1,
      2: 1.6,
      3: 2.8,
      4: 4.6,
      5: 7.6,
    };

    const templateId = "dish_atomichub_template_id" in dish ? dish.dish_atomichub_template_id : dish.atomichub_template_id;
    const id = "dish_id" in dish ? dish.dish_id : dish.id;
    const dishPullCount = dishPullList.find((dishPull) => dishPull.atomichub_template_id === templateId)?.cooked_count;

    const dishPullCoefficient = this.getDishPullCountCoefficient(dishPullCount);

    const rarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[templateId];
    const cookTime = config.dishes_time_to_cook[templateId];

    const rarityCoefficient = coefficient[rarity];

    const acceleratedTime = cookTime - cookTime * (helpersAccelerationRate / 100);
    const profit = (cookTime / 10) * rarityCoefficient * dishPullCoefficient;

    return {
      dish_id: id,
      dish_atomichub_template_id: templateId,
      profit,
      time: acceleratedTime,
    };
  },

  // wutafack is this
  async findOpenedRestaurants(restaurantList: Restaurant[] = [], nextPage?: string): Promise<Restaurant[]> {
    const resData = await API.getOpenedRestaurants(nextPage);
    const { results, next } = resData?.restaurant_list!;

    restaurantList = [...restaurantList, ...results];

    if (!next) {
      return restaurantList;
    }
    await sleep(2000);
    return await this.findOpenedRestaurants(restaurantList, next);
  },

  async findSuitableRestaurantId(character: CharacterCook) {
    const restaurantList = await this.findOpenedRestaurants();
    const dishPullList = await API.getDishPullList();

    if (!restaurantList) return logger("Failed to find restaurants to choose");
    if (!dishPullList) return logger("Cant fetch dishPullList");

    const characterRarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[character.atomichub_template_id];

    const filteredRestaurants = this.filterRestaurantsByTimeAndRarity(restaurantList, characterRarity);

    if (filteredRestaurants.length === 0)
      return logger(`Cant find suitable restaurant for cook(id: ${character.id}) (try manually)`);

    const restaurantBestDishCombinationList = filteredRestaurants.map((restaurant) => {
      const fee = restaurant.fee;
      const restaurantRarityCoefficient = this.getRestaurantCoefficientByRarity(restaurant.atomichub_template_id);

      const dishesToCook: RestaurantDishesToCook = {
        chef_dishes: restaurant.chefs_dishes?.map((dish) => dish.dish) ?? [],
        next_dishes_to_cook_update: "none",
        restaurant_dishes: restaurant.restaurant_dishes?.map((dish) => dish.dish) ?? [],
        worker_dishes: character.cook_dishes.map((dish) => dish.dish) ?? [],
      };

      const dishCombination = this.getBestDishCombination(dishesToCook, dishPullList, character);
      return dishCombination.reduce(
        (acc, cur) => {
          return {
            ...acc,
            profit: acc.profit + (cur.profit - cur.profit * (fee / 100)) * restaurantRarityCoefficient,
            time: acc.time + cur.time,
          };
        },
        {
          profit: 0,
          time: 0,
          restaurantId: restaurant.id,
          wasOpenedIn: restaurant.start_work,
        }
      );
    });

    const bestRestaurant = restaurantBestDishCombinationList.reduce((prev, cur) => (cur.profit > prev.profit ? cur : prev));
    return bestRestaurant.restaurantId;
  },

  filterRestaurantsByTimeAndRarity(restaurantList: Restaurant[], rarity: number) {
    const filteredList = restaurantList.filter((restaurant) => {
      const threeHours = 10080000; // 2.8 hour
      const timeSinceOpening = this.getRestaurantTimerInfo(restaurant).timeSinceOpening;
      // timSinceOpening must be < 3 hours
      if (timeSinceOpening < threeHours) {
        const hasSuitableRestaurantDish = restaurant.restaurant_dishes?.find((dish) => {
          const dishRarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[dish.dish.atomichub_template_id];
          return dishRarity <= rarity;
        });
        const hasSuitableChefDish = restaurant.chefs_dishes?.find((dish) => {
          const dishRarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[dish.dish.atomichub_template_id];
          return dishRarity <= rarity;
        });

        if (hasSuitableRestaurantDish || hasSuitableChefDish) return true;
      }
    });
    console.log(filteredList);
    return filteredList;
  },

  async findAndSignContractForCharacter(character: CharacterCook) {
    const { state, restaurantId } = store.getState().settings.signContractWithRestaurant;
    const characterCardId = character.card_id;
    const restaurant_Id = state ? restaurantId : await this.findSuitableRestaurantId(character);

    if (restaurantId) {
      await API.setWorker(characterCardId, restaurant_Id!, state);
    }
  },

  // knapsack algorithm
  getMaxProfitableCombinationOfDish(dishArray: Dish[], maxTime: number): Dish[] {
    // Array of dishes object, with following properties:
    // 1 - cook time
    // 2 - profit from dish
    // Implementations:
    // 1 - accumulative time must be <= 180
    // Needs to find max profitable combination of dishes

    // You can select only one Dish from the Restaurant, only one Dish from the Chef
    // and as many Dishes as you like from the character Dishes category.

    let cache: number[][] = [];
    for (let g = 0; g < dishArray.length + 1; g++) {
      cache[g] = [];
      for (let h = 0; h < maxTime + 1; h++) {
        cache[g][h] = 0;
      }
    }

    const weights = dishArray.map((dish) => Math.round(dish.time));
    const values = dishArray.map((dish) => dish.profit);

    for (let i = 0; i < dishArray.length + 1; i++) {
      for (let j = 0; j < maxTime + 1; j++) {
        if (i === 0 || j === 0) {
          cache[i][j] = 0;
        } else if (weights[i - 1] <= j) {
          let included = values[i - 1] + cache[i - 1][j - weights[i - 1]];
          let excluded = cache[i - 1][j];

          cache[i][j] = Math.max(included, excluded);
        } else {
          cache[i][j] = cache[i - 1][j];
        }
      }
    }

    let result: Dish[] = [];
    let i = dishArray.length - 1;
    let j = maxTime;
    let n = dishArray.length;

    let debugArray = [];
    while (n > 0) {
      if (cache[n][j] !== cache[n - 1][j]) {
        result.push(dishArray[i]);
        debugArray.push(dishArray[i]);
        if (i !== 0) {
          for (let k = 0; k < j; k++) {
            if (cache[n - 1][k] === cache[n][j] - values[i]) {
              j = k;
            }
          }
        }
      }
      n--;
      i--;
    }

    return result;
  },

  getBestDishCombination(
    dishesToCook: RestaurantDishesToCook,
    dishPullList: DishPull[],
    character: CharacterCook | CharacterChef
  ) {
    const { chef_dishes, restaurant_dishes, worker_dishes } = dishesToCook;

    const dishList = this.getBestAvailableToCookDishes(
      chef_dishes,
      restaurant_dishes,
      worker_dishes,
      dishPullList,
      character
    );

    const maxTime = 180;
    const dishCombination = this.getMaxProfitableCombinationOfDish(dishList, maxTime);
    return dishCombination;
  },

  getBestAvailableToCookDishes(
    chefDishCards: (DishToCook | Card)[],
    restaurantDishCards: (DishToCook | Card)[],
    characterDishCards: (DishToCook | Card)[],
    dishPullList: DishPull[],
    character: CharacterCook | CharacterChef
  ): Dish[] {
    const helpers = isChef(character)
      ? character.chef_helpers.map((card) => card.helper)
      : character.cook_helpers.map((card) => card.helper);
    const helpersAccelerationRate = this.getHelpersAccelerationRate(helpers);

    // restaurant dishes
    const filteredRestaurantDishCardList = this.filterAvailableDishCards(character, restaurantDishCards);
    const restaurantDishes = filteredRestaurantDishCardList.map((card) =>
      this.getDishInfo(card, helpersAccelerationRate, dishPullList)
    );
    const bestRestaurantDish = this.findBestRatioDish(restaurantDishes) ?? [];

    // chef dishes
    const filteredChefDishCardList = this.filterAvailableDishCards(character, chefDishCards);
    const chefDishes = filteredChefDishCardList.map((card) => this.getDishInfo(card, helpersAccelerationRate, dishPullList));
    const bestChefDish = this.findBestRatioDish(chefDishes) ?? [];

    // character dishes
    const filteredCharacterDishCardList = this.filterAvailableDishCards(character, characterDishCards);
    const characterDishes = filteredCharacterDishCardList.map((card) =>
      this.getDishInfo(card, helpersAccelerationRate, dishPullList)
    );

    const dishList = [...characterDishes, ...bestRestaurantDish, ...bestChefDish];
    return dishList;
  },

  getRestaurantCoefficientByRarity(templateId: number): number {
    const coefficientMap: { [key: number]: number } = {
      1: 0.5,
      2: 0.6,
      3: 0.8,
      4: 1.1,
      5: 1.6,
    };
    const rarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[templateId];

    return coefficientMap[rarity];
  },

  getDishPullCountCoefficient(dishPullCount: number | undefined): number {
    if (!dishPullCount) return 1;

    return dishPullCount < 378 ? 1.1 : dishPullCount >= 378 && dishPullCount < 756 ? 1.08 : 1.06;
  },

  findBestRatioDish(dishList: Dish[]): [Dish] | [] {
    if (dishList.length < 1) return [];

    const dish = dishList.reduce((prev, cur) => (cur.profit / cur.time > prev.profit / prev.time ? cur : prev));
    return [dish];
  },

  filterAvailableDishCards(character: Character, dishCardList: (DishToCook | Card)[]) {
    if (character.card_type === config.card_types.CARD_TYPE_CHEF) {
      return dishCardList;
    }
    // cook logic
    const characterRarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[character.atomichub_template_id];

    const filteredDishCardList = dishCardList.filter((dish) => {
      const templateId = "dish_atomichub_template_id" in dish ? dish.dish_atomichub_template_id : dish.atomichub_template_id;
      const dishRarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[templateId];
      return characterRarity >= dishRarity;
    });

    return filteredDishCardList;
  },

  hasContract(character: Character): boolean {
    return character.restaurant_worker_contracts && character.restaurant_worker_contracts.length > 0;
  },

  // async init() {
  //   const isInitialized = store.getState().restaurant.isInitialized;

  //   let sleepTimer = 60000;
  //   while (isInitialized) {
  //     store.dispatch(toggleLoading());
  //     const { restaurants, characters, timeToNextAction } = await this.manageRestaurants();
  //     sleepTimer = timeToNextAction;
  //     if (sleepTimer < 0) {
  //       sleepTimer = 20000;
  //     }
  //     const payload = {
  //       restaurants,
  //       characters,
  //       timeToNextAction: sleepTimer,
  //     };
  //     store.dispatch(update(payload));
  //     store.dispatch(toggleLoading());
  //     logger(`Next action will be performed in ${msToTime(sleepTimer)}`);
  //     await sleep(sleepTimer);
  //   }
  //   // await this.manageRestaurants();
  // },
};

export default restaurantManager;
