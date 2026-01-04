import RecipeDetails from "@/components/new-recipe-details/recipe-details";
import { getOneApiRecipesSlugGet } from "@/lib/api/generated/recipe-crud/recipe-crud";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getOneApiRecipesSlugGet(slug);
  return (
    <div className="bg-muted md:px-4 print:p-0">
      {recipe && <RecipeDetails {...recipe} />}
    </div>
  );
}
