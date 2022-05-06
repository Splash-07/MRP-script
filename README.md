# [WIP] Medium Rare Potato restaurant management script

QoL script made to manage your restaurant

# Important

- Currently tested only for one restaurant with chef
- The script DOESN'T WORK for cooks (I don't have a cook so I can't test it yet)
- You have to be logged in and verified on [MRP Game](https://game.medium-rare-potato.io) before using this script

# Usage

You have two ways of using this user script:

1. Use trough Dev Tools. Open [MRP Game](http://https://game.medium-rare-potato.io), open browser Dev Tools (F12), copy everything in [MRP-restaurant-manager.user.js](/dist/MRP-restaurant-manager.user.js) file, paste it in Dev Tool console and press Enter
2. Use trough tampermonkey. Install [Tampermonkey browser extension](https://www.tampermonkey.net/), open tampermonkey dashboard, copy everything in [MRP-restaurant-manager.user.js](/dist/MRP-restaurant-manager.user.js) file, paste it in editor and save it

# Workflow

- Waiting 10 seconds for page loading
- Fetch restaurants and characters data
- Looping through restaurant
  - Open restaurant if possible
- Looping through characters
  - Checking if restaurant in which character working is opened
  - Checking if character is free
  - If character is free, then finding the best profitable combination of dishes, that accumulative cook time less or equal then 180 minutes
    - Finding best profitable restaurant dish (dish with max profit per minute ratio)
    - [WIP] Finding best chef dish (dish with max profit per minute ratio)
    - Combining them with all dishes, that character can cook
    - Finding combination of dishes for maximum profit
- Repeat in 2 minutes

# TODO

1. Logger
2. Filter dish pull by character rarity
3. Using setInterval instead of while infinity loop, to decrease needles request to API to minimum
4. Page reload (maybe)
5. getMaxProfitableCombinationOfDishIds function optimization (maybe)

# DONATIONS AND CONTACTS

- My discord - Shrixy#9453
- Thanks for your support - ivrjw.wam 
