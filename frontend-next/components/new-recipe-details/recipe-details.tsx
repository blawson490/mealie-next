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

function formatIngredient(ingredient: RecipeIngredient): string {
  if (ingredient.display) return ingredient.display;

  const quantity = ingredient.quantity;
  const unitName =
    ingredient.unit && "name" in ingredient.unit ? ingredient.unit.name : "";
  const foodName =
    ingredient.food && "name" in ingredient.food ? ingredient.food.name : "";
  const note = ingredient.note ? ` (${ingredient.note})` : "";

  const parts = [quantity, unitName, foodName]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .map((value) => (typeof value === "number" ? value.toString() : value))
    .join(" ");
  return parts ? `${parts}${note}` : "Unnamed ingredient";
}

function formatStep(step: RecipeStep): string {
  if (step.summary) return step.summary;
  return step.text;
}

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
            instructionCount={instructions.length}
            ingredientCount={ingredients.length}
            calories={nutrition?.calories || undefined}
          />

          <div className="space-y-6">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <section className="lg:col-span-5 space-y-4 lg:sticky lg:top-18">
                <div className="rounded-2xl border border-amber-100 bg-white/90 shadow-sm backdrop-blur">
                  <div className="flex items-center justify-between border-b border-amber-100 px-5 py-4">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                      <IconListCheck size={18} />
                      <span>Ingredients</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {ingredients.length} items
                    </span>
                  </div>

                  {ingredients.length ? (
                    <ul className="divide-y divide-amber-50">
                      {ingredients.map((ingredient, index) => (
                        <li
                          key={`ingredient-${index}`}
                          className="flex gap-3 px-5 py-3"
                        >
                          <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                            {index + 1}
                          </span>
                          <div className="flex-1 text-sm text-slate-800">
                            {formatIngredient(ingredient)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-5 py-6 text-sm text-slate-500">
                      Add your ingredients to see a beautifully formatted list.
                    </div>
                  )}
                </div>
              </section>

              <section className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                      <IconNotes size={18} />
                      <span>Instructions</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <IconClock size={14} />
                      <span>
                        {recipe.totalTime || recipe.cookTime || "Flexible"}
                      </span>
                    </div>
                  </div>

                  {instructions.length ? (
                    <ol className="space-y-3 px-5 py-5">
                      {instructions.map((step, index) => (
                        <li
                          key={`step-${index}`}
                          className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                        >
                          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <div className="flex-1 space-y-1">
                            {step.title && (
                              <p className="text-sm font-semibold text-slate-900">
                                {step.title}
                              </p>
                            )}
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {formatStep(step)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="px-5 py-6 text-sm text-slate-500">
                      Start writing the steps to guide cooks through this
                      recipe.
                    </div>
                  )}
                </div>
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
