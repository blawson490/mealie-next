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
import { IconChevronDown } from "@tabler/icons-react";

interface RecipeInteractionsProps {
  userId: string;
  recipeId: string;
  recipeSlug: string;
  initialIsFavorited: boolean;
  initialRating: number;
}

export default function RecipeInteractions({
  userId,
  recipeId,
  recipeSlug,
  initialIsFavorited,
  initialRating,
}: RecipeInteractionsProps) {
  // State
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [rating, setRating] = useState(initialRating);
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
        setIsFavorited(previousState); // Revert
        toast.error("Failed to update favorites");
      }
    });
  };

  // Handle Rate
  const handleRate = async (newRating: number) => {
    const previousRating = rating;
    setRating(newRating); // Optimistic
    toast.success(`You rated this ${newRating} stars!`);

    startTransition(async () => {
      const result = await rateRecipeAction(
        userId,
        recipeSlug,
        newRating,
        isFavorited
      );
      if (!result.success) {
        setRating(previousRating);
        toast.error("Failed to save rating");
      }
    });
  };

  const handleAddToMealPlan = () => {
    toast.promise(addToMealPlanAction(recipeId), {
      loading: "Adding...",
      success: "Added to meal plan!",
      error: "Error adding to meal plan",
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
        <Button onClick={handleAddToMealPlan} size={"lg"}>
          Start Cooking
        </Button>
        <Button variant="outline" size={"lg"}>
          Add to...
          <IconChevronDown className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
