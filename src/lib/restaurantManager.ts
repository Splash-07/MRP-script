import {
  Card,
  Character,
  Dish,
  RestaurantDishMap,
  Restaurant,
  Coefficients,
} from "../types";
import API from "./api";
import config from "./config";
import Helper from "./helper";

const restaurantManager = {
  async manageRestaurants() {
    const myRestaurants = await API.getRestaurants();
    const myCharacters = await API.getCharacters();
    const restaurantDishesMap: RestaurantDishMap = {};

    await Helper.sleep(3000);
    if (myRestaurants) {
      for (let i = 0; i < myRestaurants.length; i++) {
        const restaurant = myRestaurants[i];
        restaurantDishesMap[restaurant.id] = restaurant.restaurant_dishes.map(
          (dish) => dish.dish
        );
        await this.handleRestaurantStatus(restaurant);
      }
    }

    await Helper.sleep(3000);
    if (myCharacters) {
      for (let i = 0; i < myCharacters.length; i++) {
        const character = myCharacters[i];
        await this.handleCharacterStatus(character, restaurantDishesMap);
      }
    }
  },

  async handleRestaurantStatus(restaurant: Restaurant) {
    const currentTime = Date.now();
    const msInHour = 3600000; // 1 hour
    const restaurantCD =
      (24 -
        config.restaurant_working_hours_by_template_id[
          restaurant.atomichub_template_id
        ]) *
      msInHour;
    const openTime = new Date(restaurant.end_work).getTime() + restaurantCD;
    const isTimerIsOver = openTime <= currentTime;

    if (!isTimerIsOver) return;

    await API.openRestaurant(restaurant.id);
  },

  async handleCharacterStatus(
    character: Character,
    restaurantDishesMap: RestaurantDishMap
  ) {
    if (!this.hasContract(character)) return;

    const restaurantId = character.restaurant_worker_contracts[0].restaurant_id;
    const workerCardId = character.card_id;
    const restaurantStartWork = new Date(
      character.restaurant_worker_contracts[0].restaurant_start_work
    ).getTime();
    const restaurantEndWork = new Date(
      character.restaurant_worker_contracts[0].restaurant_end_work
    ).getTime();
    const cookEnd = new Date(character.cook_end).getTime();
    const currentTime = Date.now();

    // If character is working in opened restaurant
    if (currentTime > restaurantStartWork && currentTime < restaurantEndWork) {
      // If character can cook

      if (currentTime > cookEnd) {
        const helpers = character.chef_helpers.map((card) => card.helper);
        const helpersAccelerationRate =
          this.getHelpersAccelerationRate(helpers);

        const chefDishCards: Card[] = []; // idk where it stored for now
        const restaurantDishCards = restaurantDishesMap[restaurantId] ?? [];
        const characterDishCards = character.chef_dishes.map(
          (card) => card.dish
        );

        const dishIdsToCook = this.getDishIdsToCook(
          chefDishCards,
          restaurantDishCards,
          characterDishCards,
          helpersAccelerationRate
        );
        if (dishIdsToCook) {
          await API.startCooking(restaurantId, workerCardId, dishIdsToCook);
        }
      } else {
        console.log("not ready to cook");
      }
    } else {
      console.log("restaurant is closed");
    }
  },

  getDishIdsToCook(
    restaurantDishCards: Card[],
    characterDishCards: Card[],
    chefDishCards: Card[],
    helpersAccelerationRate: number
  ) {
    const restaurantDishes = restaurantDishCards.map((card) =>
      this.getDishInfo(card, helpersAccelerationRate)
    );
    const bestRestaurantDish = this.findBestRatioDish(restaurantDishes) ?? [];

    const chefDishes = chefDishCards.map((card) =>
      this.getDishInfo(card, helpersAccelerationRate)
    );
    const bestChefDish = this.findBestRatioDish(chefDishes) ?? [];

    const characterDishes = characterDishCards.map((card) =>
      this.getDishInfo(card, helpersAccelerationRate)
    );

    const dishPullList = [
      ...characterDishes,
      ...bestRestaurantDish,
      ...bestChefDish,
    ];

    const maxTime = 180;
    const maxProfitableIdCombination =
      this.getMaxProfitableCombinationOfDishIds(dishPullList, maxTime);

    return maxProfitableIdCombination;
  },

  getHelpersAccelerationRate(helpers: Card[]): number {
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

  getDishInfo(dish: Card, helpersAccelerationRate: number) {
    const coefficient: Coefficients = {
      1: 1,
      2: 1.6,
      3: 2.8,
      4: 4.6,
      5: 7.6,
    };

    const { atomichub_template_id, id } = dish;

    const rarity = config.RARITY_LEVELS_BY_TEMPLATE_ID[atomichub_template_id];
    const cookTime = config.dishes_time_to_cook[atomichub_template_id];

    const rarityCoefficient = coefficient[rarity];

    const acceleratedTime =
      cookTime - cookTime * (helpersAccelerationRate / 100);
    const profit = (cookTime / 10) * rarityCoefficient;

    return {
      id,
      templateId: atomichub_template_id,
      profit,
      time: acceleratedTime,
    };
  },

  getMaxProfitableCombinationOfDishIds(dishArray: Dish[], maxTime: number) {
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

    let result: string[] = [];
    let i = dishArray.length - 1;
    let j = maxTime;
    let n = dishArray.length;

    let debugArray = [];
    while (n > 0) {
      if (cache[n][j] !== cache[n - 1][j]) {
        result.push(dishArray[i].id);
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
    console.log("debug array", debugArray);
    return result;
  },

  findBestRatioDish(dishList: Dish[]): [Dish] | [] {
    if (dishList.length < 1) return [];

    return [
      dishList.reduce((prev, cur) =>
        cur.profit / cur.time > prev.profit / prev.time ? cur : prev
      ),
    ];
  },

  hasContract(character: Character) {
    return (
      character.restaurant_worker_contracts &&
      character.restaurant_worker_contracts.length > 0
    );
  },

  async init() {
    console.log("Script will start working in 10 seconds");
    await Helper.sleep(10000);
    console.log("Restaurant manager initialized");

    while (true) {
      await this.manageRestaurants();
      await Helper.sleep(120000);
    }
  },
};

export default restaurantManager;
