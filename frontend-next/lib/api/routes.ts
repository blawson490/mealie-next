/**
 * Explore group slug route helper
 * @param groupSlug Group slug or ID
 * @returns The route for the specified group slug
 */
const exploreGroupSlug = (groupSlug: string | number) =>
  `/explore/groups/${encodeURIComponent(groupSlug)}`;

/**
 * API route constants for the application
 */
export const API_ROUTES = {
  AUTH: {
    TOKEN: "/api/auth/token",
    OAUTH: "/api/auth/oauth",
    OAUTH_CALLBACK: (searchParams: string) =>
      `/api/auth/oauth/callback?${searchParams}`,
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
  },
  APP: {
    CONFIG: "/api/app/about",
    STARTUP_INFO: "/api/app/about/startup-info",
    THEME: "/api/app/theme",
  },
  USERS: {
    REGISTRATION: "/api/users/register",
    CRUD: {
      SELF: "/api/users/self",
      RATINGS: "/api/users/self/ratings",
      RECIPE_RATING: (recipe_id: string) =>
        `/api/users/self/ratings/${encodeURIComponent(recipe_id)}`,
      FAVORITES: "/api/users/self/favorites",
      UPDATE_PASSWORD: "/api/users/self/password",
      UPDATE_USER: (item_id: string) =>
        `/api/users/${encodeURIComponent(item_id)}`,
    },
    PASSWORDS: {
      FORGOT: "/api/users/forgot-password",
      RESET: "/api/users/reset-password",
    },
    IMAGES: {
      UPDATE: (id: string) => `/api/users/${encodeURIComponent(id)}/image`,
    },
    TOKENS: {
      CREATE: "/api/users/api-tokens",
      DELETE: (token_id: string) =>
        `/api/users/api-tokens/${encodeURIComponent(token_id)}`,
    },
    RATINGS: {
      GET: (user_id: string) =>
        `/api/users/${encodeURIComponent(user_id)}/ratings/`,
      FAVORITES: (user_id: string) =>
        `/api/users/${encodeURIComponent(user_id)}/favorites`,
      SET_RATING: (user_id: string, slug: string) =>
        `/api/users/${encodeURIComponent(user_id)}/ratings/${encodeURIComponent(
          slug
        )}`,
      ADD_FAVORITE: (user_id: string, slug: string) =>
        `/api/users/${encodeURIComponent(
          user_id
        )}/favorites/${encodeURIComponent(slug)}`,
      DELETE_FAVORITE: (user_id: string, slug: string) =>
        `/api/users/${encodeURIComponent(
          user_id
        )}/favorites/${encodeURIComponent(slug)}`,
    },
  },
  RECIPES: {
    LIST: "/api/recipes",
    SUGGESTIONS: "/api/recipes/suggestions",
    CRUD: (recipe_slug: string) =>
      `/api/recipes/${encodeURIComponent(recipe_slug)}`,
    IMAGE: (recipe_id: string) =>
      `/api/recipes/${encodeURIComponent(recipe_id)}/image`,
    IMPORT: "/api/recipes/import",
    SHARED: {
      ACCESS: (token: string) =>
        `/api/recipes/shared/${encodeURIComponent(token)}`,
    },
  },
  MEALPLANS: {
    LIST: "/api/households/mealplans",
    CRUD: {
      CREATE: "/api/households/mealplans",
      GET: (mealplan_id: string) =>
        `/api/households/mealplans/${encodeURIComponent(mealplan_id)}`,
      UPDATE: (mealplan_id: string) =>
        `/api/households/mealplans/${encodeURIComponent(mealplan_id)}`,
      DELETE: (mealplan_id: string) =>
        `/api/households/mealplans/${encodeURIComponent(mealplan_id)}`,
    },
    TODAY: "/api/households/mealplans/today",
    RANDOM: "/api/households/mealplans/random",
  },
  MEDIA: {
    RECIPES: {
      IMAGE: (
        recipeId: string,
        version: string = "",
        key: string | number = 1
      ) =>
        `/api/media/recipes/${encodeURIComponent(
          recipeId
        )}/images/original.webp?rnd=${key}&version=${version}`,
      SMALL_IMAGE: (
        recipeId: string,
        version: string = "",
        key: string | number = 1
      ) =>
        `/api/media/recipes/${encodeURIComponent(
          recipeId
        )}/images/min-original.webp?rnd=${key}&version=${version}`,
      TINY_IMAGE: (
        recipeId: string,
        version: string = "",
        key: string | number = 1
      ) =>
        `/api/media/recipes/${encodeURIComponent(
          recipeId
        )}/images/tiny-original.webp?rnd=${key}&version=${version}`,
      TIMELINE_EVENT: (recipeId: string, timelineEventId: string) =>
        `/api/media/recipes/${encodeURIComponent(
          recipeId
        )}/images/timeline/${encodeURIComponent(
          timelineEventId
        )}/original.webp`,
      TIMELINE_EVENT_SMALL: (recipeId: string, timelineEventId: string) =>
        `/api/media/recipes/${encodeURIComponent(
          recipeId
        )}/images/timeline/${encodeURIComponent(
          timelineEventId
        )}/min-original.webp`,
      TIMELINE_EVENT_TINY: (recipeId: string, timelineEventId: string) =>
        `/api/media/recipes/${encodeURIComponent(
          recipeId
        )}/images/timeline/${encodeURIComponent(
          timelineEventId
        )}/tiny-original.webp`,
      ASSET: (recipeId: string, assetName: string) =>
        `/api/media/recipes/${encodeURIComponent(
          recipeId
        )}/assets/${encodeURIComponent(assetName)}`,
    },

    USERS: {
      PROFILE: (userId: string, cacheKey: string | number = 1) =>
        `/api/media/users/${encodeURIComponent(
          userId
        )}/profile.webp?cacheKey=${cacheKey}`,
    },
  },
  SHARED: {
    GET_SHARED_RECIPE: (tokenId: string) =>
      `/api/recipes/shared/${encodeURIComponent(tokenId)}`,
    // TODO Update route for query params
    GET_SHARES_FOR_RECIPE: (recipe_id: string) =>
      `/api/shared/recipes?page=1&perPage=-1&recipe_id=${encodeURIComponent(
        recipe_id
      )}`,
    CREATE_SHARE_FOR_RECIPE: `/api/shared/recipes`,
    DELETE_SHARE: (share_id: string) =>
      `/api/shared/recipes/${encodeURIComponent(share_id)}`,
  },
  EXPORTS: {
    ZIP_TOKEN: (recipe_slug: string) =>
      `/api/recipes/${encodeURIComponent(recipe_slug)}/exports`,
    ZIP: (recipe_slug: string, token: string) =>
      `/api/recipes/${encodeURIComponent(
        recipe_slug
      )}/exports/zip?token=${encodeURIComponent(token)}`,
  },
  ORGANIZERS: {
    CATEGORIES: {
      LIST: "/api/organizers/categories",
      CRUD: (category_id: string) =>
        `/api/organizers/categories/${encodeURIComponent(category_id)}`,
    },
    TAGS: {
      LIST: "/api/organizers/tags",
      CRUD: (tag_id: string) =>
        `/api/organizers/tags/${encodeURIComponent(tag_id)}`,
    },
    TOOLS: {
      LIST: "/api/organizers/tools",
      CRUD: (tool_id: string) =>
        `/api/organizers/tools/${encodeURIComponent(tool_id)}`,
    },
    FOODS: {
      LIST: "/api/foods",
      CRUD: (food_id: string) => `/api/foods/${encodeURIComponent(food_id)}`,
    },
  },
  GROUPS: {
    MEMBERS: "/api/groups/members",
    HOUSEHOLDS: "/api/groups/households",
    SELF: "/api/groups/self",
    PREFERENCES: "/api/groups/preferences",
    STORAGE: "/api/groups/storage",
    ADMIN: {
      GROUPS: "/api/admin/groups",
      GROUP: (group_id: string) =>
        `/api/admin/groups/${encodeURIComponent(group_id)}`,
    },
  },
  HOUSEHOLDS: {
    CRUD: (household_slug: string) =>
      `/api/households/${encodeURIComponent(household_slug)}`,
    COOKBOOKS: {
      LIST: (household_slug: string) =>
        `/api/households/${encodeURIComponent(household_slug)}/cookbooks`,
      CRUD: (household_slug: string, cookbook_id: string) =>
        `/api/households/${encodeURIComponent(
          household_slug
        )}/cookbooks/${encodeURIComponent(cookbook_id)}`,
    },
  },
  PUBLIC_ROUTES: {
    APP: {
      ABOUT: "/api/app/about",
      STARTUP_INFO: "/api/app/about/startup-info",
      THEME: "/api/app/theme",
    },
    EXPLORE: {
      exploreGroupSlug: (groupSlug: string | number) =>
        `${exploreGroupSlug(groupSlug)}`,
      cookbooksGroupSlug: (groupSlug: string | number) =>
        `${exploreGroupSlug(groupSlug)}/cookbooks`,
      cookbooksGroupSlugCookbookId: (
        groupSlug: string | number,
        cookbookId: string | number
      ) =>
        `${exploreGroupSlug(groupSlug)}/cookbooks/${encodeURIComponent(
          cookbookId
        )}`,
      foodsGroupSlug: (groupSlug: string | number) =>
        `${exploreGroupSlug(groupSlug)}/foods`,
      foodsGroupSlugFoodId: (
        groupSlug: string | number,
        foodId: string | number
      ) => `${exploreGroupSlug(groupSlug)}/foods/${encodeURIComponent(foodId)}`,
      householdsGroupSlug: (groupSlug: string | number) =>
        `${exploreGroupSlug(groupSlug)}/households`,
      householdsGroupSlugHouseholdSlug: (
        groupSlug: string | number,
        householdSlug: string | number
      ) =>
        `${exploreGroupSlug(groupSlug)}/households/${encodeURIComponent(
          householdSlug
        )}`,
      categoriesGroupSlug: (groupSlug: string | number) =>
        `${exploreGroupSlug(groupSlug)}/organizers/categories`,
      categoriesGroupSlugCategoryId: (
        groupSlug: string | number,
        categoryId: string | number
      ) =>
        `${exploreGroupSlug(
          groupSlug
        )}/organizers/categories/${encodeURIComponent(categoryId)}`,
      tagsGroupSlug: (groupSlug: string | number) =>
        `${exploreGroupSlug(groupSlug)}/organizers/tags`,
      tagsGroupSlugTagId: (
        groupSlug: string | number,
        tagId: string | number
      ) =>
        `${exploreGroupSlug(groupSlug)}/organizers/tags/${encodeURIComponent(
          tagId
        )}`,
      toolsGroupSlug: (groupSlug: string | number) =>
        `${exploreGroupSlug(groupSlug)}/organizers/tools`,
      toolsGroupSlugToolId: (
        groupSlug: string | number,
        toolId: string | number
      ) =>
        `/explore/groups/${encodeURIComponent(
          groupSlug
        )}/organizers/tools/${encodeURIComponent(toolId)}`,
      recipesGroupSlug: (groupSlug: string | number) =>
        `${exploreGroupSlug(groupSlug)}/recipes`,
      recipesGroupSlugRecipeSlug: (
        groupSlug: string | number,
        recipeSlug: string | number
      ) =>
        `${exploreGroupSlug(groupSlug)}/recipes/${encodeURIComponent(
          recipeSlug
        )}`,
    },
    VALIDATORS: {
      group: (name: string) =>
        `/api/validators/group?name=${encodeURIComponent(name)}`,
      user: (name: string) =>
        `/api/validators/user/name?name=${encodeURIComponent(name)}`,
      email: (name: string) =>
        `/api/validators/user/email?email=${encodeURIComponent(name)}`,
      recipe: (groupId: string, name: string) =>
        `/api/validators/group/recipe?group_id=${encodeURIComponent(
          groupId
        )}&name=${encodeURIComponent(name)}`,
    },
    SHARED: {
      recipeShareToken: (token: string) =>
        `/api/recipes/shared/${encodeURIComponent(token)}`,
    },
  },
};
