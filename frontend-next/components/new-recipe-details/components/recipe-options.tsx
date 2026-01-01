"use client";
import {
  downloadRecipeAction,
  getRecipeDownloadTokenAction,
  toggleFavoriteAction,
} from "@/app/actions/recipe-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_ROUTES } from "@/lib/api/routes";
import {
  IconCalendarPlus,
  IconCopyPlus,
  IconDotsVertical,
  IconDownload,
  IconEdit,
  IconHeart,
  IconHeartFilled,
  IconPrinter,
  IconShare2,
  IconShare3,
  IconShoppingBagPlus,
  IconTimelineEventText,
  IconTrash,
} from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import RecipeShareDialog from "./recipe-share-dialog";

export default function RecipeOptions({
  userId,
  recipeId,
  recipeSlug,
  recipeName,
  initialIsFavorited,
  initialIsPublic,
}: {
  userId: string;
  recipeId: string;
  recipeSlug: string;
  recipeName: string;
  initialIsFavorited: boolean;
  initialIsPublic: boolean;
}) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, startTransition] = useTransition();

  // Handle Favorite
  const handleFavoriteClick = async () => {
    const previousState = isFavorited;
    setIsFavorited(!isFavorited); // Optimistic

    startTransition(async () => {
      const result = await toggleFavoriteAction(
        userId,
        recipeId,
        recipeSlug,
        previousState
      );
      if (!result.success) {
        setIsFavorited(previousState);
        toast.error("Failed to update favorites");
      }
    });
  };

  const handleDownloadClick = async () => {
    const toastId = toast.loading("Preparing download...");

    // 1. Get the token from the server
    const { success, token } = await getRecipeDownloadTokenAction(recipeSlug);

    if (success && token) {
      // 2. Construct the direct download URL
      // Ensure this URL is accessible from the client browser
      const downloadUrl = API_ROUTES.EXPORTS.ZIP(recipeSlug, token);

      // 3. Trigger the browser download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${recipeSlug}.zip`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      toast.dismiss(toastId);
      toast.success("Download started!");
    } else {
      toast.dismiss(toastId);
      toast.error("Failed to prepare download");
    }
  };

  return (
    <div className="flex flex-row gap-2">
      <Button
        variant={"outline"}
        size={"icon-lg"}
        className={"rounded-full"}
        onClick={handleFavoriteClick}
        disabled={isPending}
      >
        {isFavorited ? (
          <IconHeartFilled className="text-red-500" />
        ) : (
          <IconHeart className="" />
        )}
      </Button>
      {/* <Button variant="outline" size={"icon-lg"} className={"rounded-full"}>
        <IconShare2 className="" />
      </Button> */}
      <RecipeShareDialog
        recipeId={recipeId}
        recipeName={recipeName}
        recipeSlug={recipeSlug}
        initialIsPublic={initialIsPublic}
      />
      <Button variant="outline" size={"icon-lg"} className={"rounded-full"}>
        <IconTimelineEventText className="" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size={"icon-lg"}
              className={"rounded-full"}
            >
              <IconDotsVertical />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconEdit /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadClick}>
              <IconDownload /> Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconCopyPlus /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPrinter /> Print
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <IconTrash /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
