import RecipeCard from "@/components/recipe-card";
import SearchLayout from "@/components/search-layout";
import { getAllApiOrganizersCategoriesGet } from "@/lib/api/generated/organizer-categories/organizer-categories";
import { getAllApiOrganizersTagsGet } from "@/lib/api/generated/organizer-tags/organizer-tags";
import { getAllApiOrganizersToolsGet } from "@/lib/api/generated/organizer-tools/organizer-tools";
import { getAllApiRecipesGet } from "@/lib/api/generated/recipe-crud/recipe-crud";
import { getAllApiFoodsGet } from "@/lib/api/generated/recipes-foods/recipes-foods";
import { RecipeSummary } from "@/lib/types/recipe";

export default async function Page() {
  const recipesResponse = await getAllApiRecipesGet();
  const recipes = recipesResponse.items as RecipeSummary[];

  const categories = await getAllApiOrganizersCategoriesGet();
  const tags = await getAllApiOrganizersTagsGet();
  const tools = await getAllApiOrganizersToolsGet();
  const foods = await getAllApiFoodsGet();

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      <SearchLayout
        categories={categories.items}
        tags={tags.items}
        tools={tools.items}
        foods={foods.items}
      >
        {/* <div className="pb-6 border-b border-b-1">
          <RecipeSearch />
        </div> */}
        <div>
          <h1 className="text-2xl font-bold">Recipes</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </SearchLayout>
    </div>
  );
}
