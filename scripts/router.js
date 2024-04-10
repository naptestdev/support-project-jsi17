import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { auth, subscriptions } from "./firebase.js";

const routes = {
  "/": {
    body: "./routes/home.html",
    requireAuth: false,
    notRequireAuth: false,
  },
  "/login": {
    body: "./routes/login.html",
    requireAuth: false,
    notRequireAuth: true,
  },
  "/register": {
    body: "./routes/register.html",
    requireAuth: false,
    notRequireAuth: true,
  },
  "/cart": {
    body: "./routes/cart.html",
    requireAuth: true,
    notRequireAuth: false,
  },
};

const isMatchRoute = (route, pathname) => {
  const parsed = route.replace(/\/:[^\/]+/gm, "/[^\\/]+");

  const regex = new RegExp(`^${parsed}\\/?$`, "gm");
  const isMatching = regex.test(pathname);

  let params = {};

  if (isMatching) {
    const routeMatches = route.match(/\/[^\\\/]+/gm) || [];
    const pathnameMatches = pathname.match(/\/[^\\\/]+/gm) || [];

    for (const [index, routeMatch] of routeMatches.entries()) {
      if (routeMatch.startsWith("/:")) {
        params[routeMatch.slice(2)] = pathnameMatches[index].slice(1);
      }
    }
  }

  return { isMatching, params };
};

export let params = {};

const renderRoute = () => {
  subscriptions.forEach((subscription) => subscription());

  let hasMatched = false;
  for (const route in routes) {
    const { isMatching, params: loadedParams } = isMatchRoute(
      route,
      location.hash ? location.hash.slice(1) : "/"
    );

    if (isMatching) {
      hasMatched = true;
      params = loadedParams;
      if (
        routes[route].requireAuth &&
        (!auth.currentUser || !auth.currentUser.emailVerified)
      ) {
        location.hash = "/login";
        break;
      }
      if (
        routes[route].notRequireAuth &&
        auth.currentUser &&
        auth.currentUser.emailVerified
      ) {
        location.hash = "/";
        break;
      }
      fetch(routes[route].body)
        .then((res) => res.text())
        .then((html) => {
          document.body.innerHTML = "";
          document.body.append(
            document.createRange().createContextualFragment(html)
          );
        });
      break;
    }
  }
  if (!hasMatched) document.body.innerHTML = `404`;
};

onAuthStateChanged(auth, () => {
  renderRoute();
});

window.addEventListener("hashchange", () => {
  renderRoute();
});
