import { mediaApi } from "@/lib/api/media";
import { Recipe, RecipeCategory, RecipeIngredient } from "@/lib/types/recipe";
import {
  IconCalendar,
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconFlame,
  IconHeart,
  IconStar,
  IconStarFilled,
  IconTimelineEventText,
  IconToolsKitchen,
} from "@tabler/icons-react";
import Image from "next/image";
import RecipeIngredients from "../recipe-page/recipe-ingredients";
import RecipeHeader from "./recipe-header";
import RecipeInstructions from "./recipe-instructions";

export default function RecipeDetails(recipe: Recipe) {
  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto bg-card rounded-lg border shadow print:border-0 print:shadow-none print:bg-white print:p-0 print:rounded-none">
      <RecipeHeader
        name={recipe.name || ""}
        id={recipe.id || ""}
        image_version={"1"}
        image_key={recipe.image || ""}
        orgURL={recipe.orgURL || ""}
        rating={recipe.rating || 0}
        categories={recipe.recipeCategory || undefined}
        description={recipe.description || ""}
        cookTime={recipe.cookTime || recipe.performTime || undefined}
        prepTime={recipe.prepTime || undefined}
        totalTime={recipe.totalTime || undefined}
        servings={recipe.recipeServings}
        instructionCount={recipe.recipeInstructions?.length || 0}
        ingredientCount={recipe.recipeIngredient?.length || 0}
        calories={recipe.nutrition?.calories || undefined}
        lastMade={recipe.lastMade || undefined}
      />
      {/* This should be 1/3 and 2/3 columns with flex wrap */}
      <div className="md:flex w-full px-4 pb-16 gap-6">
        <RecipeIngredients
          ingredients={recipe.recipeIngredient || []}
          baseScale={recipe.recipeServings || 1}
        />
        <div className="md:w-2/3 flex flex-col gap-4 rounded">
          <RecipeInstructions
            instructions={recipe.recipeInstructions || []}
            ingredients={recipe.recipeIngredient || []}
          />
        </div>
      </div>
    </div>
  );
}
