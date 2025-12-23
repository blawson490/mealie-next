/**
 * Application route constants derived from the App Router directory structure.
 * Route groups (e.g. (app), (auth)) are omitted from the URL paths.
 */
export const ROUTES = {
  ROOT: "/",
  MARKETING: {
    HOME: "/",
  },
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  APP: {
    HOME: {
      ROOT: "/home",
      RECIPES: {
        ROOT: "/home/recipes",
        FINDER: "/home/recipes/finder",
        TIMELINE: "/home/recipes/timeline",
      },
    },
    HOUSEHOLD: {
      COOKBOOKS: {
        LIST: "/household/cookbooks",
        DETAIL: (cookbookId: string | number) =>
          `/household/cookbooks/${encodeURIComponent(cookbookId)}`,
      },
      MEALPLAN: {
        ROOT: "/household/mealplan",
        PLANNER: "/household/mealplan/planner",
        SETTINGS: "/household/mealplan/settings",
      },
      SHOPPING_LISTS: "/household/shopping-lists",
    },
  },
};
