// lib/api/groups.ts
import { BaseAPI } from "./base/base-api";
import { apiRequest } from "./base/api-request-adapter";
import { API_ROUTES } from "./routes";
import type {
  GroupSummary,
  ReadGroupPreferences,
  UserSummary,
} from "@/lib/types/user/user";
import type { PaginationData } from "./types";

export class GroupAPI extends BaseAPI {
  constructor() {
    super(apiRequest);
  }

  async getCurrentUserGroup() {
    return await this.requests.get<GroupSummary>(API_ROUTES.GROUPS.SELF);
  }

  async getPreferences() {
    return await this.requests.get<ReadGroupPreferences>(
      API_ROUTES.GROUPS.PREFERENCES
    );
  }

  async fetchMembers(
    page = 1,
    perPage = -1,
    params: Record<string, string | number> = {}
  ) {
    // Returns a paginated list of UserSummary
    return await this.requests.get<PaginationData<UserSummary>>(
      API_ROUTES.GROUPS.MEMBERS,
      { method: "GET" }
    );
  }

  async storage() {
    return await this.requests.get(API_ROUTES.GROUPS.STORAGE);
  }
}

export const groupApi = new GroupAPI();
