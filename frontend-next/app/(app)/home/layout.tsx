import { AppSidebar } from "@/components/app-sidebar";
import { LogoutButton } from "@/components/ui/logout-button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IconToolsKitchen2 } from "@tabler/icons-react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-col w-full min-h-screen">
        <header className="sticky top-0 z-90 bg-sidebar flex h-16 shrink-0 shadow justify-between items-center gap-2 border-b px-4">
          <div className="flex flex-row items-center gap-2 h-16">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-6 data-[orientation=vertical]:self-center"
            />
            <a href="#" className="flex flex-row items-center gap-2">
              <IconToolsKitchen2 className="!size-5" />
              <h1 className="text-lg font-black tracking-tight flex items-center gap-1">
                Mealie{" "}
                <span className="text-primary font-light underline decoration-primary-200 underline-offset-2">
                  Redesign
                </span>
              </h1>
            </a>
          </div>
          <LogoutButton />
          {/* Logo */}
        </header>
        <div className="flex flex-1">
          <AppSidebar
            variant="inset"
            className="!top-16 !h-[calc(100svh-4rem)]"
          />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
