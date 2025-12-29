import { apiRequest } from "./base/api-request-adapter";
import { BaseAPI } from "./base/base-api";
import { API_ROUTES } from "./routes";

/**
 * Media API class to handle media-related requests and URL generation
 */
export class MediaAPI extends BaseAPI {
  constructor() {
    super(apiRequest);
  }

  /**
   * Get the URL for a recipe image
   * @param recipeId The ID of the recipe
   * @param version The version of the image
   * @param key A random key to prevent caching
   * @returns The URL for the recipe image
   */
  getRecipeImage(
    recipeId: string,
    version: string = "",
    key: string | number = 1
  ) {
    return API_ROUTES.MEDIA.RECIPES.IMAGE(recipeId, version, key);
  }

  /**
   * Fetch the recipe image as a Blob
   * @param recipeId The ID of the recipe
   * @param version The version of the image
   * @param key A random key to prevent caching
   * @returns A promise that resolves to the image Blob
   */
  async getRecipeImageBlob(
    recipeId: string,
    version: string = "",
    key: string | number = 1
  ) {
    return await this.requests.get<Blob>(
      this.getRecipeImage(recipeId, version, key),
      { responseType: "blob" }
    );
  }

  /**
   * Get the URL for a small recipe image
   * @param recipeId The ID of the recipe
   * @param version The version of the image
   * @param key A random key to prevent caching
   * @returns The URL for the small recipe image
   */
  getRecipeSmallImage(
    recipeId: string,
    version: string = "",
    key: string | number = 1
  ) {
    return API_ROUTES.MEDIA.RECIPES.SMALL_IMAGE(recipeId, version, key);
  }

  /**
   * Fetch the small recipe image as a Blob
   * @param recipeId The ID of the recipe
   * @param version The version of the image
   * @param key A random key to prevent caching
   * @returns A promise that resolves to the image Blob
   */
  async getRecipeSmallImageBlob(
    recipeId: string,
    version: string = "",
    key: string | number = 1
  ) {
    return await this.requests.get<Blob>(
      this.getRecipeSmallImage(recipeId, version, key),
      { responseType: "blob" }
    );
  }

  /**
   * Get the URL for a tiny recipe image
   * @param recipeId The ID of the recipe
   * @param version The version of the image
   * @param key A random key to prevent caching
   * @returns The URL for the tiny recipe image
   */
  getRecipeTinyImage(
    recipeId: string,
    version: string = "",
    key: string | number = 1
  ) {
    return API_ROUTES.MEDIA.RECIPES.TINY_IMAGE(recipeId, version, key);
  }

  /**
   * Fetch the tiny recipe image as a Blob
   * @param recipeId The ID of the recipe
   * @param version The version of the image
   * @param key A random key to prevent caching
   * @returns A promise that resolves to the image Blob
   */
  async getRecipeTinyImageBlob(
    recipeId: string,
    version: string = "",
    key: string | number = 1
  ) {
    return await this.requests.get<Blob>(
      this.getRecipeTinyImage(recipeId, version, key),
      { responseType: "blob" }
    );
  }

  /**
   * Get the URL for a recipe timeline event image
   * @param recipeId The ID of the recipe
   * @param timelineEventId The ID of the timeline event
   * @returns The URL for the timeline event image
   */
  getRecipeTimelineEventImage(recipeId: string, timelineEventId: string) {
    return API_ROUTES.MEDIA.RECIPES.TIMELINE_EVENT(recipeId, timelineEventId);
  }

  /**
   * Fetch the recipe timeline event image as a Blob
   * @param recipeId The ID of the recipe
   * @param timelineEventId The ID of the timeline event
   * @returns A promise that resolves to the image Blob
   */
  async getRecipeTimelineEventImageBlob(
    recipeId: string,
    timelineEventId: string
  ) {
    return await this.requests.get<Blob>(
      this.getRecipeTimelineEventImage(recipeId, timelineEventId),
      { responseType: "blob" }
    );
  }

  /**
   * Get the URL for a small recipe timeline event image
   * @param recipeId The ID of the recipe
   * @param timelineEventId The ID of the timeline event
   * @returns The URL for the small timeline event image
   */
  getRecipeTimelineEventSmallImage(recipeId: string, timelineEventId: string) {
    return API_ROUTES.MEDIA.RECIPES.TIMELINE_EVENT_SMALL(
      recipeId,
      timelineEventId
    );
  }

  /**
   * Fetch the small recipe timeline event image as a Blob
   * @param recipeId The ID of the recipe
   * @param timelineEventId The ID of the timeline event
   * @returns A promise that resolves to the image Blob
   */
  async getRecipeTimelineEventSmallImageBlob(
    recipeId: string,
    timelineEventId: string
  ) {
    return await this.requests.get<Blob>(
      this.getRecipeTimelineEventSmallImage(recipeId, timelineEventId),
      { responseType: "blob" }
    );
  }

  /**
   * Get the URL for a tiny recipe timeline event image
   * @param recipeId The ID of the recipe
   * @param timelineEventId The ID of the timeline event
   * @returns The URL for the tiny timeline event image
   */
  getRecipeTimelineEventTinyImage(recipeId: string, timelineEventId: string) {
    return API_ROUTES.MEDIA.RECIPES.TIMELINE_EVENT_TINY(
      recipeId,
      timelineEventId
    );
  }

  /**
   * Fetch the tiny recipe timeline event image as a Blob
   * @param recipeId The ID of the recipe
   * @param timelineEventId The ID of the timeline event
   * @returns A promise that resolves to the image Blob
   */
  async getRecipeTimelineEventTinyImageBlob(
    recipeId: string,
    timelineEventId: string
  ) {
    return await this.requests.get<Blob>(
      this.getRecipeTimelineEventTinyImage(recipeId, timelineEventId),
      { responseType: "blob" }
    );
  }

  /**
   * Get the path for a recipe asset
   * @param recipeId The ID of the recipe
   * @param assetName The name of the asset
   * @returns The path for the recipe asset
   */
  getRecipeAssetPath(recipeId: string, assetName: string) {
    return API_ROUTES.MEDIA.RECIPES.ASSET(recipeId, assetName);
  }

  /**
   * Fetch a recipe asset as a Blob
   * @param recipeId The ID of the recipe
   * @param assetName The name of the asset
   * @returns A promise that resolves to the asset Blob
   */
  async getRecipeAssetBlob(recipeId: string, assetName: string) {
    return await this.requests.get<Blob>(
      this.getRecipeAssetPath(recipeId, assetName),
      { responseType: "blob" }
    );
  }
}

export const mediaApi = new MediaAPI();
