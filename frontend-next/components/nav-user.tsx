"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth/auth-context";

interface NavUserProps {
  size: "sm" | "md" | "lg";
  tooltip: boolean;
}

// TODO: Nav-User will always be current user,
// Avatar component should handle other user avatars

export function NavUser({
  size: _size = "md",
  tooltip: _tooltip = true,
}: NavUserProps) {
  const { isMobile } = useSidebar();
  const auth = useAuth();

  const displayName = auth.user?.fullName || auth.user?.username || "";
  const email = auth.user?.email || "";
  const avatarUrl = auth.user
    ? `/api/media/users/${auth.user.id}/profile.webp?cacheKey=${auth.user.cacheKey}`
    : undefined;
  const avatarFallback = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : "?";
  const isLoading = auth.status === "loading";

  const handleLogout = () => auth.signOut("/login");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            {!isLoading && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="rounded-lg">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {isLoading ? "Loading..." : displayName || "Unknown user"}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              {isLoading ? "" : email || "No email"}
            </span>
          </div>
        </SidebarMenuButton>
        <DropdownMenu>
          <SidebarMenuAction
            showOnHover
            render={(props) => (
              <DropdownMenuTrigger {...props}>
                <IconDotsVertical />
                <span className="sr-only">Open Menu</span>
              </DropdownMenuTrigger>
            )}
          />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    {!isLoading && (
                      <AvatarImage src={avatarUrl} alt={displayName} />
                    )}
                    <AvatarFallback className="rounded-lg">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {isLoading ? "Loading..." : displayName || "Unknown user"}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {isLoading ? "" : email || "No email"}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
