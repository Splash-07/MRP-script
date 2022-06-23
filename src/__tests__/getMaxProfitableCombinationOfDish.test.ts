/**
 * @jest-environment jsdom
 */
import restaurantManager from '../services/restaurantManager.service';
import { Dish } from '../types';

const { getMaxProfitableCombinationOfDish } = restaurantManager;

const caseOne: Dish[] = [
  {
    dish_id: '20d8ca21-5b34-4802-b015-79f2de2c959b',
    name: 'Peking duck',
    profit: 56.392,
    price: 53.2,
    dish_atomichub_template_id: 525663,
    rarity: 0,
    time: 33.6,
  },
  {
    dish_id: 'b511f0c5-65ad-4a32-962b-6476ca4b196b',
    name: 'Reuben sandwich',
    profit: 25.3,
    price: 23,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 24,
  },
  {
    dish_id: '2bd9903f-0332-4e77-8881-906e3e30a907',
    name: 'Reuben sandwich',
    profit: 25.3,
    price: 23,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 24,
  },
  {
    dish_id: 'cd6c0e52-c226-4ddc-9a8c-a5a62acd5ee5',
    name: 'Reuben sandwich',
    profit: 25.3,
    price: 23,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 24,
  },
  {
    dish_id: '5e1342ae-0f17-4229-ab3f-e37002633572',
    name: 'Potato in Gold Oil',
    profit: 63.232,
    price: 60.8,
    dish_atomichub_template_id: 433259,
    rarity: 0,
    time: 38.4,
  },
  {
    dish_id: '443b8af0-9375-443d-b2dc-2219d8a91b38',
    name: 'Tom yum',
    profit: 34.776,
    price: 32.2,
    dish_atomichub_template_id: 441194,
    rarity: 0,
    time: 33.6,
  },
];
const resultOne: Dish[] = [
  {
    dish_id: '5e1342ae-0f17-4229-ab3f-e37002633572',
    name: 'Potato in Gold Oil',
    profit: 63.232,
    price: 60.8,
    dish_atomichub_template_id: 433259,
    rarity: 0,
    time: 38.4,
  },
  {
    dish_id: '20d8ca21-5b34-4802-b015-79f2de2c959b',
    name: 'Peking duck',
    profit: 56.392,
    price: 53.2,
    dish_atomichub_template_id: 525663,
    rarity: 0,
    time: 33.6,
  },
  {
    dish_id: '443b8af0-9375-443d-b2dc-2219d8a91b38',
    name: 'Tom yum',
    profit: 34.776,
    price: 32.2,
    dish_atomichub_template_id: 441194,
    rarity: 0,
    time: 33.6,
  },
  {
    dish_id: 'cd6c0e52-c226-4ddc-9a8c-a5a62acd5ee5',
    name: 'Reuben sandwich',
    profit: 25.3,
    price: 23,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 24,
  },
  {
    dish_id: '2bd9903f-0332-4e77-8881-906e3e30a907',
    name: 'Reuben sandwich',
    profit: 25.3,
    price: 23,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 24,
  },
  {
    dish_id: 'b511f0c5-65ad-4a32-962b-6476ca4b196b',
    name: 'Reuben sandwich',
    profit: 25.3,
    price: 23,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 24,
  },
];
const caseTwo: Dish[] = [
  {
    dish_id: '20d8ca21-5b34-4802-b015-79f2de2c959b',
    name: 'Khinkali',
    profit: 4.8,
    price: 8,
    dish_atomichub_template_id: 525663,
    rarity: 0,
    time: 38.25,
  },
  {
    dish_id: 'b511f0c5-65ad-4a32-962b-6476ca4b196b',
    name: 'Toad in the hole',
    profit: 6.72,
    price: 11.2,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 53.55,
  },
  {
    dish_id: 'b511f0c5-65ad-4a32-962b-6476ca4b196b',
    name: 'Toad in the hole',
    profit: 6.72,
    price: 11.2,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 53.55,
  },
  {
    dish_id: 'cd6c0e52-c226-4ddc-9a8c-a5a62acd5ee5',
    name: 'Pot-au-feu',
    profit: 8.4,
    price: 14,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 38.25,
  },
  {
    dish_id: '5e1342ae-0f17-4229-ab3f-e37002633572',
    name: 'Nigirizushi',
    profit: 13.44,
    price: 22.4,
    dish_atomichub_template_id: 433259,
    rarity: 0,
    time: 61.2,
  },
];
const resultTwo: Dish[] = [
  {
    dish_id: '5e1342ae-0f17-4229-ab3f-e37002633572',
    name: 'Nigirizushi',
    profit: 13.44,
    price: 22.4,
    dish_atomichub_template_id: 433259,
    rarity: 0,
    time: 61.2,
  },
  {
    dish_id: 'cd6c0e52-c226-4ddc-9a8c-a5a62acd5ee5',
    name: 'Pot-au-feu',
    profit: 8.4,
    price: 14,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 38.25,
  },
  {
    dish_id: 'b511f0c5-65ad-4a32-962b-6476ca4b196b',
    name: 'Toad in the hole',
    profit: 6.72,
    price: 11.2,
    dish_atomichub_template_id: 512774,
    rarity: 0,
    time: 53.55,
  },
];
const caseThree: Dish[] = [
  {
    dish_id: 'ef398fb7-197f-4e51-a47f-062d154b5669',
    name: 'Ensaladang talong',
    profit: 6.36,
    price: 6,
    dish_atomichub_template_id: 485207,
    time: 54,
    rarity: 1,
  },
  {
    dish_id: '54572fea-e29b-465f-8b6c-13f1bf5a1770',
    name: 'Calcot ',
    profit: 3.24,
    price: 3,
    dish_atomichub_template_id: 437349,
    time: 27,
    rarity: 1,
  },
  {
    dish_id: '9a98dcf9-9512-4f79-8a95-305c5bab04b2',
    name: 'Kimchi',
    profit: 8,
    price: 8,
    dish_atomichub_template_id: 485204,
    time: 72,
    rarity: 1,
  },
  {
    dish_id: 'c0b4c99d-6558-484e-8437-bf3f6dcc451e',
    name: 'Greek salad',
    profit: 3.18,
    price: 3,
    dish_atomichub_template_id: 485190,
    time: 27,
    rarity: 1,
  },
];
const resultThree: Dish[] = [
  {
    dish_id: '9a98dcf9-9512-4f79-8a95-305c5bab04b2',
    name: 'Kimchi',
    profit: 8,
    price: 8,
    dish_atomichub_template_id: 485204,
    time: 72,
    rarity: 1,
  },
  {
    dish_id: 'ef398fb7-197f-4e51-a47f-062d154b5669',
    name: 'Ensaladang talong',
    profit: 6.36,
    price: 6,
    dish_atomichub_template_id: 485207,
    time: 54,
    rarity: 1,
  },
  {
    dish_id: 'c0b4c99d-6558-484e-8437-bf3f6dcc451e',
    name: 'Greek salad',
    profit: 3.18,
    price: 3,
    dish_atomichub_template_id: 485190,
    time: 27,
    rarity: 1,
  },
  {
    dish_id: '54572fea-e29b-465f-8b6c-13f1bf5a1770',
    name: 'Calcot ',
    profit: 3.24,
    price: 3,
    dish_atomichub_template_id: 437349,
    time: 27,
    rarity: 1,
  },
];
const caseFour: Dish[] = [
  {
    dish_id: 'aa8d1b14-a664-4396-8ba4-31c51bae427e',
    name: 'Cacciucco',
    profit: 47.424,
    price: 45.6,
    dish_atomichub_template_id: 437350,
    time: 36.847500000000004,
    rarity: 5,
  },
  {
    dish_id: '1ad4310e-299e-4666-b6f6-2de4a1541c03',
    name: 'Duck confit',
    profit: 29.256,
    price: 27.6,
    dish_atomichub_template_id: 437347,
    time: 36.847500000000004,
    rarity: 4,
  },
  {
    dish_id: '685fb35c-9189-49af-aa0f-05d83c778ee7',
    name: 'Pulpo a la gallega',
    profit: 12.096,
    price: 11.2,
    dish_atomichub_template_id: 437344,
    time: 24.565,
    rarity: 3,
  },
  {
    dish_id: '0eb4678a-8454-4e9a-b64e-55712664a053',
    name: 'Buffalo wings',
    profit: 10.368,
    price: 9.6,
    dish_atomichub_template_id: 441208,
    time: 36.847500000000004,
    rarity: 2,
  },
  {
    dish_id: '4bd67a36-0fea-4b41-9ef5-92e1fe2f3b61',
    name: 'Lobster roll',
    profit: 68.4,
    price: 68.4,
    dish_atomichub_template_id: 534026,
    time: 55.27125,
    rarity: 5,
  },
  {
    dish_id: '9af46632-5c5e-46bc-abdb-caa9f0ddb036',
    name: 'Nigirizushi',
    profit: 23.296,
    price: 22.4,
    dish_atomichub_template_id: 441207,
    time: 49.13,
    rarity: 3,
  },
];
const resultFour: Dish[] = [
  {
    dish_id: '4bd67a36-0fea-4b41-9ef5-92e1fe2f3b61',
    name: 'Lobster roll',
    profit: 68.4,
    price: 68.4,
    dish_atomichub_template_id: 534026,
    time: 55.27125,
    rarity: 5,
  },
  {
    dish_id: 'aa8d1b14-a664-4396-8ba4-31c51bae427e',
    name: 'Cacciucco',
    profit: 47.424,
    price: 45.6,
    dish_atomichub_template_id: 437350,
    time: 36.847500000000004,
    rarity: 5,
  },
  {
    dish_id: '1ad4310e-299e-4666-b6f6-2de4a1541c03',
    name: 'Duck confit',
    profit: 29.256,
    price: 27.6,
    dish_atomichub_template_id: 437347,
    time: 36.847500000000004,
    rarity: 4,
  },
  {
    dish_id: '9af46632-5c5e-46bc-abdb-caa9f0ddb036',
    name: 'Nigirizushi',
    profit: 23.296,
    price: 22.4,
    dish_atomichub_template_id: 441207,
    time: 49.13,
    rarity: 3,
  },
];

test('Check if function work correctly case one', () => {
  expect(getMaxProfitableCombinationOfDish(caseOne, 180)).toStrictEqual(
    resultOne
  );
});

test('Check if function work correctly case two', () => {
  expect(getMaxProfitableCombinationOfDish(caseTwo, 180)).toStrictEqual(
    resultTwo
  );
});

test('Check if function work correctly case three', () => {
  expect(getMaxProfitableCombinationOfDish(caseThree, 180)).toStrictEqual(
    resultThree
  );
});
test('Check if function work correctly case four', () => {
  expect(getMaxProfitableCombinationOfDish(caseFour, 180)).toStrictEqual(
    resultFour
  );
});
