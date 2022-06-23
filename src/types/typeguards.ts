import { CharacterCook, CharacterChef, Restaurant, Character } from './index';

export function isCook(character: Character): character is CharacterCook {
  return 'cook_dishes' in character;
}

export function isChef(character: Character): character is CharacterChef {
  return 'chef_dishes' in character;
}

export function isCharacter(
  content: Restaurant | Character
): content is Character {
  return 'cook_end' in content;
}

export function isRestaurant(
  content: Restaurant | Character
): content is Restaurant {
  return 'fee' in content;
}
