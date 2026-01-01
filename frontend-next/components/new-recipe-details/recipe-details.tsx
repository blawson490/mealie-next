import { Recipe, RecipeIngredient, RecipeStep } from "@/lib/types/recipe";
import {
  IconClock,
  IconInfoCircle,
  IconListCheck,
  IconNotes,
} from "@tabler/icons-react";
import RecipeHeader from "./recipe-header";
import RecipeLastMade from "./recipe-last-made";
import RecipeNutrition from "./recipe-nutrition";
import RecipeComments from "./recipe-comments";
import ChefsNotes from "./recipe-notes";
import RecipeInstructions from "./recipe-instructions";
import RecipeIngredients from "./recipe-ingredients";

export default function RecipeDetails(recipe: Recipe) {
  const ingredients = recipe.recipeIngredient ?? [];
  const instructions = recipe.recipeInstructions ?? [];
  const nutrition = recipe.nutrition ?? undefined;

  return (
    <div className="relative flex mx-auto w-full flex-col gap-4 px-4 py-8 lg:px-0 mx-auto max-w-[1440px]">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <RecipeHeader
            name={recipe.name || ""}
            id={recipe.id || ""}
            slug={recipe.slug || ""}
            image_version={"1"}
            image_key={recipe.image || ""}
            orgURL={recipe.orgURL || ""}
            rating={recipe.rating || 0}
            categories={recipe.recipeCategory || undefined}
            description={recipe.description || ""}
            cookTime={recipe.cookTime || recipe.performTime || undefined}
            prepTime={recipe.prepTime || undefined}
            instructionCount={instructions.length}
            ingredientCount={ingredients.length}
            initialIsPublic={recipe.settings?.public || false}
          />

          <div className="space-y-6">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <section className="lg:col-span-5 space-y-4 lg:sticky lg:top-18">
                <RecipeIngredients
                  ingredients={ingredients}
                  yields={recipe.recipeServings}
                />
              </section>

              <section className="lg:col-span-7 space-y-4">
                <RecipeInstructions
                  instructions={recipe.recipeInstructions || []}
                  ingredients={recipe.recipeIngredient || []}
                  totalTime={recipe.totalTime || undefined}
                  cookTime={recipe.cookTime || recipe.performTime || undefined}
                />
              </section>
            </div>

            <RecipeComments comments={recipe.comments || []} />
          </div>
        </div>

        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-18 self-start">
          <RecipeLastMade lastMade={recipe.lastMade || undefined} />
          <RecipeNutrition nutrition={nutrition} />
          <ChefsNotes notes={recipe.notes || []} />
        </aside>
      </div>
    </div>
  );
}
