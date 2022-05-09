# [WIP] Medium Rare Potato restaurant management script

QoL script made to manage your restaurant

# Important

- Currently tested only for one restaurant with chef and one cook
- You have to be logged in and verified on [MRP Game](https://game.medium-rare-potato.io) before using this script
- Between all action there was added 1 minute delay, because character data returned from server, is not correct at times

# Usage

You have two ways of using this user script:

1. Use trough Dev Tools. Open [MRP Game](https://game.medium-rare-potato.io), open browser Dev Tools (F12), copy everything in [MRP-restaurant-manager.user.js](/dist/MRP-restaurant-manager.user.js) file, paste it in Dev Tool console and press Enter
2. Use trough tampermonkey. Install [Tampermonkey browser extension](https://www.tampermonkey.net/), open tampermonkey dashboard, copy everything in [MRP-restaurant-manager.user.js](/dist/MRP-restaurant-manager.user.js) file, paste it in editor and save it

To change settings options, you need to find (use ctrl+f) in [MRP-restaurant-manager.user.js](/dist/MRP-restaurant-manager.user.js) '' the following object

```
//if findContractForCookIsEnabled is true then, if cook don't have contract yet, will be fired find best restaurant algorithm
const settings = {
    findContractForCookIsEnabled: false,
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

~~1. Handle cooks~~
~~2. Filter dish pull by character rarity~~
~~3. Using setTimeout instead of while infinity loop, to decrease needles request to API to minimum~~
~~4. getMaxProfitableCombinationOfDishIds function optimization (maybe)~~

1. Add UI

#Main algorithms workflow

1.  getBestDishCombination()

    - Finding best profitable restaurant dish (dish with max profit per minute ratio)
    - Finding best chef dish (dish with max profit per minute ratio)
    - Combining them with all dishes, that character can cook
    - Finding the best profitable combination of dishes, that accumulative cook time less or equal then 180 minutes (Using knapsack algorithm)

2.  findAndSignContractForCharacter()
    - Recursively find opened restaurants with free slots
    - Filter them by time (no more than three hours should pass from the moment of opening) and character rarity (restaurant must have 1 restaurant_dish or chef_dish with rarity equal or less than cook's rarity)
    - For each filtered restaurant:
      - Firing getBestDishCombination()
      - Calculate total profit

```
    profit_for_all_dishes * (restaurant_fee/100) * restaurant_rarity_coefficient
```

    - Return best variant by profit

# DONATIONS AND CONTACTS

- My discord - Shrixy#9453
- Thanks for your support - ivrjw.wam
