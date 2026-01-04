"use client";

import { useState, useTransition } from "react";
import Rating from "./rating";
import {
  toggleFavoriteAction,
  rateRecipeAction,
  addToMealPlanAction,
} from "@/app/actions/recipe-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  IconCalendarPlus,
  IconChevronDown,
  IconCopyPlus,
  IconDownload,
  IconEdit,
  IconPrinter,
  IconShoppingBagPlus,
  IconTrash,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddToMealPlanDialog from "./add-to-mealplan-dialog";
import { ApiErrorSheet } from "@/components/api-error/api-error-sheet";

interface RecipeInteractionsProps {
  userId: string;
  recipeId: string;
  recipeName: string;
  recipeSlug: string;
  initialIsFavorited: boolean;
  initialRating: number;
}

export default function RecipeInteractions({
  userId,
  recipeId,
  recipeName,
  recipeSlug,
  initialIsFavorited,
  initialRating,
}: RecipeInteractionsProps) {
  // State
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [rating, setRating] = useState(initialRating);
  const [isPending, startTransition] = useTransition();
  const [isMealPlanDialogOpen, setIsMealPlanDialogOpen] = useState(false);
  const [isShoppingListDialogOpen, setIsShoppingListDialogOpen] =
    useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  // Handle Rate
  const handleRate = async (newRating: number) => {
    const previousRating = rating;
    setRating(newRating);

    startTransition(async () => {
      const result = await rateRecipeAction(userId, recipeSlug, {
        rating: newRating ?? null,
        isFavorite: isFavorited,
      });
      if (!result.success) {
        setRating(previousRating);
        toast.error("Failed to save rating", {
          action: {
            label: "See More",
            onClick: () => setErrorDetails(result.error),
          },
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Interactive Rating Component */}
      <Rating
        rating={rating}
        size={24}
        onRate={handleRate}
        className="mb-0" // Controlled by parent gap
      />

      {/* 2. Action Buttons */}
      <div className="flex flex-row gap-2 flex-wrap">
        <Button size={"lg"}>Start Cooking</Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size={"lg"}>
                Add to...
                <IconChevronDown className="ml-1" />
              </Button>
            }
          />
          <DropdownMenuContent className={"w-40 whitespace-nowrap"}>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setIsMealPlanDialogOpen(true);
                }}
              >
                <IconCalendarPlus /> Add to Meal Plan
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconShoppingBagPlus /> Add to Shopping List
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <AddToMealPlanDialog
          recipeId={recipeId}
          recipeName={recipeName}
          isOpen={isMealPlanDialogOpen}
          onOpenChange={setIsMealPlanDialogOpen}
        />

        <ApiErrorSheet
          open={!!errorDetails}
          onOpenChange={(open) => !open && setErrorDetails(null)}
          error={errorDetails}
        />
      </div>
    </div>
  );
}
