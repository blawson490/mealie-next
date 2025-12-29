import { mediaApi } from "@/lib/api/media";
import { RecipeCategory } from "@/lib/types/recipe";
import {
  IconCalendar,
  IconChefHat,
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconFlame,
  IconHeart,
  IconList,
  IconListCheck,
  IconStar,
  IconStarFilled,
  IconTimelineEventText,
  IconToolsKitchen,
} from "@tabler/icons-react";
import Image from "next/image";

// Utility to format time string to Dec 12, 2023 format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Recipe Header
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
  orgURL,
  rating,
  categories,
  description,
  cookTime,
  prepTime,
  totalTime,
  instructionCount,
  ingredientCount,
  calories,
  servings,
  lastMade,
}: RecipeHeaderProps) {
  return (
    <header className="bg-white border-b flex w-full flex-col overflow-hidden rounded-t-lg mb-8 print:rounded-none print:shadow-none print:border-0">
      <div className="flex flex-col md:flex-row print:flex-row print:flex-wrap print:gap-4 print:p-4">
        {/* 1. Image: Stays top-left on web, top-left on print */}
        <div className="w-full md:w-1/3 h-64 md:h-auto bg-gray-200 relative print:w-32 print:h-32 print:rounded-lg overflow-hidden">
          <Image
            src={mediaApi.getRecipeImage(id, image_version, image_key)}
            alt={name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Categories hidden on print */}
          <div className="hidden print:hidden md:flex absolute top-2 left-2 flex gap-2">
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

        {/* 2. Info Container: This uses print:contents to let children participate in the outer flex-wrap */}
        <div className="pt-6 px-4 flex-1 flex flex-col justify-center print:contents print:ml-4">
          {/* Text Group: Stays to the right of the image in print */}
          <div className="flex flex-col print:flex-1">
            <h1 className="text-3xl md:text-4xl print:text-xl font-extrabold text-gray-900 mb-2">
              {name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4 gap-1">
              {[...Array(5)].map((_, i) =>
                i < rating ? (
                  <IconStarFilled
                    key={i}
                    className="w-5 h-5 text-yellow-500 print:w-4 print:h-4"
                  />
                ) : (
                  <IconStar
                    key={i}
                    className="w-5 h-5 text-gray-300 print:w-4 print:h-4"
                  />
                )
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed print:text-sm print:mb-0">
              {description}
            </p>
          </div>

          {/* 3. Overview Chips: Moves to full width in print because of print:w-full */}
          <div className="mt-auto flex flex-col pt-2 gap-4 print:mt-0 print:w-full">
            <div className="flex flex-wrap gap-2 md:gap-4 font-medium ">
              {/* <RecipeInfoChip
                icon={IconClock}
                label="Serves"
                value={String(servings) || ""}
                className="hidden print:flex"
              /> */}
              <RecipeInfoChip
                icon={IconClock}
                label="Total"
                value={totalTime || "N/A"}
              />
              <RecipeInfoChip
                icon={IconToolsKitchen}
                label="Prep"
                value={prepTime || "N/A"}
              />
              <RecipeInfoChip
                icon={IconChefHat}
                label="Cook"
                value={cookTime || "N/A"}
              />
              <RecipeInfoChip
                icon={IconFlame}
                label="Calories"
                value={calories ? String(calories) : "N/A"}
                className="print:flex"
              />
              <RecipeInfoChip
                icon={IconListCheck}
                label="Ingredients"
                value={ingredientCount ? String(ingredientCount) : "N/A"}
                className="print:flex"
              />
              <RecipeInfoChip
                icon={IconList}
                label="Steps"
                value={instructionCount ? String(instructionCount) : "N/A"}
                className="print:flex"
              />
              {/* <RecipeInfoChip
                icon={IconCalendar}
                label="Last Made"
                value={lastMade ? formatDate(lastMade) : "Never"}
                className="print:hidden"
              /> */}
            </div>

            {/* URL / Source (Print Only) */}
            <div className="hidden print:block border-t pt-2">
              <p className="text-[10px] text-gray-400 italic break-all">
                {orgURL}
              </p>
            </div>

            {/* Action Buttons (Web Only) */}
            <div className="print:hidden flex items-center justify-end gap-2 p-4">
              <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                <IconHeart className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-2 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-primary-dark transition">
                <IconTimelineEventText className="w-5 h-5" />
                <span className="sr-only">Timeline</span>
              </button>
              <button className="flex items-center gap-2 px-2 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-green-600 transition">
                <IconEdit className="w-5 h-5" />
                <span className="sr-only">Edit Recipe</span>
              </button>
              <button className="flex items-center gap-2 px-2 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-green-700 transition">
                <IconDotsVertical className="w-5 h-5" />
                <span className="sr-only">Start Cooking</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

//  Recipe Info Chip
interface RecipeInfoChipProps {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
}

function RecipeInfoChip({
  icon: Icon,
  label,
  value,
  className,
}: RecipeInfoChipProps) {
  const transformValue = (val: string | number) => {
    if (typeof val === "number") {
      return val;
    }
    return val
      .replace(/\s*hours?/g, "h")
      .replace(/\s*minutes?/g, "m")
      .replace(/\s+/g, " ")
      .trim();
  };
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-center border border-orange-100 ${className} print:border-black print:border-1 print:border-gray-300`}
    >
      <Icon className="w-5 h-5 mx-auto text-orange-500" />
      <div className="flex flex-col leading-none items-start">
        <span className="block text-xs text-gray-500 font-medium">{label}</span>
        <span className="font-semibold text-gray-900">
          {transformValue(value)}
        </span>
      </div>
    </div>
  );
}
