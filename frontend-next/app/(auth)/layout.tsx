import { IconToolsKitchen2 } from "@tabler/icons-react";

/**
 * Layout component that centers authentication pages and displays the Mealie logo above its content.
 *
 * @param children - React nodes to render inside the centered authentication container
 * @returns The auth page layout element containing the Mealie logo and the provided children
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-900">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <div className="flex justify-center mb-8">
          {/* Logo */}
          <div className="flex flex-row items-center gap-2">
            <div className="rounded-full bg-primary p-2">
              <IconToolsKitchen2
                className="icon-white"
                style={{ width: "30px", height: "30px" }}
                aria-label="Mealie logo"
              />
            </div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
              Mealie{" "}
              <span className="text-primary font-light underline decoration-primary-200 underline-offset-2">
                Redesign
              </span>
            </h1>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
