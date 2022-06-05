import restaurantManager from "./services/restaurantManager.service";

(async () => {
  console.clear();
  await restaurantManager.init();
})();
