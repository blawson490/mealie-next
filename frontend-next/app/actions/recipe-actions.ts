"use server";

import { ApiError } from "@/lib/api/api-error-type";
import { createOneApiHouseholdsMealplansPost } from "@/lib/api/generated/households-mealplans/households-mealplans";
import {
  CreatePlanEntry,
  GetRecipeAsZipApiRecipesSlugExportsZipGetParams,
  RecipeInput,
  RecipeShareTokenCreate,
  UserRatingUpdate,
} from "@/lib/api/generated/model";
import {
  getOneApiRecipesSlugGet,
  updateOneApiRecipesSlugPut,
} from "@/lib/api/generated/recipe-crud/recipe-crud";
import {
  getRecipeAsZipApiRecipesSlugExportsZipGet,
  getRecipeZipTokenApiRecipesSlugExportsPost,
} from "@/lib/api/generated/recipe-exports/recipe-exports";
import { getSharedRecipeApiRecipesSharedTokenIdGet } from "@/lib/api/generated/recipe-shared/recipe-shared";
import {
  createOneApiSharedRecipesPost,
  deleteOneApiSharedRecipesItemIdDelete,
  getAllApiSharedRecipesGet,
} from "@/lib/api/generated/shared-recipes/shared-recipes";
import {
  addFavoriteApiUsersIdFavoritesSlugPost,
  removeFavoriteApiUsersIdFavoritesSlugDelete,
  setRatingApiUsersIdRatingsSlugPost,
} from "@/lib/api/generated/users-ratings/users-ratings";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(
  userId: string,
  recipeId: string,
  recipeSlug: string,
  isCurrentlyFavorited: boolean
) {
  try {
    if (isCurrentlyFavorited) {
      await removeFavoriteApiUsersIdFavoritesSlugDelete(userId, recipeId);
    } else {
      await addFavoriteApiUsersIdFavoritesSlugPost(userId, recipeId);
    }
    revalidatePath(`/recipes/${recipeSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle favorite", error);
    return { success: false };
  }
}

export async function rateRecipeAction(
  userId: string,
  recipe_slug: string,
  rating: UserRatingUpdate
) {
  try {
    await setRatingApiUsersIdRatingsSlugPost(userId, recipe_slug, rating);
    revalidatePath(`/recipes/${recipe_slug}`);
    return { success: true };
  } catch (error) {
    let errorData = null;
    if (error instanceof ApiError) {
      errorData = {
        message: error.message,
        status: error.status,
        details: error.details,
        debug: error.debug,
      };
      console.error("API Error:", JSON.stringify(errorData, null, 2));
    } else {
      console.error("Unknown Error:", error);
      errorData = { message: "An unexpected error occurred" };
    }
    return { success: false, error: errorData };
  }
}

export async function getSharedRecipesAction(recipe_id: string) {
  try {
    // 1. Get the raw response
    const sharedRecipes = await getAllApiSharedRecipesGet({
      recipe_id,
    });
    return {
      success: true,
      sharedRecipes,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Error:", JSON.stringify(error.details, null, 2));
    } else {
      console.error("Failed to fetch shared recipes", error);
    }
    return {
      success: false,
      sharedRecipes: [],
    };
  }
}

export async function createSharedRecipeLinkAction(
  recipeShareTokenCreate: RecipeShareTokenCreate
) {
  try {
    console.log("Creating shared recipe link", recipeShareTokenCreate);
    await createOneApiSharedRecipesPost(recipeShareTokenCreate);
    const sharedRecipes = await getAllApiSharedRecipesGet({
      recipe_id: recipeShareTokenCreate.recipeId,
    });
    return { success: true, sharedRecipes };
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Error:", JSON.stringify(error.details, null, 2));
    } else {
      console.error("Failed to fetch shared recipes", error);
    }
    return { success: false };
  }
}

export async function deleteSharedRecipeLinkAction(
  share_id: string,
  recipe_id: string
) {
  try {
    await deleteOneApiSharedRecipesItemIdDelete(share_id);
    const sharedRecipes = await getAllApiSharedRecipesGet({ recipe_id });
    return { success: true, sharedRecipes };
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Error:", JSON.stringify(error.details, null, 2));
    } else {
      console.error("Failed to fetch shared recipes", error);
    }
    return { success: false };
  }
}

export async function updateRecipePrivacyAction(
  recipe_slug: string,
  isPublic: boolean
) {
  try {
    // fetch the full recipe, update privacy, then save
    const recipe = await getOneApiRecipesSlugGet(recipe_slug);
    recipe.settings = {
      ...recipe.settings,
      public: isPublic,
    };

    await updateOneApiRecipesSlugPut(recipe_slug, recipe as RecipeInput);
    revalidatePath(`/recipes/${recipe_slug}`);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Error:", JSON.stringify(error.details, null, 2));
    } else {
      console.error("Failed to fetch shared recipes", error);
    }
    return { success: false };
  }
}

export async function addToMealPlanAction(mealPlanEntry: CreatePlanEntry) {
  try {
    await createOneApiHouseholdsMealplansPost(mealPlanEntry);
    return { success: true };
  } catch (error) {
    let errorData = null;
    if (error instanceof ApiError) {
      errorData = {
        message: error.message,
        status: error.status,
        details: error.details,
        debug: error.debug,
      };
      console.error("API Error:", JSON.stringify(errorData, null, 2));
    } else {
      console.error("Unknown Error:", error);
      errorData = { message: "An unexpected error occurred" };
    }
    return { success: false, error: errorData };
  }
}

export async function downloadRecipeAction(
  slug: string,
  params: GetRecipeAsZipApiRecipesSlugExportsZipGetParams
) {
  try {
    const zip = await getRecipeAsZipApiRecipesSlugExportsZipGet(slug, params);
    return { success: true, recipe: zip };
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Error:", JSON.stringify(error.details, null, 2));
    } else {
      console.error("Failed to fetch shared recipes", error);
    }
    return { success: false };
  }
}

export async function getRecipeDownloadTokenAction(recipeSlug: string) {
  try {
    const tokenResponse = await getRecipeZipTokenApiRecipesSlugExportsPost(
      recipeSlug
    );
    return { success: true, token: tokenResponse.token };
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Error:", JSON.stringify(error.details, null, 2));
    } else {
      console.error("Failed to fetch shared recipes", error);
    }
    return { success: false };
  }
}
