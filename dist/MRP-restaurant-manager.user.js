// ==UserScript==
                     // @name         Medium Rare Potato restaurant management script
                     // @description  Script made to manage your restaurant in https://game.medium-rare-potato.io/
                     // @namespace    https://github.com/Splash-07/MRP-script
                     // @version      1.1.0
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
const api_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const helper_1 = __webpack_require__(3);
const logger_1 = __webpack_require__(4);
const restaurantManager = {
    async manageRestaurants() {
        const myRestaurants = await api_1.default.getRestaurants();
        const myCharacters = await api_1.default.getCharacters();
        const restaurantDishesMap = {};
        await helper_1.default.sleep(3000);
        if (myRestaurants) {
            for (let i = 0; i < myRestaurants.length; i++) {
                const restaurant = myRestaurants[i];
                restaurantDishesMap[restaurant.id] = restaurant.restaurant_dishes.map((dish) => dish.dish);
                await this.handleRestaurantStatus(restaurant);
            }
        }
        await helper_1.default.sleep(3000);
        if (myCharacters) {
            for (let i = 0; i < myCharacters.length; i++) {
                const character = myCharacters[i];
                await this.handleCharacterStatus(character, restaurantDishesMap);
            }
        }
    },
    async handleRestaurantStatus(restaurant) {
        const currentTime = Date.now();
        const msInHour = 3600000;
        const restaurantCD = (24 -
            config_1.default.restaurant_working_hours_by_template_id[restaurant.atomichub_template_id]) *
            msInHour;
        const openTime = new Date(restaurant.end_work).getTime() + restaurantCD;
        const isTimerIsOver = openTime <= currentTime;
        if (!isTimerIsOver)
            return;
        await api_1.default.openRestaurant(restaurant.id);
    },
    async handleCharacterStatus(character, restaurantDishesMap) {
        var _a;
        if (!this.hasContract(character))
            return;
        const restaurantId = character.restaurant_worker_contracts[0].restaurant_id;
        const workerCardId = character.card_id;
        const restaurantStartWork = new Date(character.restaurant_worker_contracts[0].restaurant_start_work).getTime();
        const restaurantEndWork = new Date(character.restaurant_worker_contracts[0].restaurant_end_work).getTime();
        const cookEnd = new Date(character.cook_end).getTime();
        const currentTime = Date.now();
        if (currentTime > restaurantStartWork && currentTime < restaurantEndWork) {
            if (currentTime > cookEnd) {
                const helpers = character.chef_helpers.map((card) => card.helper);
                const helpersAccelerationRate = this.getHelpersAccelerationRate(helpers);
                const chefDishCards = [];
                const restaurantDishCards = (_a = restaurantDishesMap[restaurantId]) !== null && _a !== void 0 ? _a : [];
                const characterDishCards = character.chef_dishes.map((card) => card.dish);
                const dishIdsToCook = this.getDishIdsToCook(chefDishCards, restaurantDishCards, characterDishCards, helpersAccelerationRate);
                if (dishIdsToCook) {
                    await api_1.default.startCooking(restaurantId, workerCardId, dishIdsToCook);
                }
            }
            else {
            }
        }
        else {
        }
    },
    getDishIdsToCook(chefDishCards, restaurantDishCards, characterDishCards, helpersAccelerationRate) {
        var _a, _b;
        const restaurantDishes = restaurantDishCards.map((card) => this.getDishInfo(card, helpersAccelerationRate));
        const bestRestaurantDish = (_a = this.findBestRatioDish(restaurantDishes)) !== null && _a !== void 0 ? _a : [];
        const chefDishes = chefDishCards.map((card) => this.getDishInfo(card, helpersAccelerationRate));
        const bestChefDish = (_b = this.findBestRatioDish(chefDishes)) !== null && _b !== void 0 ? _b : [];
        const characterDishes = characterDishCards.map((card) => this.getDishInfo(card, helpersAccelerationRate));
        const dishPullList = [
            ...characterDishes,
            ...bestRestaurantDish,
            ...bestChefDish,
        ];
        const maxTime = 180;
        const maxProfitableIdCombination = this.getMaxProfitableCombinationOfDishIds(dishPullList, maxTime);
        return maxProfitableIdCombination;
    },
    getHelpersAccelerationRate(helpers) {
        if (helpers.length < 1)
            return 0;
        const helpersValues = helpers.map((helperObj) => config_1.default.helper_speed_up[helperObj.atomichub_template_id]);
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
    getDishInfo(dish, helpersAccelerationRate) {
        const coefficient = {
            1: 1,
            2: 1.6,
            3: 2.8,
            4: 4.6,
            5: 7.6,
        };
        const { atomichub_template_id, id } = dish;
        const rarity = config_1.default.RARITY_LEVELS_BY_TEMPLATE_ID[atomichub_template_id];
        const cookTime = config_1.default.dishes_time_to_cook[atomichub_template_id];
        const rarityCoefficient = coefficient[rarity];
        const acceleratedTime = cookTime - cookTime * (helpersAccelerationRate / 100);
        const profit = (cookTime / 10) * rarityCoefficient;
        return {
            id,
            templateId: atomichub_template_id,
            profit,
            time: acceleratedTime,
        };
    },
    getMaxProfitableCombinationOfDishIds(dishArray, maxTime) {
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
                }
                else if (weights[i - 1] <= j) {
                    let included = values[i - 1] + cache[i - 1][j - weights[i - 1]];
                    let excluded = cache[i - 1][j];
                    cache[i][j] = Math.max(included, excluded);
                }
                else {
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
        console.log("Best dish combination", debugArray);
        return result;
    },
    findBestRatioDish(dishList) {
        if (dishList.length < 1)
            return [];
        return [
            dishList.reduce((prev, cur) => cur.profit / cur.time > prev.profit / prev.time ? cur : prev),
        ];
    },
    hasContract(character) {
        return (character.restaurant_worker_contracts &&
            character.restaurant_worker_contracts.length > 0);
    },
    async init() {
        (0, logger_1.default)("Script will start working in 10 seconds");
        await helper_1.default.sleep(10000);
        (0, logger_1.default)("Restaurant manager initialized");
        while (true) {
            await this.manageRestaurants();
            await helper_1.default.sleep(120000);
        }
    },
};
exports["default"] = restaurantManager;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const helper_1 = __webpack_require__(3);
const restaurantManager_1 = __webpack_require__(1);
const logger_1 = __webpack_require__(4);
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
            const res = await fetch(`/v1/user/restaurants/?${helper_1.default.queryParamsToString(params)}`, options);
            const resData = await res.json();
            const restaurantList = resData.restaurant_list.results;
            return restaurantList;
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
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
            return characterList;
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
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
            return dishesList;
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
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
            const res = await fetch(`/v1/restaurants/${restaurantId}/start-cook/`, options);
            const resData = await res.json();
            (0, logger_1.default)(`Started cooking`);
            console.log("Start cooking with response data:", resData);
            await helper_1.default.sleep(5000);
            await restaurantManager_1.default.manageRestaurants();
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
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
            const res = await fetch(`/v1/user/restaurants/${restaurantId}/open/`, options);
            const resData = await res.json();
            (0, logger_1.default)(`Restaurant with has been opened`);
            console.log("Open restaurant response data:", resData);
            await helper_1.default.sleep(5000);
            await restaurantManager_1.default.manageRestaurants();
        }
        catch (error) {
            (0, logger_1.default)(`${error.message}`);
        }
    },
};
exports["default"] = API;


/***/ }),
/* 3 */
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
};
exports["default"] = Helper;


/***/ }),
/* 4 */
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
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const rawConfig = {
    rarities: [
        "RARITY_RAW",
        "RARITY_RARE",
        "RARITY_MEDIUM_RARE",
        "RARITY_MEDIUM_WELL",
        "RARITY_WELL_DONE",
    ],
    rarity_names: {
        RARITY_RAW: "Raw",
        RARITY_RARE: "Rare",
        RARITY_MEDIUM_RARE: "Medium Rare",
        RARITY_MEDIUM_WELL: "Medium Well",
        RARITY_WELL_DONE: "Well Done",
    },
    rarity_levels: {
        RARITY_RAW: 1,
        RARITY_RARE: 2,
        RARITY_MEDIUM_RARE: 3,
        RARITY_MEDIUM_WELL: 4,
        RARITY_WELL_DONE: 5,
    },
    templates_in_game: [
        434217, 434222, 434221, 434219, 434218, 441193, -1, -1, -1, -1, 434228,
        434226, 434232, 434233, 434234, 485187, -1, -1, -1, -1, 407037, 407038,
        407040, 407041, 407042, 437349, 437345, 485208, 485207, 485216, 485204,
        485190, 485193, 437346, 441209, 441208, 442120, 485212, 441210, 485202,
        441212, 437343, 437344, 416361, 441207, 437347, 441194, 437350, 433259,
        475222, 475223, 475224,
    ],
    restaurant_statuses: {
        RESTAURANT_STATUS_OPENED: "Opened",
        RESTAURANT_STATUS_CLOSED: "Closed",
    },
    character_statuses: {
        CHARACTER_STATUS_READY: "Ready",
        CHARACTER_STATUS_WAITING_FOR_COOK: "Waiting",
        CHARACTER_STATUS_COOKING: "Cooking",
        CHARACTER_STATUS_ON_CONTRACT: "On contract",
        CHARACTER_STATUS_ON_REST: "Rest",
        CHARACTER_STATUS_WAITING_TO_OPEN_RESTAURANT: "Waiting restaurant open",
    },
    sort_types: {
        SORT_STATE: "State",
        SORT_TYPE: "Type",
        SORT_RARITY: "Rarity",
    },
    cook_templates: [434217, 434222, 434221, 434219, 434218, 475222],
    chef_templates: [441193, -1, -1, -1, -1],
    card_types: {
        CARD_TYPE_COOK: "CARD_TYPE_COOK",
        CARD_TYPE_CHEF: "CARD_TYPE_CHEF",
        CARD_TYPE_HELPER: "CARD_TYPE_HELPER",
        CARD_TYPE_RESTAURANT: "CARD_TYPE_RESTAURANT",
        CARD_TYPE_DISH: "CARD_TYPE_DISH",
        CARD_TYPE_SLICE_OF_CAKE: "CARD_TYPE_SLICE_OF_CAKE",
    },
    character_contracts: {
        CARD_TYPE_COOK: [1],
        CARD_TYPE_CHEF: [3, 7, 30],
    },
    helper_speed_up: {
        "434226": 10,
        "434228": 5,
        "434232": 15,
        "434233": 20,
        "434234": 25,
        "475223": 25,
    },
    dishes_to_cook_max_count_by_category: {
        restaurant_dishes: 1,
        chef_dishes: 1,
        worker_dishes: 100,
    },
    dishes_time_to_cook: {
        "416361": 70,
        "433259": 80,
        "437343": 60,
        "437344": 40,
        "437345": 40,
        "437346": 30,
        "437347": 60,
        "437349": 30,
        "437350": 60,
        "441194": 70,
        "441207": 80,
        "441208": 60,
        "441209": 50,
        "441210": 80,
        "441212": 90,
        "442120": 70,
        "475224": 60,
        "485190": 30,
        "485193": 90,
        "485202": 30,
        "485204": 80,
        "485207": 60,
        "485208": 50,
        "485212": 40,
        "485216": 70,
    },
    dish_slots_by_template_id: {
        "434217": 2,
        "434218": 4,
        "434219": 4,
        "434221": 3,
        "434222": 3,
        "441193": 4,
        "475222": 2,
        "485187": 2,
        "-1": 4,
    },
    helper_slots_by_template_id: {
        "434217": 1,
        "434218": 3,
        "434219": 2,
        "434221": 2,
        "434222": 1,
        "441193": 3,
        "475222": 1,
        "-1": 5,
    },
    restaurant_working_hours_by_template_id: {
        "485187": 12,
        "-1": 21,
    },
    HELPER_DROP_CHANCES: {
        "434226": 17,
        "434228": 66,
        "434232": 9,
        "434233": 6,
        "434234": 2,
    },
    GAME_WALLET_NAME: "mrpgamesnfts",
    GAME_COINS_WALLET_NAME: "mrptokenprod",
    GAME_COINS_PRODUCTION_WALLET_NAME: "mrptokenprod",
    GAME_NFTS_COLLECTION_NAME: "mrpotatogame",
    GAME_COINS_SHORT_NAME: "MRP",
    COIN_PRECISION_AFTER_DOT: "4",
    DISHES_TO_COOK_UPDATE_MINUTES: 180,
    PRICE_SHOP_HELPER: 250,
    SHOP_MAX_COUNT_TO_BUY_HELPER: 10,
    CRAFT_COOK_FROM_HELPER_CHANCES: {
        "3": {
            "434217": 100,
            "434221": 0,
            "434222": 0,
        },
        "4": {
            "434217": 97,
            "434221": 0,
            "434222": 3,
        },
        "5": {
            "434217": 94,
            "434221": 0,
            "434222": 6,
        },
        "6": {
            "434217": 90,
            "434221": 0,
            "434222": 10,
        },
        "7": {
            "434217": 85,
            "434221": 0,
            "434222": 15,
        },
        "8": {
            "434217": 79,
            "434221": 0,
            "434222": 21,
        },
        "9": {
            "434217": 70,
            "434221": 0,
            "434222": 30,
        },
        "10": {
            "434217": 66.7,
            "434221": 0.3,
            "434222": 33,
        },
        "11": {
            "434217": 60.4,
            "434221": 0.6,
            "434222": 39,
        },
        "12": {
            "434217": 44.8,
            "434221": 1.2,
            "434222": 54,
        },
        "13": {
            "434217": 44.4,
            "434221": 1.6,
            "434222": 54,
        },
        "14": {
            "434217": 34.7,
            "434221": 2.3,
            "434222": 63,
        },
        "15": {
            "434217": 0,
            "434221": 4,
            "434222": 96,
        },
    },
    CRAFT_COOK_FROM_HELPER_ALLOWED_COOK_TEMPLATE_IDS: [434217, 434222, 434221],
    CRAFT_COOK_FROM_HELPER_HELPERS_COUNT: 3,
    CRAFT_COOK_FROM_HELPER_PRICE: 250,
    PRICE_RESTAURANT_SLOT_INTERNAL_TEAM: {
        "485187": 2000,
        "-1": 2000,
    },
    PRICE_RESTAURANT_SLOT_EXTERNAL_TEAM: {
        "485187": 1000,
        "-1": 1000,
    },
    RESTAURANT_BUY_SLOT_TYPES: {
        RESTAURANT_BUY_SLOT_TYPE_INTERNAL: "RESTAURANT_BUY_SLOT_TYPE_INTERNAL",
        RESTAURANT_BUY_SLOT_TYPE_EXTERNAL: "RESTAURANT_BUY_SLOT_TYPE_EXTERNAL",
    },
    EXCHANGE_SLICE_OF_CAKE_COUNT: 6,
    CHEF_CONTRACT_REWARD_PERCENTS: {
        "3": 5,
        "7": 15,
        "30": 100,
    },
    PRICE_SLICE_OF_CAKE: {
        "407037": 20,
        "407038": 40,
        "407040": 56,
        "407041": 68,
        "407042": 78,
    },
    RARITY_LEVELS_BY_TEMPLATE_ID: {
        "407037": 1,
        "407038": 2,
        "407040": 3,
        "407041": 4,
        "407042": 5,
        "416361": 3,
        "433259": 5,
        "434217": 1,
        "434218": 5,
        "434219": 4,
        "434221": 3,
        "434222": 2,
        "434226": 2,
        "434228": 1,
        "434232": 3,
        "434233": 4,
        "434234": 5,
        "437343": 3,
        "437344": 3,
        "437345": 1,
        "437346": 2,
        "437347": 4,
        "437349": 1,
        "437350": 5,
        "441193": 1,
        "441194": 4,
        "441207": 3,
        "441208": 2,
        "441209": 2,
        "441210": 2,
        "441212": 2,
        "442120": 2,
        "485187": 1,
        "485190": 1,
        "485193": 1,
        "485202": 2,
        "485204": 1,
        "485207": 1,
        "485208": 1,
        "485212": 2,
        "485216": 1,
        "-1": 5,
    },
    RESTAURANT_NAME_PRICE: 500,
    QUEST_SPEED_PERCENT_REQUIREMENTS: {
        RARITY_RAW: 5,
        RARITY_RARE: 10,
        RARITY_MEDIUM_RARE: 24,
        RARITY_MEDIUM_WELL: 35,
        RARITY_WELL_DONE: 45,
    },
    COIN_CLAIM_TYPES: {
        COIN_CLAIM_TYPE_COOKING: "Cooking",
        COIN_CLAIM_TYPE_RESTAURANT_FEE: "Restaurant fee",
        COIN_CLAIM_TYPE_CHEF_CONTRACT_REWARD: "Chef contract reward",
        COIN_CLAIM_TYPE_CHEF_DISH_EVENT: "Chef dish event",
    },
    COIN_TRANSACTION_TYPES: {
        COIN_TRANSACTION_TYPE_WITHDRAWN: "Withdrawn",
        COIN_TRANSACTION_TYPE_DEPOSIT: "Deposit",
        COIN_TRANSACTION_TYPE_BURN_SLICES_CAKE: "Cakes exchange",
        COIN_TRANSACTION_TYPE_BUY_HELPER: "Buy helper",
        COIN_TRANSACTION_TYPE_BUY_AD: "Restaurant ad",
        COIN_TRANSACTION_TYPE_BUY_RESTAURANT_NAME: "Restaurant name",
        COIN_TRANSACTION_TYPE_BUY_RESTAURANT_INTERNAL_SLOT: "Internal slot",
        COIN_TRANSACTION_TYPE_BUY_RESTAURANT_EXTERNAL_SLOT: "External slot",
        COIN_TRANSACTION_TYPE_CLAIM_COIN: "Claim",
        COIN_TRANSACTION_TYPE_CRAFT_COOK_FROM_HELPERS: "Helpers exchange",
        COIN_TRANSACTION_TYPE_WITHDRAWN_FEE: "Withdrawn fee",
    },
    WITHDRAW_FEE_DAYS_COUNT: 20,
};
const config = rawConfig;
exports["default"] = config;


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