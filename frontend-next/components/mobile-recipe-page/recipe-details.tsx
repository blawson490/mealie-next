"use client";
import { Recipe } from "@/lib/types/recipe";
import { RecipeImageHeader } from "./recipe-image-header";
import { useEffect, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconMenu,
  IconShare,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import RecipeOverviewChip from "./recipe-overview";
import RecipeIngredients from "./recipe-ingredients";
import RecipeInstructions from "./recipe-instructions";

export default function RecipeDetails(recipe: Recipe) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartCooking = () => console.log("Cooking started!");
  const handleAddToPlan = () => console.log("Added to plan!");

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col max-w-7xl mx-auto">
      <nav
        className={`fixed top-0 inset-x-0 z-50 p-4 transition-all duration-300 flex justify-between items-center ${
          scrollY > 100
            ? "bg-neutral-950/80 backdrop-blur-lg shadow py-3"
            : "bg-transparent"
        }`}
      >
        <button
          className="p-2 rounded-full bg-black/40 backdrop-blur-md shadow border border-white/40"
          onClick={goBack}
        >
          <IconChevronLeft size={20} className="text-white" />
        </button>
        <div
          className={`font-bold transition-opacity duration-300 truncate max-w-2xs text-white ${
            scrollY > 200 ? "opacity-100" : "opacity-0"
          }`}
        >
          {recipe.name}
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-black/40 backdrop-blur-md shadow border border-white/40">
            <IconMenu size={18} className="text-white" />
          </button>
        </div>
      </nav>
      <RecipeImageHeader
        id={recipe.id || ""}
        title={recipe.name || ""}
        version={recipe.image || ""}
        orgURL={recipe.orgURL || ""}
        scrollY={scrollY}
        onScrollY={setScrollY}
        onCookingMode={handleStartCooking}
        onAddToMealPlan={handleAddToPlan}
      />

      <div className="bg-muted">
        <div className="bg-background w-full flex flex-row gap-2 justify-between px-4">
          <RecipeOverviewChip label={"Time"} value={recipe.totalTime || "0"} />
          <RecipeOverviewChip
            label={"Ingredients"}
            value={recipe.recipeIngredient?.length || "0"}
          />

          <RecipeOverviewChip
            label={"Steps"}
            value={recipe.recipeInstructions?.length || "0"}
          />

          <RecipeOverviewChip
            label={"Servings"}
            value={recipe.recipeServings || "0"}
          />
        </div>
        <div className="bg-yellow-400 w-full px-4 py-2 flex flex-row gap-1 items-center justify-between">
          <div className="flex flex-row items-center text-xs font-semibold uppercase tracking-wide text-black/50 gap-2">
            Rating
          </div>
          {/* Placeholder for future rating system */}
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconStar key={star} size={14} className="text-black/50" />
              ))}
            </div>
            <p className="text-xs text-black/60">Not rated</p>
          </div>
        </div>
      </div>
      <div className="bg-muted">
        <div className="px-4 py-6 flex flex-col gap-6">
          <RecipeIngredients
            ingredients={recipe.recipeIngredient || []}
            baseServings={recipe.recipeServings || 1}
          />
          <RecipeInstructions
            instructions={recipe.recipeInstructions || []}
            ingredients={recipe.recipeIngredient || []}
          />
        </div>
      </div>
    </div>
  );
}
