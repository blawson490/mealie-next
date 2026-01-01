import {
  Recipe,
  RecipeShareTokenSummary,
  RecipeSuggestionResponse,
  RecipeSummary,
} from "../types/recipe";
import { apiRequest } from "./base/api-request-adapter";
import { BaseAPI } from "./base/base-api";
import { API_ROUTES } from "./routes";
import { PaginationData } from "./types";

/**
 * Authentication API class to handle auth-related requests
 */
export class RecipeAPI extends BaseAPI {
  constructor() {
    super(apiRequest);
  }

  async getRecipes() {
    return await this.requests.get<PaginationData<RecipeSummary>>(
      API_ROUTES.RECIPES.LIST
    );
  }

  async getRecipe(recipeSlug: string) {
    return await this.requests.get<Recipe>(API_ROUTES.RECIPES.CRUD(recipeSlug));
  }

  async getRecipeSuggestions() {
    return await this.requests.get<RecipeSuggestionResponse>(
      API_ROUTES.RECIPES.SUGGESTIONS
    );
  }

  // Shared Recipes
  async getSharedLinks(recipeId: string) {
    return await this.requests.get<{
      sharedRecipes: RecipeShareTokenSummary[];
    }>(API_ROUTES.SHARED.GET_SHARES_FOR_RECIPE(recipeId));
  }

  async createSharedLink(recipeId: string, expirationDate?: number) {
    return await this.requests.post<{
      recipe: RecipeSummary;
      expirationDate?: number;
    }>(API_ROUTES.SHARED.CREATE_SHARE_FOR_RECIPE, {
      recipeId: recipeId,
      expiresAt: expirationDate,
    });
  }

  async deleteSharedLink(shareId: string) {
    return await this.requests.delete<void>(
      API_ROUTES.SHARED.DELETE_SHARE(shareId)
    );
  }

  // Export Recipe as ZIP
  async getExportToken(recipeSlug: string) {
    return await this.requests.post<{ token: string }>(
      API_ROUTES.EXPORTS.ZIP_TOKEN(recipeSlug)
    );
  }

  async updateRecipePrivacy(recipeId: string, isPublic: boolean) {
    // Fetch Full Recipe Data
    const recipe = await this.getRecipe(recipeId);
    // Update the privacy setting
    recipe.settings = {
      ...recipe.settings,
      public: isPublic,
    };

    // call updateRecipe with modified data
    await this.updateRecipe(recipeId, recipe);
    return;
  }

  async updateRecipe(recipeSlug: string, data: Recipe) {
    return await this.requests.put<string>(
      API_ROUTES.RECIPES.CRUD(recipeSlug),
      data
    );
  }

  async getSharedRecipe(tokenId: string) {
    return await this.requests.get<Recipe>(
      API_ROUTES.SHARED.GET_SHARED_RECIPE(tokenId)
    );
  }

  async exportRecipeAsZip(recipeSlug: string) {
    // Step 1: Request a token for the export
    const tokenResponse = await this.requests.post<{
      token: string;
    }>(API_ROUTES.EXPORTS.ZIP_TOKEN(recipeSlug));

    const token = tokenResponse.token;

    // Step 2: Use the token to download the ZIP file
    const zipResponse = await this.requests.get<Blob>(
      API_ROUTES.EXPORTS.ZIP(recipeSlug, token),
      {
        responseType: "blob",
      }
    );

    return zipResponse;
  }
}

export const recipeApi = new RecipeAPI();
