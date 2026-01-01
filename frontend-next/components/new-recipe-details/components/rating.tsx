"use client";

import { useState } from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type RatingProps = {
  rating?: number | null;
  size?: number;
  className?: string;
  onRate?: (rating: number) => void;
  readonly?: boolean;
};

export default function Rating({
  rating,
  size = 16,
  className,
  onRate,
  readonly = false,
}: RatingProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const currentRating = rating ?? 0;
  const stars = Array.from({ length: 5 });

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={() => !readonly && setHoverIndex(null)}
      aria-label={
        rating == null ? "Not yet rated" : `Rated ${currentRating} out of 5`
      }
    >
      {stars.map((_, i) => {
        const starValue = i + 1;
        const isHoveredPreview = hoverIndex !== null && i <= hoverIndex;
        const isRatedOriginal = currentRating >= starValue;

        const showFilled =
          hoverIndex !== null ? isHoveredPreview : isRatedOriginal;

        const scaleClass =
          !readonly && hoverIndex === i ? "scale-125" : "scale-100";
        const cursorClass = readonly ? "cursor-default" : "cursor-pointer";

        let colorClass: string;
        if (showFilled) {
          colorClass = "text-yellow-500"; // Changed to yellow/primary for visibility
        } else {
          colorClass = "text-gray-300";
        }

        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            className={`inline-flex transition-transform duration-150 ${scaleClass} ${cursorClass}`}
            onMouseEnter={() => !readonly && setHoverIndex(i)}
            onClick={() => !readonly && onRate?.(starValue)}
          >
            {showFilled ? (
              <IconStarFilled size={size} className={colorClass} />
            ) : (
              <IconStar size={size} className={colorClass} />
            )}
          </button>
        );
      })}
    </div>
  );
}
