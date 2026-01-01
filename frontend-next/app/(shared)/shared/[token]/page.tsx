import { redirect } from "next/navigation";
import { recipeApi } from "@/lib/api/recipe";

// Get shared recipe is a publically accessible page that uses the token to fetch the recipe
// TODO: Update this to show the recipe details in a read-only view instead of redirecting
export default async function SharedRecipePage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = await params;
  try {
    // Fetch the shared recipe using the token
    const recipe = await recipeApi.getSharedRecipe(token);

    // Redirect to the recipe detail page
    redirect(`/home/recipes/${recipe.slug}`);
  } catch (error) {
    // Next.js redirect() throws a special error - let it pass through
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    // If the recipe cannot be fetched (invalid token, expired, etc.)
    // Redirect to home or show an error page
    console.error("Failed to fetch shared recipe:", error);
    redirect("/");
  }
}
