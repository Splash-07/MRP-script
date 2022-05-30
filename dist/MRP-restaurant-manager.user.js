// ==UserScript==
                     // @name         Medium Rare Potato restaurant management script
                     // @description  Script made to manage your restaurant in https://game.medium-rare-potato.io/
                     // @namespace    https://github.com/Splash-07/MRP-script
                     // @version      1.6.0
                     // @author       Splash-07 (https://github.com/Splash-07)
                     // @match        https://game.medium-rare-potato.io/*
                     // ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const typeguards_1 = __webpack_require__(2);
const api_1 = __webpack_require__(3);
const gameConfig_1 = __webpack_require__(7);
const helper_1 = __webpack_require__(4);
const logger_1 = __webpack_require__(5);
const settings_1 = __webpack_require__(8);
const navigation_1 = __webpack_require__(6);
const restaurantManager = {
    async manageRestaurants() {
        const myRestaurants = await api_1.default.getMyRestaurants();
        console.log("restaurant:", myRestaurants);
        if (myRestaurants) {
            for (let i = 0; i < myRestaurants.length; i++) {
                const restaurant = myRestaurants[i];
                await this.handleRestaurantStatus(restaurant);
            }
        }
        const myCharacters = await api_1.default.getMyCharacters();
        console.log("characters:", myCharacters);
        if (myCharacters) {
            for (let i = 0; i < myCharacters.length; i++) {
                const character = myCharacters[i];
                await this.handleCharacterStatus(character);
            }
        }
        const timeToNextAction = await this.getTimeUntilNextAction();
        return timeToNextAction;
    },
    async handleRestaurantStatus(restaurant) {
        const { openTime, currentTime } = this.getRestaurantTimerInfo(restaurant);
        const isCDIsOver = openTime <= currentTime;
        if (!isCDIsOver)
            return;
        await api_1.default.openRestaurant(restaurant.id);
    },
    async handleCharacterStatus(character) {
        const { isCharacterCanStartCook, isCharacterResting } = this.getCharacterTimerInfo(character);
        if ((0, typeguards_1.isCook)(character) && isCharacterResting)
            return;
        if ((0, typeguards_1.isCook)(character) &&
            !this.hasContract(character) &&
            settings_1.default.findContractForCookIsEnabled) {
            return await this.findAndSignContractForCharacter(character);
        }
        if (!this.hasContract(character))
            return;
        await navigation_1.default.closeModal();
        const characterCardId = character.card_id;
        const characterId = character.id;
        const restaurantId = character.restaurant_worker_contracts[0].restaurant_id;
        if (isCharacterCanStartCook) {
            const dishPullList = await api_1.default.getDishPullList();
            const dishesToCook = await api_1.default.getDishesToCook(restaurantId, character.card_id, character.id);
            if (!dishPullList)
                return (0, logger_1.default)("Cant fetch dishPull list");
            if (!dishesToCook)
                return (0, logger_1.default)(`Cant fetch dishes to cook for ${character.name}(id: ${characterId})`);
            const dishCombination = this.getBestDishCombination(dishesToCook, dishPullList, character);
            console.log("Best dish combination", dishCombination);
            const sortedDishCombination = this.adjustDishQueue(dishCombination);
            console.log(sortedDishCombination);
            const dishIdsToCook = sortedDishCombination.map((dish) => dish.dish_id);
            if (dishIdsToCook) {
                await api_1.default.startCooking(restaurantId, characterCardId, dishIdsToCook);
            }
        }
    },
    adjustDishQueue(dishList) {
        const currentTime = new Date().getTime();
        const totalCookTime = dishList.reduce((acc, cur) => (acc += cur.time * 60 * 1000), 0);
        const resetTimeArray = ["03:00", "09:00", "15:00", "21:00"];
        const resetDates = resetTimeArray.map((time) => {
            const [hours, minutes] = time.split(":");
            const timestamp = new Date();
            timestamp.setHours(parseInt(hours));
            timestamp.setMinutes(parseInt(minutes));
            timestamp.setSeconds(0);
            const today = new Date();
            const nextDayTimestamp = new Date(timestamp.getTime() + 24 * 60 * 60 * 1000);
            return today > timestamp
                ? nextDayTimestamp.getTime()
                : timestamp.getTime();
        });
        const dishPullUpdateTime = resetDates.find((date) => {
            return currentTime + totalCookTime > date;
        });
        if (!dishPullUpdateTime) {
            return dishList.sort((a, b) => b.price - a.price);
        }
        const sortedDishes = this.sortDishesByDishPullUpdate(dishList, currentTime, dishPullUpdateTime);
        return sortedDishes;
    },
    sortDishesByDishPullUpdate(dishList, currentTime, dishPullUpdateTime) {
        const sortedByPriceDesc = [...dishList].sort((a, b) => a.price - b.price);
        const beforeUpdate = [];
        const afterUpdate = [];
        let i = 0;
        let timeSinceStart = currentTime;
        while (i < dishList.length) {
            const currentDish = sortedByPriceDesc.shift();
            const currentDishCookTime = currentDish.time * 60 * 1000;
            const timeAfterDishIsCooked = timeSinceStart + currentDishCookTime;
            if (timeAfterDishIsCooked < dishPullUpdateTime) {
                beforeUpdate.push(currentDish);
            }
            else {
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
    async getTimeUntilNextAction() {
        const myRestaurants = await api_1.default.getMyRestaurants();
        const myCharacters = await api_1.default.getMyCharacters();
        const listOfTimers = [];
        let additionalTime = 5000;
        if (myRestaurants) {
            myRestaurants.forEach((restaurant) => {
                const { currentTime, openTime } = this.getRestaurantTimerInfo(restaurant);
                const timer = openTime - currentTime + additionalTime;
                listOfTimers.push(timer);
            });
        }
        if (myCharacters) {
            const findContractForCookIsEnabled = settings_1.default.findContractForCookIsEnabled;
            myCharacters.forEach((character) => {
                const { cookEnd, restEnd, currentTime, isRestaurantOpened, isCharacterResting, } = this.getCharacterTimerInfo(character);
                if (this.hasContract(character) && isRestaurantOpened) {
                    if ((0, typeguards_1.isChef)(character)) {
                        additionalTime = 50000;
                    }
                    const timer = cookEnd - currentTime + additionalTime;
                    listOfTimers.push(timer);
                    return;
                }
                if ((0, typeguards_1.isCook)(character)) {
                    if (!isCharacterResting &&
                        !this.hasContract(character) &&
                        findContractForCookIsEnabled) {
                        const timer = 120000;
                        listOfTimers.push(timer);
                        return;
                    }
                    const timer = restEnd - currentTime + additionalTime;
                    listOfTimers.push(timer);
                }
            });
        }
        console.log(listOfTimers.map((timer) => helper_1.default.msToTime(timer)));
        const timeToNextAction = Math.min(...listOfTimers);
        return timeToNextAction;
    },
    getRestaurantTimerInfo(restaurant) {
        const currentTime = Date.now();
        const msInHour = 3600000;
        const restaurantCD = (24 -
            gameConfig_1.default.restaurant_working_hours_by_template_id[restaurant.atomichub_template_id]) *
            msInHour;
        const openTime = new Date(restaurant.end_work).getTime() + restaurantCD;
        const timeSinceOpening = currentTime - new Date(restaurant.start_work).getTime();
        return {
            openTime,
            currentTime,
            timeSinceOpening,
        };
    },
    getCharacterTimerInfo(character) {
        var _a, _b, _c;
        const restaurantStartWork = new Date((_a = character.restaurant_worker_contracts[0]) === null || _a === void 0 ? void 0 : _a.restaurant_start_work).getTime();
        const restaurantEndWork = new Date((_b = character.restaurant_worker_contracts[0]) === null || _b === void 0 ? void 0 : _b.restaurant_end_work).getTime();
        const characterWorkEnd = new Date(character.work_end).getTime();
        const dishCookEnd = new Date(character.cook_end).getTime();
        const nextDishToCookUpdate = new Date((_c = character.restaurant_worker_contracts[0]) === null || _c === void 0 ? void 0 : _c.next_dishes_to_cook_update).getTime();
        const cookEnd = (0, typeguards_1.isChef)(character)
            ? dishCookEnd
            : nextDishToCookUpdate - dishCookEnd > 3600000
                ? dishCookEnd
                : nextDishToCookUpdate;
        const restEnd = new Date(character.rest_end).getTime();
        const currentTime = Date.now();
        const isRestaurantOpened = currentTime > restaurantStartWork && currentTime < restaurantEndWork;
        const isCharacterCanStartCook = isRestaurantOpened && currentTime > cookEnd;
        const isWorkHasBeenEnded = currentTime > characterWorkEnd;
        const isCharacterResting = isWorkHasBeenEnded && currentTime < restEnd;
        return {
            cookEnd,
            restEnd,
            currentTime,
            isRestaurantOpened,
            isCharacterCanStartCook,
            isCharacterResting,
        };
    },
    getHelpersAccelerationRate(helpers) {
        if (helpers.length < 1)
            return 0;
        const helpersValues = helpers.map((helperObj) => gameConfig_1.default.helper_speed_up[helperObj.atomichub_template_id]);
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
        return helpersValues.reduce((acc, cur, index) => (acc += cur * coefficients[index]), 0);
    },
    getDishInfo(dish, helpersAccelerationRate, dishPullList) {
        const templateId = "dish_atomichub_template_id" in dish
            ? dish.dish_atomichub_template_id
            : dish.atomichub_template_id;
        const id = "dish_id" in dish ? dish.dish_id : dish.id;
        const dishPullById = dishPullList.find((dishPull) => dishPull.atomichub_template_id === templateId);
        const cookTime = gameConfig_1.default.dishes_time_to_cook[templateId];
        const acceleratedTime = cookTime - cookTime * (helpersAccelerationRate / 100);
        const price = gameConfig_1.default.DISH_PRICES[templateId];
        const name = dishPullById === null || dishPullById === void 0 ? void 0 : dishPullById.name;
        const profit = dishPullById === null || dishPullById === void 0 ? void 0 : dishPullById.price;
        if (!profit || !name) {
            throw Error("Cant find dish in dishPull by id");
        }
        return {
            dish_id: id,
            name,
            profit,
            price,
            dish_atomichub_template_id: templateId,
            time: acceleratedTime,
        };
    },
    async findOpenedRestaurants(restaurantList = [], nextPage) {
        const resData = await api_1.default.getOpenedRestaurants(nextPage);
        const results = resData === null || resData === void 0 ? void 0 : resData.restaurant_list.results;
        const next = resData === null || resData === void 0 ? void 0 : resData.restaurant_list.next;
        if (!next || !results) {
            return restaurantList;
        }
        restaurantList = [...restaurantList, ...results];
        await helper_1.default.sleep(2000);
        return await this.findOpenedRestaurants(restaurantList, next);
    },
    async findSuitableRestaurantId(character) {
        const restaurantList = await this.findOpenedRestaurants();
        const dishPullList = await api_1.default.getDishPullList();
        if (!restaurantList)
            return (0, logger_1.default)("Failed to find restaurants to choose");
        if (!dishPullList)
            return (0, logger_1.default)("Cant fetch dishPullList");
        const characterRarity = gameConfig_1.default.RARITY_LEVELS_BY_TEMPLATE_ID[character.atomichub_template_id];
        const filteredRestaurants = this.filterRestaurantsByTimeAndRarity(restaurantList, characterRarity);
        if (filteredRestaurants.length === 0)
            return (0, logger_1.default)(`Cant find suitable restaurant for cook(id: ${character.id}) (try manually)`);
        const restaurantBestDishCombinationList = filteredRestaurants.map((restaurant) => {
            var _a, _b, _c, _d, _e;
            const fee = restaurant.fee;
            const restaurantRarityCoefficient = this.getRestaurantCoefficientByRarity(restaurant.atomichub_template_id);
            const dishesToCook = {
                chef_dishes: (_b = (_a = restaurant.chefs_dishes) === null || _a === void 0 ? void 0 : _a.map((dish) => dish.dish)) !== null && _b !== void 0 ? _b : [],
                next_dishes_to_cook_update: "none",
                restaurant_dishes: (_d = (_c = restaurant.restaurant_dishes) === null || _c === void 0 ? void 0 : _c.map((dish) => dish.dish)) !== null && _d !== void 0 ? _d : [],
                worker_dishes: (_e = character.cook_dishes.map((dish) => dish.dish)) !== null && _e !== void 0 ? _e : [],
            };
            const dishCombination = this.getBestDishCombination(dishesToCook, dishPullList, character);
            return dishCombination.reduce((acc, cur) => {
                return {
                    ...acc,
                    profit: acc.profit +
                        (cur.profit - cur.profit * (fee / 100)) *
                            restaurantRarityCoefficient,
                    time: acc.time + cur.time,
                };
            }, {
                profit: 0,
                time: 0,
                restaurantId: restaurant.id,
                wasOpenedIn: restaurant.start_work,
            });
        });
        const bestRestaurant = restaurantBestDishCombinationList.reduce((prev, cur) => (cur.profit > prev.profit ? cur : prev));
        return bestRestaurant.restaurantId;
    },
    filterRestaurantsByTimeAndRarity(restaurantList, rarity) {
        const filteredList = restaurantList.filter((restaurant) => {
            var _a, _b;
            const threeHours = 10080000;
            const timeSinceOpening = this.getRestaurantTimerInfo(restaurant).timeSinceOpening;
            if (timeSinceOpening < threeHours) {
                const hasSuitableRestaurantDish = (_a = restaurant.restaurant_dishes) === null || _a === void 0 ? void 0 : _a.find((dish) => {
                    const dishRarity = gameConfig_1.default.RARITY_LEVELS_BY_TEMPLATE_ID[dish.dish.atomichub_template_id];
                    return dishRarity <= rarity;
                });
                const hasSuitableChefDish = (_b = restaurant.chefs_dishes) === null || _b === void 0 ? void 0 : _b.find((dish) => {
                    const dishRarity = gameConfig_1.default.RARITY_LEVELS_BY_TEMPLATE_ID[dish.dish.atomichub_template_id];
                    return dishRarity <= rarity;
                });
                if (hasSuitableRestaurantDish || hasSuitableChefDish)
                    return true;
            }
        });
        return filteredList;
    },
    async findAndSignContractForCharacter(character) {
        const characterCardId = character.card_id;
        const restaurantId = await this.findSuitableRestaurantId(character);
        if (restaurantId) {
            await api_1.default.setWorker(characterCardId, restaurantId);
        }
    },
    getMaxProfitableCombinationOfDish(dishArray, maxTime) {
        const cache = [];
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
                }
                else if (weights[i - 1] <= j) {
                    const included = values[i - 1] + cache[i - 1][j - weights[i - 1]];
                    const excluded = cache[i - 1][j];
                    cache[i][j] = Math.max(included, excluded);
                }
                else {
                    cache[i][j] = cache[i - 1][j];
                }
            }
        }
        const result = [];
        let i = dishArray.length - 1;
        let j = maxTime;
        let n = dishArray.length;
        const debugArray = [];
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
    getBestDishCombination(dishesToCook, dishPullList, character) {
        const { chef_dishes, restaurant_dishes, worker_dishes } = dishesToCook;
        const dishList = this.getBestAvailableToCookDishes(chef_dishes, restaurant_dishes, worker_dishes, dishPullList, character);
        const maxTime = 180;
        const dishCombination = this.getMaxProfitableCombinationOfDish(dishList, maxTime);
        return dishCombination;
    },
    getBestAvailableToCookDishes(chefDishCards, restaurantDishCards, characterDishCards, dishPullList, character) {
        var _a, _b;
        const helpers = (0, typeguards_1.isChef)(character)
            ? character.chef_helpers.map((card) => card.helper)
            : character.cook_helpers.map((card) => card.helper);
        const helpersAccelerationRate = this.getHelpersAccelerationRate(helpers);
        const filteredRestaurantDishCardList = this.filterAvailableDishCards(character, restaurantDishCards);
        const restaurantDishes = filteredRestaurantDishCardList.map((card) => this.getDishInfo(card, helpersAccelerationRate, dishPullList));
        const bestRestaurantDish = (_a = this.findBestDishByProfit(restaurantDishes)) !== null && _a !== void 0 ? _a : [];
        const filteredChefDishCardList = this.filterAvailableDishCards(character, chefDishCards);
        const chefDishes = filteredChefDishCardList.map((card) => this.getDishInfo(card, helpersAccelerationRate, dishPullList));
        const bestChefDish = (_b = this.findBestDishByProfit(chefDishes)) !== null && _b !== void 0 ? _b : [];
        const filteredCharacterDishCardList = this.filterAvailableDishCards(character, characterDishCards);
        const characterDishes = filteredCharacterDishCardList.map((card) => this.getDishInfo(card, helpersAccelerationRate, dishPullList));
        const dishList = [
            ...characterDishes,
            ...bestRestaurantDish,
            ...bestChefDish,
        ];
        return dishList;
    },
    getRestaurantCoefficientByRarity(templateId) {
        const coefficientMap = {
            1: 0.5,
            2: 0.6,
            3: 0.8,
            4: 1.1,
            5: 1.6,
        };
        const rarity = gameConfig_1.default.RARITY_LEVELS_BY_TEMPLATE_ID[templateId];
        return coefficientMap[rarity];
    },
    findBestDishByProfit(dishList) {
        if (dishList.length < 1)
            return [];
        const dish = dishList.reduce((prev, cur) => cur.profit > prev.profit ? cur : prev);
        return [dish];
    },
    filterAvailableDishCards(character, dishCardList) {
        if (character.card_type === gameConfig_1.default.card_types.CARD_TYPE_CHEF) {
            return dishCardList;
        }
        const characterRarity = gameConfig_1.default.RARITY_LEVELS_BY_TEMPLATE_ID[character.atomichub_template_id];
        const filteredDishCardList = dishCardList.filter((dish) => {
            const templateId = "dish_atomichub_template_id" in dish
                ? dish.dish_atomichub_template_id
                : dish.atomichub_template_id;
            const dishRarity = gameConfig_1.default.RARITY_LEVELS_BY_TEMPLATE_ID[templateId];
            return characterRarity >= dishRarity;
        });
        return filteredDishCardList;
    },
    hasContract(character) {
        return (character.restaurant_worker_contracts &&
            character.restaurant_worker_contracts.length > 0);
    },
    async init() {
        (0, logger_1.default)("Script will be initialized in 5 seconds");
        await helper_1.default.sleep(5000);
        (0, logger_1.default)("Script initialized");
        let sleepTimer = 60000;
        while (true) {
            sleepTimer = await this.manageRestaurants();
            if (sleepTimer < 0) {
                sleepTimer = 10000;
            }
            (0, logger_1.default)(`Next action will be performed in ${helper_1.default.msToTime(sleepTimer)}`);
            await helper_1.default.sleep(sleepTimer);
        }
    },
};
exports["default"] = restaurantManager;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isChef = exports.isCook = void 0;
function isCook(character) {
    return "cook_dishes" in character;
}
exports.isCook = isCook;
function isChef(character) {
    return "chef_dishes" in character;
}
exports.isChef = isChef;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const helper_1 = __webpack_require__(4);
const logger_1 = __webpack_require__(5);
const navigation_1 = __webpack_require__(6);
const API = {
    async getMyRestaurants() {
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
                Referer: "https://game.medium-rare-potato.io/restaurants",
            },
        };
        try {
            const res = await fetch(`/v1/user/restaurants/?${helper_1.default.queryParamsToString(params)}`, options);
            const resData = await res.json();
            if (resData.status === "STATUS_FAILURE") {
                console.log(resData);
                throw new Error("Restaurant request failed");
            }
            const restaurantList = resData.restaurant_list.results;
            return restaurantList;
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
        }
    },
    async getDishesToCook(restaurantId, characterCardId, characterId) {
        await navigation_1.default.openCookModal(characterId);
        const options = {
            method: "POST",
            headers: {
                "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
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
            const restaurantDishesToCook = resData.restaurant_dishes_to_cook;
            return restaurantDishesToCook;
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
        }
    },
    async getOpenedRestaurants(next) {
        const params = {
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
                "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
                Accept: "application/json, text/plain, */*",
                Referer: "https://game.medium-rare-potato.io/restaurants",
            },
        };
        try {
            const res = await fetch(next ? next : `/v1/restaurants/?${helper_1.default.queryParamsToString(params)}`, options);
            const resData = await res.json();
            if (resData.status === "STATUS_FAILURE") {
                console.log(resData);
                throw new Error("Restaurant request failed");
            }
            return resData;
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
        }
    },
    async getMyCharacters() {
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
            if (resData.status === "STATUS_FAILURE") {
                console.log(resData);
                throw new Error("Character request failed");
            }
            const characterList = resData.character_list.results;
            return characterList;
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
        }
    },
    async setWorker(characterCardId, restaurantId) {
        const options = {
            method: "post",
            headers: {
                "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
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
            (0, logger_1.default)(`Restaurant (id: ${restaurantId}) has signed contract with our cook (id:${characterCardId})`);
            console.log("Set worker response data:", resData);
            await helper_1.default.sleep(2000);
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
        }
    },
    async getDishPullList() {
        const options = {
            method: "get",
            headers: {
                "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
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
            const dishPullList = resData.dish_pool;
            return dishPullList;
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
        }
    },
    async startCooking(restaurantId, characterCardId, dishIds) {
        const options = {
            method: "post",
            headers: {
                "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
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
            (0, logger_1.default)(`Character (id: ${characterCardId} start cooking in restaurant (id: ${restaurantId})`);
            console.log("Start cooking with response data:", resData);
            await helper_1.default.sleep(5000);
            await navigation_1.default.closeModal();
            await navigation_1.default.myCharacters();
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
        }
    },
    async openRestaurant(restaurantId) {
        await navigation_1.default.myRestaurants();
        const options = {
            method: "post",
            headers: {
                "api-key": JSON.parse(window.localStorage.getItem("user")).api_key,
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
            (0, logger_1.default)("Restaurant has been opened");
            console.log("Open restaurant response data:", resData);
            await helper_1.default.sleep(5000);
            await navigation_1.default.myRestaurants();
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
        }
    },
};
exports["default"] = API;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Helper = {
    queryParamsToString: (params) => {
        return Object.keys(params)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join("&");
    },
    sleep: async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    msToTime(ms) {
        if (ms < 0)
            return "00:00:00";
        let seconds = ms / 1000;
        const hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${hours >= 10 ? hours : hours < 10 && hours > 0 ? `0${hours}` : "00"}:${minutes >= 10 ? minutes : minutes < 10 && minutes > 0 ? `0${minutes}` : "00"}:${seconds >= 10 ? seconds : seconds < 10 && seconds > 0 ? `0${seconds}` : "00"}`;
    },
};
exports["default"] = Helper;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const logger = (message) => {
    const currentTime = new Date();
    const timer = `${currentTime.getHours() >= 10
        ? currentTime.getHours()
        : currentTime.getHours() < 10 && currentTime.getHours() > 0
            ? `0${currentTime.getHours()}`
            : "00"}:${currentTime.getMinutes() >= 10
        ? currentTime.getMinutes()
        : currentTime.getMinutes() < 10 && currentTime.getMinutes() > 0
            ? `0${currentTime.getMinutes()}`
            : "00"}:${currentTime.getSeconds() >= 10
        ? currentTime.getSeconds()
        : currentTime.getSeconds() < 10 && currentTime.getSeconds() > 0
            ? `0${currentTime.getSeconds()}`
            : "00"}`;
    const log = `[${timer}] ${message}`;
    console.log(log);
};
exports["default"] = logger;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const helper_1 = __webpack_require__(4);
const navigation = {
    async myRestaurants() {
        const myRestaurants = document.querySelector('a[href="/restaurants"');
        await this.handleMenuNavigation(myRestaurants);
    },
    async myCharacters() {
        const myCharacters = document.querySelector('a[href="/characters"');
        await this.handleMenuNavigation(myCharacters);
    },
    async openCookModal(characterId) {
        var _a;
        await this.myCharacters();
        const characterBtnList = Array.from(document.querySelectorAll(".character-buttons"));
        const cookBtnByCharId = (_a = characterBtnList.find((btnPair) => { var _a; return (_a = btnPair.children[1]) === null || _a === void 0 ? void 0 : _a.href.includes(characterId); })) === null || _a === void 0 ? void 0 : _a.children[0];
        if (cookBtnByCharId) {
            cookBtnByCharId.click();
            await helper_1.default.sleep(4000);
        }
    },
    async closeModal() {
        var _a;
        const closeModalBtn = (_a = document.querySelector(".modal-close")) === null || _a === void 0 ? void 0 : _a.children[0];
        if (closeModalBtn) {
            closeModalBtn === null || closeModalBtn === void 0 ? void 0 : closeModalBtn.click();
            await helper_1.default.sleep(1000);
        }
    },
    async handleMenuNavigation(domElement) {
        if (!domElement)
            return;
        domElement.click();
        await helper_1.default.sleep(2000);
    },
};
exports["default"] = navigation;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const config = window.Config;
exports["default"] = config;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const settings = {
    findContractForCookIsEnabled: false,
};
exports["default"] = settings;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const restaurantManager_1 = __webpack_require__(1);
(async () => {
    console.clear();
    await restaurantManager_1.default.init();
})();

})();

/******/ })()
;