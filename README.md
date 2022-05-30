# [WIP] Medium Rare Potato restaurant management script

QoL script made to manage your restaurant

# Important

- Currently tested only for one restaurant with chef and one cook
- You have to be logged in and verified on [MRP Game](https://game.medium-rare-potato.io) before using this script
- If you have done any manual action (such as sign cook contract with restaurant) you have to reload page and run script again

# Usage

- **How to use this user script:**

Use trough Dev Tools. Open [MRP Game](https://game.medium-rare-potato.io), open browser Dev Tools (F12), copy everything in [MRP-restaurant-manager.user.js](/dist/MRP-restaurant-manager.user.js) file, paste it in Dev Tool console and press Enter

- **COOK SETTINGS**

1. By default, people themselves search for a restaurant and sign a cook, and then the script will start cooking (nothing needs to be changed in the script).
2. For those who want the script to do everything (search for a restaurant, sign a cook, etc.), you need to change the value from **"false"** to **"true"**.
   To change settings options, you need to find (use ctrl+f) in [MRP-restaurant-manager.user.js](/dist/MRP-restaurant-manager.user.js) the following object

```
const settings = {
    findContractForCookIsEnabled: false,
    ...
};
```

# Workflow

- Waiting 10 seconds for page loading
- Fetch restaurants and characters data
- Looping through restaurant
  - Open restaurant if possible
- Looping through characters
  - If character is Cook + don't have signed contract + not resting and if option findContractForCookIsEnabled (you can see how change this option in usage section) is true (false by default), then will be fired [findAndSignContractForCharacter()](#main-algorithms-workflow), which finds best suitable restaurant for this character and sign contract with it
  - Checking if restaurant in which character working is opened and if character is free
  - Firing [getBestDishCombination()](#main-algorithms-workflow)
  - Start cooking
- Calculate time until next action
- Sleep until next action

# TODO

1. Add UI

## Main algorithms workflow

1.  getBestDishCombination()

    - Finding best profitable restaurant dish (dish with max profit per minute ratio)
    - Finding best chef dish (dish with max profit per minute ratio)
    - Combining them with all dishes, that character can cook
    - Return the best profitable combination of dishes, that accumulative cook time less or equal then 180 minutes (Using knapsack algorithm)

2.  findAndSignContractForCharacter()

    - Recursively find opened restaurants with free slots
    - Filter them by time (no more than three hours should pass from the moment of opening) and character rarity (restaurant must have 1 restaurant_dish or chef_dish with rarity equal or less than cook's rarity)
    - For each filtered restaurant:
      - Firing getBestDishCombination()
      - Calculate total profit
    - Return best variant by profit

```
    total_profit = profit_for_all_dishes * (restaurant_fee/100) * restaurant_rarity_coefficient
```

# DONATIONS AND CONTACTS

- My discord - **Shrixy#9453**
- Thanks for your support - **ivrjw.wam**
- Special thanks for providing NFT for tests - **retry_88#9056**
