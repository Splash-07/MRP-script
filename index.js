// TODO:
// Check if dishes already in use
(async () => {
  console.clear();

  const coefficient = {
    1: 1,
    2: 1.6,
    3: 2.8,
    4: 4.6,
    5: 7.6,
  };

  function queryParamsToString(params) {
    return Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");
  }

  // API CALLS
  const API = {
    getRestaurants: async () => {
      const params = {
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
          "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
          Accept: "application/json, text/plain, */*",
        },
      };

      try {
        const res = await fetch(
          `/v1/user/restaurants/?${queryParamsToString(params)}`,
          options
        );
        const resData = await res.json();
        const restaurantList = resData.restaurant_list.results;
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
          "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
          Accept: "application/json, text/plain, */*",
        },
      };

      try {
        const res = await fetch(`/v1/user/characters/`, options);
        const resData = await res.json();
        const characterList = resData.character_list.results;
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
          "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
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
    startCooking: async (restaurantId, workerCardId, dishIds) => {
      const options = {
        method: "post",
        headers: {
          "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
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
        await sleep(5000);
        await manageRestaurants();
      } catch (error) {
        console.log("Failed to start cooking", error);
      }
    },
    openRestaurant: async (restaurantId) => {
      const options = {
        method: "post",
        headers: {
          "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
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
        await sleep(5000);
        await manageRestaurants();
      } catch (error) {
        console.log("Failed to open restaurant", error);
      }
    },
  };

  async function manageRestaurants() {
    const myRestaurants = await API.getRestaurants();
    const myCharacters = await API.getCharacters();
    const restaurantDishesMap = {};
    await sleep(3000);
    for (let i = 0; i < myRestaurants.length; i++) {
      const restaurant = myRestaurants[i];
      restaurantDishesMap[restaurant.id] = restaurant.restaurant_dishes.map(
        (dish) => dish.dish
      );
      await handleRestaurantStatus(restaurant);
    }

    await sleep(3000);
    for (let i = 0; i < myCharacters.length; i++) {
      const character = myCharacters[i];
      await handleCharacterStatus(character, restaurantDishesMap);
    }
  }

  async function handleRestaurantStatus(restaurant) {
    const currentTime = Date.now();
    const msInHour = 3600000; // 1 hour
    const restaurantCD =
      (24 -
        window.Config.restaurant_working_hours_by_template_id[
          restaurant.atomichub_template_id
        ]) *
      msInHour;
    const openTime = new Date(restaurant.end_work).getTime() + restaurantCD;
    const isTimerIsOver = openTime <= currentTime;

    if (!isTimerIsOver) return;

    await API.openRestaurant(restaurant.id);
  }

  async function handleCharacterStatus(character, restaurantDishesMap) {
    if (!hasContract(character)) return;

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
        const restaurantDishes = restaurantDishesMap[restaurantId] ?? [];
        const chefDishes = []; // idk where it stoored yet
        const characterDishes = character.chef_dishes.map((dish) => dish.dish);
        const helpers = character.chef_helpers;
        const dishIdsToCook = getDishIdsToCook(
          restaurantDishes,
          chefDishes,
          characterDishes,
          helpers
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
  }

  function getDishIdsToCook(
    restaurantDishes,
    chefDishes,
    characterDishes,
    helpers
  ) {
    const bestRestaurantDish = findBestRatioDish(restaurantDishes) ?? [];
    const bestChefDish = findBestRatioDish(chefDishes) ?? [];
    const dishPullList = [
      ...characterDishes,
      ...bestRestaurantDish,
      ...bestChefDish,
    ];

    const helpersAccelerationRate = getHelpersAccelerationRate(helpers);
    const dishArray = dishPullList.map((dish) =>
      getDishInfo(dish.atomichub_template_id, helpersAccelerationRate)
    );

    const maxTime = 180;
    const maxProfitableIdCombination = getMaxProfitableCombinationOfDishIds(
      dishArray,
      maxTime
    );
    return maxProfitableIdCombination;
  }

  function getMaxProfitableCombinationOfDishIds(dishArray, maxTime) {
    // Array of dishes object, with following properties:
    // 1 - cook time
    // 2 - profit from dish
    // Implementations:
    // 1 - accumulative time must be <= 180
    // Needs to find max profitable combination of dishes

    // You can select only one Dish from the Restaurant, only one Dish from the Chef
    // and as many Dishes as you like from the character Dishes category.

    let cache = [];
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

    let result = [];
    let i = dishArray.length - 1;
    let j = maxTime;
    let n = dishArray.length;

    let debugArray = [];
    while (n > 0) {
      if (cache[n][j] !== cache[n - 1][j]) {
        result.push(dishArray[i].templateId);
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
  }

  function findBestRatioDish(dishList) {
    if (dishList.length < 1) return;

    return [
      dishList.reduce((prev, cur) =>
        cur.profit / cur.time > prev ? cur : prev
      ),
    ];
  }

  function getDishInfo(templateId, helpersAccelerationRate) {
    const rarity = window.Config.RARITY_LEVELS_BY_TEMPLATE_ID[templateId];
    const cookTime = window.Config.dishes_time_to_cook[templateId];

    const rarityCoefficient = coefficient[rarity];

    const acceleratedTime =
      cookTime - cookTime * (helpersAccelerationRate / 100);
    const profit = (cookTime / 10) * rarityCoefficient;

    return {
      templateId,
      profit,
      time: acceleratedTime,
    };
  }

  function getHelpersAccelerationRate(helpers) {
    if (helpers.length < 1) return 0;
    const helpersValues = helpers.map(
      (helperObj) =>
        window.Config.helper_speed_up[helperObj.helper.atomichub_template_id]
    );
    const coefficients = [];

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
  }

  function hasContract(character) {
    return (
      character.restaurant_worker_contracts &&
      character.restaurant_worker_contracts.length > 0
    );
  }

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function init() {
    while (true) {
      await manageRestaurants();
      await sleep(120000);
    }
  }

  init();
})();
