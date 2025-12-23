// hooks/use-group-users.ts
"use client";

import * as React from "react";
import { groupApi } from "@/lib/api/groups";
import type { UserSummary } from "@/lib/types/user/user";

export function useGroupUsers() {
  const [users, setUsers] = React.useState<UserSummary[]>([]);
  const [byId, setById] = React.useState<Record<string, UserSummary>>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupApi.fetchMembers(1, -1);
      const items = data.items ?? [];
      setUsers(items);
      const map: Record<string, UserSummary> = {};
      for (const u of items) map[u.id] = u;
      setById(map);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { users, byId, loading, error, refresh };
}
