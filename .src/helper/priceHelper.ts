import { AddonInfo } from '../models/AddonModel';

export function extractPrice(price: string): number {
  const match = price!.match(/\d+\.?\d+/g)!;
  return parseFloat(match[0]);
}

export function sumPriceAddons(objects: AddonInfo[]): number {
  let sum: number = 0;
  for (const object of objects) {
    sum += object.price!;
  }
  return sum;
}

export function sumAndFixedNumber(...numbers: number[]): number {
  const sum = numbers.reduce((curSum, curNum) => {
    return curSum + curNum;
  }, 0);

  return Number(sum.toFixed(2));
}
