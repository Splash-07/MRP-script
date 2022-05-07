import restaurantManager from "./lib/restaurantManager";

(async () => {
  console.clear();

  await restaurantManager.init();
})();
