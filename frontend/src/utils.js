/*
  Simple, per visit cache of successful URL requests

  This app is super chatty - every keystroke requests a new completion.
  This cuts down on two unnecessary calls
    * Completions when backspacing
    * Completions when swapping subreddits
*/
const cache = {}
export function cachedFetch(url) {
  if (cache[url]) {
    const cached = cache[url].clone()
    return new Promise((resolve) => resolve(cached))
  }

  return fetch(url).then((response) => {
    cache[url] = response.clone()
    return response
  })
}

/*
  Return a random item from a list
*/
export function choice(items) {
  return items[Math.floor(Math.random() * items.length)];
}
