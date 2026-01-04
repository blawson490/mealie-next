import { RecipeCategory } from "@/lib/types/recipe";
import Image from "next/image";
import { Favicon } from "./components/favicon";
import Rating from "./components/rating";
import Link from "next/link";
import RecipeInteractions from "./components/recipe-interactions";
import RecipeOptions from "./components/recipe-options";
import { getLoggedInUserApiUsersSelfGet } from "@/lib/api/generated/users-crud/users-crud";
import { getRatingsApiUsersIdRatingsGet } from "@/lib/api/generated/users-ratings/users-ratings";
import { getRecipeImageUrl } from "@/lib/api/media";

interface RecipeHeaderProps {
  name: string;
  id: string;
  slug: string;
  image_version?: string;
  image_key?: string;
  orgURL?: string;
  rating: number;
  categories?: RecipeCategory[];
  description?: string;
  cookTime?: string;
  prepTime?: string;
  instructionCount?: number;
  ingredientCount?: number;
  initialIsPublic: boolean;
}

export default async function RecipeHeader({
  name,
  id,
  slug,
  image_version,
  image_key,
  categories,
  orgURL,
  rating,
  description,
  instructionCount,
  ingredientCount,
  cookTime,
  prepTime,
  initialIsPublic,
}: RecipeHeaderProps) {
  const self = await getLoggedInUserApiUsersSelfGet();
  const selfRatingsResponse = await getRatingsApiUsersIdRatingsGet(self.id);

  const isFavorited =
    selfRatingsResponse.ratings.find((rating) => rating.recipeId === id)
      ?.isFavorite ?? false;

  return (
    <div className="rounded-xl bg-white shadow overflow-hidden mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        <div className="relative bg-gray-200 overflow-hidden order-2 md:order-1">
          <Image
            src={getRecipeImageUrl(id, image_version, image_key)}
            alt={name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {categories?.slice(0, 2).map((category) => (
              <span
                key={category.slug}
                className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded-full shadow-sm text-gray-700"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 flex flex-col order-1 md:order-2 col-span-2 h-full">
          <div>
            <div className="flex flex-row justify-between items-start">
              <div>
                <Link
                  href={orgURL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="mb-2 flex flex-row items-center gap-2 hover:underline">
                    <Favicon
                      url={orgURL || ""}
                      size="sm"
                      alt={`${name} source favicon`}
                    />
                    {orgURL && (
                      <span className="text-sm text-gray-500">
                        {new URL(orgURL).hostname}
                      </span>
                    )}
                  </div>
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  {name}
                </h1>
              </div>
              <RecipeOptions
                recipeId={id}
                recipeSlug={slug}
                recipeName={name}
                userId={self.id}
                initialIsFavorited={isFavorited}
                initialIsPublic={initialIsPublic}
              />
            </div>

            <RecipeInteractions
              recipeId={id}
              recipeName={name}
              recipeSlug={slug}
              userId={self.id}
              initialIsFavorited={isFavorited}
              initialRating={rating}
            />
          </div>

          <div className="mt-auto pt-8">
            <div className="border-t border-b p-4 mb-4 flex flex-row justify-between">
              <div className="flex flex-row items-center gap-6">
                <div className="text-center flex flex-row items-center gap-1">
                  <span className="block text-sm font-medium text-gray-900">
                    {instructionCount}
                  </span>
                  <span className="block text-sm text-gray-500">Steps</span>
                </div>
                <div className="text-center flex flex-row items-center gap-1">
                  <span className="block text-sm font-medium text-gray-900">
                    {ingredientCount}
                  </span>
                  <span className="block text-sm text-gray-500">
                    Ingredients
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center gap-6">
                <div className="text-center flex flex-row items-center gap-2">
                  <span className="block text-sm text-gray-500">Prep:</span>
                  <span className="block text-sm font-medium text-gray-900">
                    {prepTime || "--"}
                  </span>
                </div>
                <div className="text-center flex flex-row items-center gap-2">
                  <span className="block text-sm text-gray-500">Cook:</span>
                  <span className="block text-sm font-medium text-gray-900">
                    {cookTime || "--"}
                  </span>
                </div>
              </div>
            </div>
            {description && <p className="text-gray-700 mb-4">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
