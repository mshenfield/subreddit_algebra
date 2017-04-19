/*
  Return a random item from a list
*/
export function choice(items) {
  return items[Math.floor(Math.random() * items.length)];
}
