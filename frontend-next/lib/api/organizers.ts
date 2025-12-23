import {
  IngredientFood,
  RecipeCategoryResponse,
  RecipeIngredient,
  RecipeSuggestionResponse,
  RecipeSummary,
  RecipeTagResponse,
  RecipeToolResponse,
} from "../types/recipe";
import { apiRequest } from "./base/api-request-adapter";
import { BaseAPI } from "./base/base-api";
import { API_ROUTES } from "./routes";
import { PaginationData } from "./types";

/**
 * Authentication API class to handle auth-related requests
 */
export class OrganizersAPI extends BaseAPI {
  constructor() {
    super(apiRequest);
  }

  async getCategories() {
    const categories = await this.requests.get<
      PaginationData<RecipeCategoryResponse>
    >(API_ROUTES.ORGANIZERS.CATEGORIES.LIST);
    return categories.items;
  }

  async getTags() {
    const tags = await this.requests.get<PaginationData<RecipeTagResponse>>(
      API_ROUTES.ORGANIZERS.TAGS.LIST
    );
    return tags.items;
  }

  async getTools() {
    const tools = await this.requests.get<PaginationData<RecipeToolResponse>>(
      API_ROUTES.ORGANIZERS.TOOLS.LIST
    );
    return tools.items;
  }

  async getFoods() {
    const foods = await this.requests.get<PaginationData<IngredientFood>>(
      API_ROUTES.ORGANIZERS.FOODS.LIST
    );
    return foods.items;
  }
}

export const organizersApi = new OrganizersAPI();
