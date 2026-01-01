"use server";

import { recipeApi } from "@/lib/api/recipe";
import { userApi } from "@/lib/api/user";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(
  userId: string,
  recipeId: string,
  recipeSlug: string,
  isCurrentlyFavorited: boolean
) {
  try {
    if (isCurrentlyFavorited) {
      await userApi.unfavoriteRecipe(userId, recipeId);
    } else {
      await userApi.favoriteRecipe(userId, recipeId);
    }
    revalidatePath(`/recipes/${recipeSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle favorite", error);
    return { success: false };
  }
}

export async function addToMealPlanAction(recipeId: string) {
  return { success: true };
}

export async function rateRecipeAction(
  userId: string,
  recipe_slug: string,
  rating: number,
  isFavorite: boolean
) {
  try {
    // Assuming your API has a method for this
    await userApi.setRecipeRating(userId, recipe_slug, rating, isFavorite);
    revalidatePath(`/recipes/${recipe_slug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to rate recipe", error);
    return { success: false };
  }
}

export async function getSharedRecipesAction(recipe_id: string) {
  try {
    // 1. Get the raw response
    const apiResponse = await recipeApi.getSharedLinks(recipe_id);
    const finalArray =
      "sharedRecipes" in apiResponse ? apiResponse.sharedRecipes : apiResponse;
    return {
      success: true,
      sharedRecipes: finalArray || [],
    };
  } catch (error) {
    console.error("Failed to get shared recipes", error);
    return {
      success: false,
      sharedRecipes: [],
    };
  }
}

export async function createSharedRecipeLinkAction(
  recipe_id: string,
  expirationDate?: number
) {
  try {
    const recipe = await recipeApi.createSharedLink(recipe_id, expirationDate);
    const sharedRecipes = await recipeApi.getSharedLinks(recipe_id);
    const finalArray =
      "sharedRecipes" in sharedRecipes
        ? sharedRecipes.sharedRecipes
        : sharedRecipes;
    return { success: true, sharedRecipes: finalArray || [] };
  } catch (error) {
    console.error("Failed to create shared recipe link", error);
    return { success: false };
  }
}

export async function deleteSharedRecipeLinkAction(
  share_id: string,
  recipe_id: string
) {
  try {
    await recipeApi.deleteSharedLink(share_id);
    const sharedRecipes = await recipeApi.getSharedLinks(recipe_id);
    const finalArray =
      "sharedRecipes" in sharedRecipes
        ? sharedRecipes.sharedRecipes
        : sharedRecipes;
    return { success: true, sharedRecipes: finalArray || [] };
  } catch (error) {
    console.error("Failed to delete shared recipe link", error);
    return { success: false };
  }
}

export async function updateRecipePrivacyAction(
  recipe_id: string,
  isPublic: boolean
) {
  try {
    await recipeApi.updateRecipePrivacy(recipe_id, isPublic);
    revalidatePath(`/recipes/${recipe_id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle recipe public status", error);
    return { success: false };
  }
}

export async function downloadRecipeAction(recipeSlug: string) {
  try {
    const zip = await recipeApi.exportRecipeAsZip(recipeSlug);
    return { success: true, recipe: zip };
  } catch (error) {
    console.error("Failed to download recipe", error);
    return { success: false };
  }
}

export async function getRecipeDownloadTokenAction(recipeSlug: string) {
  try {
    // Only fetch the token, don't download the zip here
    const tokenResponse = await recipeApi.getExportToken(recipeSlug);
    return { success: true, token: tokenResponse.token };
  } catch (error) {
    console.error("Failed to get download token", error);
    return { success: false };
  }
}
