import RecipeCard from "@/components/recipe-card";
import SearchLayout from "@/components/search-layout";
import { recipeApi } from "@/lib/api/recipe";
import { organizersApi } from "@/lib/api/organizers";
import { RecipeSummary } from "@/lib/types/recipe";

export default async function Page() {
  const recipesResponse = await recipeApi.getRecipes();
  const recipes = recipesResponse.items as RecipeSummary[];

  const categories = await organizersApi.getCategories();
  const tags = await organizersApi.getTags();
  const tools = await organizersApi.getTools();
  const foods = await organizersApi.getFoods();

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      <SearchLayout
        categories={categories}
        tags={tags}
        tools={tools}
        foods={foods}
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
