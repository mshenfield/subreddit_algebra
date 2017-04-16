/*
  Returns the url of the /api endpoint for the current environment.

  I haven't configured run or build time settings yet, so this handles
  differences between the prod and dev enviornments.
*/
export function apiUrl() {
    let apiSubpath;
    if (process.env.NODE_ENV === "production") {
      // The WSGI application is mounted at /api in production
      apiSubpath = '/api'
    } else {
      // But is just at the root URL on port 5000 in dev
      apiSubpath = ':5000'
    }
    return `http://${window.location.hostname}${apiSubpath}`;
}

/*
  Return a random item from a list
*/
export function choice(items) {
  return items[Math.floor(Math.random() * items.length)];
}
