import Helper from "./lib/helper";
import logger from "./lib/logger";
import restaurantManager from "./lib/restaurantManager";

(async () => {
  console.clear();
  logger("Script will be initialized in 10 seconds");
  await Helper.sleep(10000);
  logger("Script initialized");

  while (true) {
    await restaurantManager.init();
    await Helper.sleep(60000);
  }
})();
