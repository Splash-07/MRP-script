import { CharacterCook, CharacterChef, Character, Restaurant } from "./index";

export function isCook(character: CharacterCook | CharacterChef): character is CharacterCook {
  return "cook_dishes" in character;
}

export function isChef(character: CharacterCook | CharacterChef): character is CharacterChef {
  return "chef_dishes" in character;
}

export function isCharacter(content: Restaurant | Character): content is Character {
  return "cook_end" in content;
}

export function isRestaurant(content: Restaurant | Character): content is Restaurant {
  return "fee" in content;
}
