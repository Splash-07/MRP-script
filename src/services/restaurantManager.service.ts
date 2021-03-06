import {
  Card,
  Character,
  Dish,
  Restaurant,
  DishPull,
  RestaurantTimerInfo,
  CharacterTimerInfo,
  CharacterCook,
  CharacterChef,
  RestaurantDishesToCook,
  DishToCook,
  AccountState,
} from '../types';
import { isChef, isCook } from '../types/typeguards';
import API from './api.service';

import logger from './logger.service';
import { msToTime, sleep } from '../utils';
import { store } from '../store';
import navigation from './navigation.service';

const restaurantManager = {
  async manageRestaurants(): Promise<AccountState> {
    const myRestaurants = await API.getMyRestaurants();
    console.log('restaurants:', myRestaurants);

    if (myRestaurants) {
      for (let i = 0; i < myRestaurants.length; i++) {
        const restaurant = myRestaurants[i];
        await this.handleRestaurantStatus(restaurant);
      }
    }

    const myCharacters = await API.getMyCharacters();
    console.log('characters:', myCharacters);

    if (myCharacters) {
      for (let i = 0; i < myCharacters.length; i++) {
        const character = myCharacters[i];
        await this.handleCharacterStatus(character);
      }
    }

    const accountState = await this.getAccountState();
    return accountState;
  },

  async handleRestaurantStatus(restaurant: Restaurant) {
    const { openTime, currentTime } = this.getRestaurantTimerInfo(restaurant);
    const isCDIsOver = openTime <= currentTime;

    if (!isCDIsOver) return;

    await API.openRestaurant(restaurant.id);
  },

  async handleCharacterStatus(character: CharacterCook | CharacterChef) {
    const settings = store.getState().settings;
    const { isCharacterCanStartCook, isCharacterResting, inPvp } =
      this.getCharacterTimerInfo(character);

    // if char is cook and he is resting do nothing
    if ((isCook(character) && isCharacterResting) || inPvp) return;
    // If we have free cook, who is not resting at this moment -> sign contract for him
    if (
      isCook(character) &&
      !this.hasContract(character) &&
      (settings.findContractForCookIsEnabled ||
        settings.signWithChoosenRestaurant.isEnabled)
    ) {
      return await this.findAndSignContractForCharacter(character);
    }

    // if character still dont have contract do nothing
    if (!this.hasContract(character)) return;
    //  close modal in case if user forgot ot close it
    await navigation.closeModal();

    const characterCardId = character.card_id;
    const characterId = character.id;
    const restaurantId = character.restaurant_worker_contracts[0].restaurant_id;

    // If character has contract in opened restaurant
    if (isCharacterCanStartCook) {
      const dishPullList = await API.getDishPullList();
      const dishesToCook = await API.getDishesToCook(
        restaurantId,
        character.card_id,
        character.id
      );

      if (!dishPullList) return logger('Cant fetch dishPull list');
      if (!dishesToCook)
        return logger(
          `Cant fetch dishes to cook for ${character.name}(id: ${characterId})`
        );

      const dishCombination = this.getBestDishCombination(
        dishesToCook,
        dishPullList,
        character
      );
      console.log('Best dish combination', dishCombination);
      const sortedDishCombination = this.adjustDishQueue(dishCombination);
      console.log(
        'Sorted dish combination (according to dishPull update)',
        sortedDishCombination
      );
      console.log('===============================================');
      const dishIdsToCook = sortedDishCombination.map((dish) => dish.dish_id);
      if (dishIdsToCook) {
        await API.startCooking(restaurantId, characterCardId, dishIdsToCook);
      }
    }
  },

  // Place wellDone dishes in the end of queue if dishpull will reset while character is cooking
  adjustDishQueue(dishList: Dish[]): Dish[] {
    const currentTime = new Date().getTime();
    const totalCookTime = dishList.reduce(
      (acc, cur) => (acc += cur.time * 60 * 1000),
      0
    );
    const resetTimeArray = ['00:00', '06:00', '12:00', '18:00'];
    const resetDates = resetTimeArray.map((time) => {
      const [hours, minutes] = time.split(':');
      const timestamp = new Date();
      timestamp.setUTCHours(parseInt(hours));
      timestamp.setUTCMinutes(parseInt(minutes));
      timestamp.setUTCSeconds(0);

      const today = new Date();
      const nextDayTimestamp = new Date(
        timestamp.getTime() + 24 * 60 * 60 * 1000
      );

      return today > timestamp
        ? nextDayTimestamp.getTime()
        : timestamp.getTime();
    });

    // Need to find fisrt occurance when dishPull will be update while character is cooking
    const dishPullUpdateTime = resetDates.find((date) => {
      return currentTime + totalCookTime > date;
    });

    // If dish
    if (!dishPullUpdateTime) {
      return dishList.sort((a, b) => b.price - a.price);
    }

    const sortedDishes = this.sortDishesByDishPullUpdate(
      dishList,
      currentTime,
      dishPullUpdateTime
    );

    return sortedDishes;
  },

  sortDishesByDishPullUpdate(
    dishList: Dish[],
    currentTime: number,
    dishPullUpdateTime: number
  ): Dish[] {
    const sortedByPriceDesc = [...dishList].sort((a, b) => a.price - b.price);
    const beforeUpdate: Dish[] = [];
    const afterUpdate: Dish[] = [];
    let i = 0;
    let timeSinceStart = currentTime;

    while (i < dishList.length) {
      const currentDish = sortedByPriceDesc.shift()!;
      const currentDishCookTime = currentDish.time * 60 * 1000;
      const timeAfterDishIsCooked = timeSinceStart + currentDishCookTime;

      if (timeAfterDishIsCooked < dishPullUpdateTime) {
        beforeUpdate.push(currentDish);
      } else {
        afterUpdate.push(currentDish);
      }
      i++;
      timeSinceStart += currentDishCookTime;
    }
    beforeUpdate.sort((a, b) => b.price - a.price);
    afterUpdate.sort((a, b) => b.price - a.price);

    const result = [...beforeUpdate, ...afterUpdate];
    return result;
  },

  async getAccountState(): Promise<AccountState> {
    const restaurants = await API.getMyRestaurants();
    const characters = await API.getMyCharacters();

    const listOfTimers: number[] = [];
    let additionalTime = 5000;
    if (restaurants) {
      restaurants.forEach((restaurant) => {
        const { currentTime, openTime } =
          this.getRestaurantTimerInfo(restaurant);

        const timer = openTime - currentTime + additionalTime;
        listOfTimers.push(timer);
      });
    }

    if (characters) {
      const settings = store.getState().settings;
      const signContractWithRestaurantIsEnabled =
        settings.signWithChoosenRestaurant.isEnabled;
      const findContractForCookIsEnabled =
        settings.findContractForCookIsEnabled;

      characters.forEach((character) => {
        const {
          cookEnd,
          restEnd,
          currentTime,
          isRestaurantOpened,
          isCharacterResting,
          inPvp,
        } = this.getCharacterTimerInfo(character);

        if (inPvp) return;

        if (this.hasContract(character) && isRestaurantOpened) {
          if (isChef(character)) {
            additionalTime = 50000;
          }
          const timer = cookEnd - currentTime + additionalTime;

          return listOfTimers.push(timer);
        }

        if (isCook(character)) {
          // dont return anything if all cook dont have contract and option for finding restaurant is disabled
          let timer = 60000;
          if (
            !isCharacterResting &&
            !this.hasContract(character) &&
            !findContractForCookIsEnabled &&
            !signContractWithRestaurantIsEnabled
          ) {
            return listOfTimers.push(timer);
          } else if (
            !isCharacterResting &&
            !this.hasContract(character) &&
            (findContractForCookIsEnabled ||
              signContractWithRestaurantIsEnabled)
          ) {
            return listOfTimers.push(timer);
          }
          // if character have contract and currenly resting
          timer = restEnd - currentTime + additionalTime;
          return listOfTimers.push(timer);
        }
      });
    }

    console.log(listOfTimers.map((timer) => msToTime(timer)));
    const timeToNextAction =
      listOfTimers.length > 0 ? Math.min(...listOfTimers) : undefined;
    return {
      restaurants,
      characters,
      timeToNextAction,
    };
  },

  getRestaurantTimerInfo(restaurant: Restaurant): RestaurantTimerInfo {
    const config = store.getState().config.game;

    const currentTime = Date.now();
    const msInHour = 3600000; // 1 hour
    const restaurantStartWork = new Date(restaurant.start_work).getTime();
    const restaurantEndWork = new Date(restaurant.end_work).getTime();
    const restaurantCD =
      (24 -
        config.restaurant_working_hours_by_template_id[
          restaurant.atomichub_template_id
        ]) *
      msInHour;
    const openTime = new Date(restaurant.end_work).getTime() + restaurantCD;

    const timeSinceOpening =
      currentTime - new Date(restaurant.start_work).getTime();

    const isRestaurantOpened =
      currentTime > restaurantStartWork && currentTime < restaurantEndWork;

    return {
      openTime,
      currentTime,
      timeSinceOpening,
      isRestaurantOpened,
    };
  },

  getCharacterTimerInfo(character: Character): CharacterTimerInfo {
    const restaurantStartWork = new Date(
      character.restaurant_worker_contracts[0]?.restaurant_start_work
    ).getTime();
    const restaurantEndWork = new Date(
      character.restaurant_worker_contracts[0]?.restaurant_end_work
    ).getTime();
    const characterWorkEnd = new Date(character.work_end).getTime();
    const pvpEnd = new Date(character.pvp_end).getTime();

    const dishCookEnd = new Date(character.cook_end).getTime();
    const nextDishToCookUpdate = new Date(
      character.restaurant_worker_contracts[0]?.next_dishes_to_cook_update
    ).getTime();

    const cookEnd =
      nextDishToCookUpdate - dishCookEnd >= 10800000
        ? dishCookEnd
        : nextDishToCookUpdate;

    const restEnd = new Date(character.rest_end).getTime();
    const currentTime = Date.now();

    const isRestaurantOpened =
      currentTime > restaurantStartWork && currentTime < restaurantEndWork;
    const isCharacterCanStartCook = isRestaurantOpened && currentTime > cookEnd;
    // const isCharacterCanStartCook = true;
    const inPvp = pvpEnd > currentTime;
    const isWorkHasBeenEnded = currentTime > characterWorkEnd;
    const isCharacterResting = isWorkHasBeenEnded && currentTime < restEnd;
    return {
      cookEnd,
      restEnd,
      currentTime,
      isRestaurantOpened,
      isCharacterCanStartCook,
      isCharacterResting,
      inPvp,
    };
  },

  getHelpersAccelerationRate(character: CharacterCook | CharacterChef): number {
    const config = store.getState().config.game;
    const helpers = isChef(character)
      ? character.chef_helpers.map((card) => card.helper)
      : character.cook_helpers.map((card) => card.helper);

    if (helpers.length < 1) return 0;
    const helpersValues = helpers.map(
      (helperObj) => config.helper_speed_up[helperObj.atomichub_template_id]
    );
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

    return helpersValues.reduce(
      (acc, cur, index) => (acc += cur * coefficients[index]),
      0
    );
  },

  // parse dish card to internal Dish
  getDishInfo(
    dish: DishToCook | Card,
    helpersAccelerationRate: number,
    dishPullList: DishPull[]
  ): Dish {
    const config = store.getState().config.game;
    const templateId =
      'dish_atomichub_template_id' in dish
        ? dish.dish_atomichub_template_id
        : dish.atomichub_template_id;
    const id = 'dish_id' in dish ? dish.dish_id : dish.id;

    const dishPullById = dishPullList.find(
      (dishPull) => dishPull.atomichub_template_id === templateId
    );

    if (!dishPullById) {
      throw Error('Cant find dish in dishPull by id');
    }

    const cookTime = config.dishes_time_to_cook[templateId];
    const acceleratedTime =
      cookTime - cookTime * (helpersAccelerationRate / 100);
    const price = config.DISH_PRICES[templateId];
    const name = dishPullById.name;
    const profit = dishPullById.price;
    const rarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[templateId];

    return {
      dish_id: id,
      name,
      profit,
      price,
      dish_atomichub_template_id: templateId,
      time: acceleratedTime,
      rarity,
    };
  },

  // wutafack is this
  async findOpenedRestaurants(
    restaurantList: Restaurant[] = [],
    nextPage?: string
  ): Promise<Restaurant[]> {
    const resData = await API.getOpenedRestaurants(nextPage);
    const results = resData?.restaurant_list.results;
    const next = resData?.restaurant_list.next;

    if (!next || !results) {
      return restaurantList;
    }

    restaurantList = [...restaurantList, ...results];
    await sleep(2000);

    return await this.findOpenedRestaurants(restaurantList, next);
  },

  async findSuitableRestaurantId(character: CharacterCook) {
    const config = store.getState().config.game;

    const restaurantList = await this.findOpenedRestaurants();
    const dishPullList = await API.getDishPullList();

    if (!restaurantList) return logger('Failed to find restaurants to choose');
    if (!dishPullList) return logger('Cant fetch dishPullList');

    const characterRarity =
      config.RARITY_LEVELS_BY_TEMPLATE_ID[character.atomichub_template_id];

    const filteredRestaurants = this.filterRestaurantsByTimeAndRarity(
      restaurantList,
      characterRarity
    );

    if (filteredRestaurants.length === 0)
      return logger(
        `Cant find suitable restaurant for cook(id: ${character.id}) (try manually)`
      );

    const restaurantBestDishCombinationList = filteredRestaurants.map(
      (restaurant) => {
        const fee = restaurant.fee;
        const restaurantRarityCoefficient =
          this.getRestaurantCoefficientByRarity(
            restaurant.atomichub_template_id
          );
        const shiftsByRestaurantRarity = this.getShiftsByRestaurantRarity(
          restaurant.atomichub_template_id
        );

        const dishesToCook: RestaurantDishesToCook = {
          chef_dishes: restaurant.chefs_dishes?.map((dish) => dish.dish) ?? [],
          next_dishes_to_cook_update: 'none',
          restaurant_dishes:
            restaurant.restaurant_dishes?.map((dish) => dish.dish) ?? [],
          worker_dishes: character.cook_dishes.map((dish) => dish.dish) ?? [],
        };

        const dishCombination = this.getBestDishCombination(
          dishesToCook,
          dishPullList,
          character
        );
        return dishCombination.reduce(
          (acc, cur) => {
            return {
              ...acc,
              price:
                acc.price +
                (cur.price - cur.price * (fee / 100)) *
                  restaurantRarityCoefficient,
              time: acc.time + cur.time,
            };
          },
          {
            price: 0,
            time: 0,
            restaurantId: restaurant.id,
            shifts: shiftsByRestaurantRarity,
            wasOpenedIn: restaurant.start_work,
          }
        );
      }
    );
    console.log(restaurantBestDishCombinationList);

    const bestRestaurant = restaurantBestDishCombinationList.reduce(
      (prev, cur) =>
        cur.price * cur.shifts > prev.price * cur.shifts ? cur : prev
    );
    console.log(bestRestaurant);
    return bestRestaurant.restaurantId;
  },

  getShiftsByRestaurantRarity(templateId: number): number {
    const config = store.getState().config.game;

    const shiftsMap: { [key: number]: number } = {
      1: 12 / 3,
      2: 15 / 3,
      3: 15 / 3,
      4: 15 / 3,
      5: 15 / 3,
    };
    const rarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[templateId];

    return shiftsMap[rarity];
  },

  filterRestaurantsByTimeAndRarity(
    restaurantList: Restaurant[],
    rarity: number
  ) {
    const config = store.getState().config.game;

    const filteredList = restaurantList.filter((restaurant) => {
      const threeHours = 10080000; // 2.8 hour
      const timeSinceOpening =
        this.getRestaurantTimerInfo(restaurant).timeSinceOpening;
      // timSinceOpening must be < 3 hours
      if (timeSinceOpening < threeHours) {
        const hasSuitableRestaurantDish = restaurant.restaurant_dishes?.find(
          (dish) => {
            const dishRarity =
              config.RARITY_LEVELS_BY_TEMPLATE_ID[
                dish.dish.atomichub_template_id
              ];
            return dishRarity <= rarity;
          }
        );
        const hasSuitableChefDish = restaurant.chefs_dishes?.find((dish) => {
          const dishRarity =
            config.RARITY_LEVELS_BY_TEMPLATE_ID[
              dish.dish.atomichub_template_id
            ];
          return dishRarity <= rarity;
        });

        if (hasSuitableRestaurantDish || hasSuitableChefDish) return true;
      }
    });
    return filteredList;
  },

  async findAndSignContractForCharacter(character: CharacterCook) {
    const settings = store.getState().settings;
    const { isEnabled, restaurant_id } = settings.signWithChoosenRestaurant;
    const characterCardId = character.card_id;
    const restaurantId =
      isEnabled && restaurant_id
        ? restaurant_id
        : await this.findSuitableRestaurantId(character);

    if (restaurantId) {
      await API.setWorker(characterCardId, restaurantId, isEnabled);
    }
  },

  // knapsack algorithm
  getMaxProfitableCombinationOfDish(
    dishArray: Dish[],
    maxTime: number
  ): Dish[] {
    // Array of dishes object, with following properties:
    // 1 - cook time
    // 2 - profit from dish
    // Implementations:
    // 1 - accumulative time must be <= 180
    // Needs to find max profitable combination of dishes

    // You can select only one Dish from the Restaurant, only one Dish from the Chef
    // and as many Dishes as you like from the character Dishes category.
    dishArray.sort((a, b) => a.price - b.price);
    const N = dishArray.length;
    const weights = dishArray.map((dish) => Math.round(dish.time));
    const prices = dishArray.map((dish) => dish.price);

    const dp = Array(N)
      .fill(0)
      .map(() => Array(maxTime + 1).fill(0));

    for (let i = 0; i < N; i++) dp[i][0] = 0;

    for (let c = 0; c <= maxTime; c++) {
      if (weights[0] <= c) dp[0][c] = prices[0];
    }

    for (let i = 1; i < N; i++) {
      for (let c = 1; c <= maxTime; c++) {
        let priceOne = 0,
          priceTwo = 0;
        // include the item, if it is not more than the maxTime
        if (weights[i] <= c) priceOne = prices[i] + dp[i - 1][c - weights[i]];
        // exclude the item
        priceTwo = dp[i - 1][c];
        // take maximum
        dp[i][c] = Math.max(priceOne, priceTwo);
      }
    }

    const selectedDishes = [];
    let remaininTime = maxTime;
    for (let i = weights.length; i >= 0; i--) {
      if (remaininTime - weights[i] >= 0) {
        selectedDishes.push(dishArray[i]);
        remaininTime -= weights[i];
      }
    }

    return selectedDishes;
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
    const dishCombination = this.getMaxProfitableCombinationOfDish(
      dishList,
      maxTime
    );
    return dishCombination;
  },

  getBestAvailableToCookDishes(
    chefDishCards: (DishToCook | Card)[],
    restaurantDishCards: (DishToCook | Card)[],
    characterDishCards: (DishToCook | Card)[],
    dishPull: DishPull[],
    character: CharacterCook | CharacterChef
  ): Dish[] {
    const config = store.getState().config.game;
    const { atomichub_template_id, card_type } = character;
    const characterRarity =
      config.RARITY_LEVELS_BY_TEMPLATE_ID[atomichub_template_id];
    const helpersAccelerationRate = this.getHelpersAccelerationRate(character);

    const bestRestaurantDish =
      this.findBestDishByPricePerMinute(
        card_type,
        characterRarity,
        restaurantDishCards,
        helpersAccelerationRate,
        dishPull,
        'restaurant'
      ) ?? [];
    const bestChefDish =
      this.findBestDishByPricePerMinute(
        card_type,
        characterRarity,
        chefDishCards,
        helpersAccelerationRate,
        dishPull,
        'chef'
      ) ?? [];

    const filteredCharacterDishCardList = this.filterAvailableDishCards(
      card_type,
      characterRarity,
      characterDishCards
    );
    const characterDishes = filteredCharacterDishCardList.map((card) =>
      this.getDishInfo(card, helpersAccelerationRate, dishPull)
    );

    const dishList = [
      ...characterDishes,
      ...bestRestaurantDish,
      ...bestChefDish,
    ];
    return dishList;
  },

  getRestaurantCoefficientByRarity(templateId: number): number {
    const config = store.getState().config.game;

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

  findBestDishByPricePerMinute(
    card_type: string,
    characterRarity: number,
    dishCards: (DishToCook | Card)[],
    helpersAsseleration: number,
    dishPull: DishPull[],
    dishType?: 'restaurant' | 'chef'
  ): [Dish] | [] {
    const avaliblileRarity =
      card_type === 'CARD_TYPE_CHEF' ? 5 : characterRarity;
    const filteredDishCards = this.filterAvailableDishCards(
      card_type,
      avaliblileRarity,
      dishCards
    );
    const dishList = filteredDishCards.map((card) =>
      this.getDishInfo(card, helpersAsseleration, dishPull)
    );
    const bestDishesByRarity = this.filterDishBrRarity(
      dishList,
      avaliblileRarity
    );

    if (bestDishesByRarity.length === 0) return [];
    const dish = bestDishesByRarity.reduce((prev, cur) =>
      cur.price > prev.price ? cur : prev
    );
    console.log(`Best ${dishType} dish is - ${dish.name}`);
    return [dish];
  },

  filterDishBrRarity(dishList: Dish[], avaliblileRarity: number): Dish[] {
    let result: Dish[] = [];
    let rarity = avaliblileRarity;
    while (rarity > 0) {
      result = dishList.filter((dish) => dish.rarity === rarity);
      if (result.length > 0) break;

      rarity--;
    }
    return result;
  },

  filterAvailableDishCards(
    characterType: string,
    characterRarity: number,
    dishCardList: (DishToCook | Card)[]
  ) {
    const config = store.getState().config.game;

    if (characterType === config.card_types.CARD_TYPE_CHEF) {
      return dishCardList;
    }

    const filteredDishCardList = dishCardList.filter((dish) => {
      const templateId =
        'dish_atomichub_template_id' in dish
          ? dish.dish_atomichub_template_id
          : dish.atomichub_template_id;
      const dishRarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[templateId];
      return characterRarity >= dishRarity;
    });

    return filteredDishCardList;
  },

  hasContract(character: Character): boolean {
    return (
      character.restaurant_worker_contracts &&
      character.restaurant_worker_contracts.length > 0
    );
  },

  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  async init() {
    await this.manageRestaurants();
  },
};

export default restaurantManager;
