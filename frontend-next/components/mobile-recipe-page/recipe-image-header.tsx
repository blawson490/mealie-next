import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mediaApi } from "@/lib/api/media";
import { useState } from "react";
import {
  IconCalendarPlus,
  IconPlayerPlayFilled,
  IconPlaylistAdd,
} from "@tabler/icons-react";

interface RecipeImageHeaderProps {
  id: string;
  title: string;
  version?: string;
  orgURL?: string;
  scrollY?: number;
  onScrollY?: (scrollY: number) => void;
  onCookingMode?: () => void;
  onAddToMealPlan?: () => void;
}

export function RecipeImageHeader({
  id,
  title,
  orgURL,
  version,
  scrollY = 0,
  onScrollY,
  onCookingMode,
  onAddToMealPlan,
}: RecipeImageHeaderProps) {
  // Cache Busting
  const [imageKey, setImageKey] = useState(1);
  // Parallax calculations
  const imageTranslateY = scrollY * -0.3;
  const textTranslateY = scrollY * 0.15;
  const opacity = Math.max(0, 1 - scrollY / 500);
  const blur = Math.min(10, scrollY / 50);

  return (
    <div>
      <div className="relative w-full md:max-w-3xl h-96 md:h-[500px] overflow-hidden group">
        {/* Image Background */}
        <div
          className="absolute inset-0 z-0 will-change-transform h-[130%] -top-[15%]"
          style={{
            transform: `translate3d(0, ${imageTranslateY}px, 0)`,
            filter: `blur(${blur}px)`,
          }}
        >
          {id ? (
            <Image
              src={mediaApi.getRecipeImage(id, version, imageKey)}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:p-10 text-white">
          <div className="flex flex-col gap-4 max-w-4xl">
            {/* Title and Source */}
            <div className="">
              {orgURL && (
                <Link
                  href={orgURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm md:text-base text-white/80 rounded hover:text-white hover:underline text-xs transition-colors"
                >
                  Original Source
                </Link>
              )}
              <div className="flex flex-row justify-between">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                  {title}
                </h1>
                {/* Actions */}
                {/* <div className="flex flex-wrap gap-3 mt-2">
                  {onCookingMode && (
                    <Button
                      onClick={onCookingMode}
                      variant="default"
                      className="gap-2 font-semibold bg-primary/60 hover:bg-primary/80"
                      size={"icon-lg"}
                    >
                      <IconCalendarPlus />
                    </Button>
                  )}
                  {onAddToMealPlan && (
                    <Button
                      onClick={onAddToMealPlan}
                      variant="default"
                      className="gap-2 font-semibold bg-primary/60 hover:bg-primary/80"
                      size={"icon-lg"}
                    >
                      <IconPlaylistAdd />
                    </Button>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 bg-black px-6 py-2">
        {/* Placeholders for images under the title */}
        <p className="text-xs text-gray-400">Assets</p>
        <div className="flex gap-3">
          <div className="h-12 w-12 bg-white/70 rounded-md" />
          <div className="h-12 w-12 bg-white/50 rounded-md" />
          <div className="h-12 w-12 bg-white/30 rounded-md" />
          <div className="h-12 w-12 bg-white/10 rounded-md" />
          <div className="h-12 w-12 border border-primary/40 border-1 rounded-md">
            <span className="flex h-full w-full items-center justify-center text-primary/40 font-semibold text-xs">
              +35
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
