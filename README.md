# [WIP] Medium Rare Potato restaurant management script

QoL script made to manage your restaurant

# Important

- You have to be logged in and verified on [MRP Game](https://game.medium-rare-potato.io) before using this script
- Between all action there was added 1 minute delay, because character data returned from server is not correct at times

# Usage

1. Install [Tampermonkey browser extension](https://www.tampermonkey.net/)
2. Open tampermonkey dashboard, copy everything in [mrp-script.user.js](/mrp-script.user.js) file, paste it in editor and save it

# Workflow

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

    - Finding best profitable restaurant dish (restaurant dish with max profit per minute ratio)
    - Finding best chef dish (chef dish with max profit per minute ratio)
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
