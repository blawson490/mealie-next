"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconToolsKitchen2,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconCalendar,
  IconCalendarBolt,
  IconTimelineEvent,
  IconTimelineEventFilled,
  IconTimelineEventText,
  IconBook,
  IconBook2,
  IconCategory,
  IconHome,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/routes";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: ROUTES.APP.HOME.ROOT,
      icon: IconHome,
    },
    {
      title: "Recipes",
      url: ROUTES.APP.HOME.RECIPES.ROOT,
      icon: IconToolsKitchen2,
    },
    {
      title: "Recipe Finder",
      url: ROUTES.APP.HOME.RECIPES.FINDER,
      icon: IconSearch,
    },
    {
      title: "Meal Planner",
      url: ROUTES.APP.HOUSEHOLD.MEALPLAN.PLANNER,
      icon: IconCalendarBolt,
    },
    {
      title: "Shopping Lists",
      url: ROUTES.APP.HOUSEHOLD.SHOPPING_LISTS,
      icon: IconListDetails,
    },
    {
      title: "Timeline",
      url: ROUTES.APP.HOME.RECIPES.TIMELINE,
      icon: IconTimelineEventText,
    },
    {
      title: "Cookbooks",
      url: ROUTES.APP.HOUSEHOLD.COOKBOOKS.LIST,
      icon: IconBook2,
    },
    {
      title: "Organizers",
      url: "#",
      icon: IconCategory,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent className="mt-18 md:mt-0">
        {/* Main Navigation */}
        <NavMain items={data.navMain} />
        {/* Cookbooks */}
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser size={"sm"} tooltip={false} />
      </SidebarFooter>
    </Sidebar>
  );
}
