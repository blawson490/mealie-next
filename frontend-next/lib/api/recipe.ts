import { RecipeSuggestionResponse, RecipeSummary } from "../types/recipe";
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

  async getRecipeSuggestions() {
    return await this.requests.get<RecipeSuggestionResponse>(
      API_ROUTES.RECIPES.SUGGESTIONS
    );
  }

  getRecipeImageUrl(recipeId: string, imageName: string) {
    return `/api/media/${encodeURIComponent(
      recipeId
    )}/images/${encodeURIComponent(imageName)}`;
  }
}

export const recipeApi = new RecipeAPI();
