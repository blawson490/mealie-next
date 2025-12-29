"use client";
import { RecipeSummary } from "@/lib/types/recipe";
import { mediaApi } from "@/lib/api/media";
import {
  IconClock,
  IconDotsVertical,
  IconHeart,
  IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import Link from "next/link";

export default function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const [isFav, setIsFav] = useState(false);
  return (
    <Link href={`/home/recipes/${recipe.slug}`}>
      <div className="group cursor-pointer bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-row h-44 md:flex-col md:h-auto">
        {/* Image Section */}
        <div className="relative overflow-hidden bg-muted shrink-0 w-40 md:w-full md:h-48">
          {/* Gradient Overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />

          {/* Categories Overlay */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 max-w-[80%]">
            {recipe.recipeCategory?.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="px-2 py-0.5 bg-black/50 backdrop-blur-md text-white rounded-full text-[9px] font-semibold uppercase tracking-tight"
              >
                {cat.name}
              </span>
            ))}
            {recipe.recipeCategory && (
              <>
                {recipe.recipeCategory?.length > 2 && (
                  <span className="px-1.5 py-0.5 bg-black/50 backdrop-blur-md text-white rounded-full text-[9px] font-bold">
                    +{recipe.recipeCategory.length - 2}
                  </span>
                )}
              </>
            )}
          </div>

          <img
            src={mediaApi.getRecipeImage(recipe.id || "", recipe.image, "1")}
            alt={recipe.name || "Unknown Recipe"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <button
            onClick={() => setIsFav(!isFav)}
            className={`absolute top-2 right-2 z-20 p-2 rounded-full transition-all duration-300 shadow-sm ${
              isFav
                ? "bg-red-500 text-white"
                : "bg-white/80 hover:bg-white text-gray-600"
            }`}
          >
            <IconHeart size={16} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-3 md:p-4 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-base md:text-lg text-foreground leading-tight line-clamp-2 transition-colors truncate">
              {recipe.name}
            </h3>
          </div>

          <p className="text-[12px] md:text-sm text-muted-foreground line-clamp-2 font-medium">
            {recipe.description}
          </p>

          {/* Recipe Tags - New Section */}
          <div className="flex flex-wrap gap-1 mt-2">
            <>
              {recipe.tags?.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] md:text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md border border-border/50"
                >
                  #{tag.name}
                </span>
              ))}
              {recipe.tags && (
                <>
                  {recipe.tags?.length > 2 && (
                    <span className="text-[10px] md:text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md border border-border/50 font-bold">
                      +{recipe.tags?.length - 2}
                    </span>
                  )}
                </>
              )}
            </>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-slate-500">
                <IconClock size={15} className="text-primary/70" />
                <span className="text-[11px] md:text-xs font-semibold">
                  {recipe.totalTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <IconUsers size={15} className="text-primary/70" />
                <span className="text-[11px] md:text-xs font-semibold">
                  {recipe.recipeServings} servings
                </span>
              </div>

              {/* TODO: Come back to this */}
              {/* Compact Rating */}
              {/* <div className="flex items-center gap-1 shrink-0 my-2 text-slate-500">
              <IconStar
                size={12}
                className="text-primary"
                fill="currentColor"
              />
              <span className="text-[11px] md:text-xs font-semibold">
                {recipe.rating}
              </span>
            </div> */}
            </div>
            <button className="p-1 hover:bg-secondary rounded-md transition-colors">
              <IconDotsVertical size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
