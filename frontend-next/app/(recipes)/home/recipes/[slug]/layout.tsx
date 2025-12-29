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
      <header className="fixed top-0 left-0 right-0 z-50 h-[4rem] bg-sidebar shadow flex justify-between items-center gap-2 border-b px-4">
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
      </header>
      <AppSidebar
        variant="inset"
        className="!top-[4rem] !h-[calc(100svh-4rem)]"
      />
      <SidebarInset className="pt-[3rem] mx-auto">{children}</SidebarInset>
    </SidebarProvider>
  );
}
