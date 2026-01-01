import { UserOut, UserRatingSummary } from "../types/user/user";
import { apiRequest } from "./base/api-request-adapter";
import { BaseAPI } from "./base/base-api";
import { API_ROUTES } from "./routes";

/**
 * Authentication API class to handle auth-related requests
 */
export class UserAPI extends BaseAPI {
  constructor() {
    super(apiRequest);
  }

  /**
   * Fetches the current user's profile information
   * @returns a promise with UserOut data
   */
  async fetchSelf() {
    return await this.requests.get<UserOut>(API_ROUTES.USERS.CRUD.SELF);
  }

  /**
   * Fetches the current user's ratings summary
   * @returns a promise with UserRatingSummary data
   */
  async fetchSelfRatings() {
    return await this.requests.get<{ ratings: UserRatingSummary[] }>(
      API_ROUTES.USERS.CRUD.RATINGS
    );
  }

  /**
   * Makes a Post request to favorite a recipe
   * @param user_id The ID of the user
   * @param recipe_id The ID of the recipe to favorite
   * @returns null on success
   */
  async favoriteRecipe(user_id: string, recipe_id: string) {
    return await this.requests.post<void>(
      API_ROUTES.USERS.RATINGS.ADD_FAVORITE(user_id, recipe_id)
    );
  }

  /**
   * Makes a Delete request to unfavorite a recipe
   * @param user_id The ID of the user
   * @param recipe_id The ID of the recipe to unfavorite
   * @returns null on success
   */
  async unfavoriteRecipe(user_id: string, recipe_id: string) {
    return await this.requests.delete<void>(
      API_ROUTES.USERS.RATINGS.DELETE_FAVORITE(user_id, recipe_id)
    );
  }

  /**
   * Sets the rating for a specific recipe
   * @param user_id current logged in user ID
   * @param recipe_slug recipe slug
   * @param rating recipe rating value
   * @param isFavorite whether the recipe is favorited
   * @returns null on success
   */
  async setRecipeRating(
    user_id: string,
    recipe_slug: string,
    rating: number,
    isFavorite?: boolean
  ) {
    return await this.requests.post<void>(
      API_ROUTES.USERS.RATINGS.SET_RATING(user_id, recipe_slug),
      { rating: rating, isFavorite: isFavorite }
    );
  }
}

export const userApi = new UserAPI();
