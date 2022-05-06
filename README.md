# [WIP] Medium Rare Potato restaurant management script

Script made to manage your restaurant

# Usage

Open [MRP Game](http://https://game.medium-rare-potato.io/ "MRP Game"), open browser Dev Tools (F12), copy everything in [index.js](/index.js) file, paste it in Dev Tool console and press Enter

# Workflow

- Fetch restaurants and charaters data
- Looping throught restaurant, if they can be opened -> open them
- Looping through charaters -> checking if restaurant in wich character is working is opened -> checking if character not cooking yet
- Finding best profitable combination of dishes, that cook <= 180 minutes
  - Finding best profitable restaurant dish (dish with max profit per minute ratio)
  - [WIP] Finding best chef dish (dish with max profit per minute ratio)
  - Combining them with all dishes, that character can cook
  - Finding combination of dishes for maximum profit
- Repeat in 2 minutes
