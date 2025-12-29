import { mediaApi } from "@/lib/api/media";
import { RecipeCategory } from "@/lib/types/recipe";
import Image from "next/image";
import { Favicon } from "./components/favicon";
import Rating from "./components/rating";
import { Button } from "../ui/button";
import { IconDotsVertical, IconHeart, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

interface RecipeHeaderProps {
  name: string;
  id: string;
  image_version?: string;
  image_key?: string;
  orgURL?: string;
  rating: number;
  categories?: RecipeCategory[];
  description?: string;
  cookTime?: string;
  prepTime?: string;
  totalTime?: string;
  servings?: number;
  instructionCount?: number;
  ingredientCount?: number;
  calories?: string;
  lastMade?: string;
}

export default function RecipeHeader({
  name,
  id,
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
}: RecipeHeaderProps) {
  return (
    <div className="rounded-xl bg-white shadow overflow-hidden mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Image Section */}
        <div className="relative h-80 md:h-96 bg-gray-200 overflow-hidden order-2 md:order-1">
          <Image
            src={mediaApi.getRecipeImage(id, image_version, image_key)}
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
        {/* CHANGE 1: Removed 'justify-center', added 'h-full' to fill grid height */}
        <div className="p-4 flex flex-col order-1 md:order-2 col-span-2 h-full">
          {/* --- TOP SECTION (Stays at top) --- */}
          <div>
            <Link
              href={orgURL || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Favicon of orgURL & orgUrl */}
              <div className="mb-2 flex flex-row items-center gap-2 hover:underline">
                {/* Favicon Placeholder */}
                <Favicon
                  url={orgURL || ""}
                  size="sm"
                  alt={`${name} source favicon`}
                />
                {/* orgURL Placeholder */}
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
            {/* Rating Component */}
            <Rating rating={rating} size={24} className="mb-4" />
            <div className="flex flex-row gap-2 flex-wrap">
              <Button>
                <IconPlus className="mr-1" />
                Add to Meal Plan
              </Button>
              <Button variant="outline">Add to Shopping List</Button>
              <Button variant="outline">
                <IconHeart className="mr-1" />
                Favorite
              </Button>
              <Button variant="outline">
                <IconDotsVertical className="mr-1" />
                More
              </Button>
            </div>
          </div>

          {/* --- BOTTOM SECTION (Pushed to bottom) --- */}
          {/* CHANGE 2: Added 'mt-auto'. This absorbs the gap space. */}
          <div className="mt-auto pt-8">
            <div className="border-t border-b p-4 mb-4 flex flex-row justify-between">
              {/* Number of steps */}
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
                {/* Prep Time */}
                <div className="text-center flex flex-row items-center gap-2">
                  <span className="block text-sm text-gray-500">Prep:</span>
                  <span className="block text-sm font-medium text-gray-900">
                    {prepTime || "--"}
                  </span>
                </div>
                {/* Cook Time */}
                <div className="text-center flex flex-row items-center gap-2">
                  <span className="block text-sm text-gray-500">Cook:</span>
                  <span className="block text-sm font-medium text-gray-900">
                    {cookTime || "--"}
                  </span>
                </div>
              </div>
            </div>
            {/* Description */}
            {description && <p className="text-gray-700 mb-4">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
