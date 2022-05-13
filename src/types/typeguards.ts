import { CharacterCook, CharacterChef } from "./index";

export function isCook(character: CharacterCook | CharacterChef): character is CharacterCook {
  return "cook_dishes" in character;
}

export function isChef(character: CharacterCook | CharacterChef): character is CharacterChef {
  return "chef_dishes" in character;
}
