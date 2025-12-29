"use client";

import React, { useState } from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

type RatingProps = {
  rating?: number | null;
  size?: number; // px
  className?: string;
};

export function Rating({ rating, size = 16, className }: RatingProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const ratedCount = Math.max(0, Math.min(5, Math.floor(rating ?? 0)));
  const stars = Array.from({ length: 5 });

  return (
    <div
      className={`flex items-center gap-1 ${className ?? ""}`}
      onMouseLeave={() => setHoverIndex(null)}
      aria-label={
        rating == null ? "Not yet rated" : `Rated ${ratedCount} out of 5`
      }
    >
      {stars.map((_, i) => {
        const isHoveredPreview = hoverIndex !== null && i <= hoverIndex;
        const isRatedOriginal = ratedCount > i;
        const showFilled =
          hoverIndex !== null ? isHoveredPreview : isRatedOriginal;
        const scaleClass = hoverIndex === i ? "scale-120" : "scale-100";

        // Color logic:
        // - Filled: primary
        // - Unfilled while hovering: darker outline for originally rated, lighter for others
        // - Unfilled without hover: lighter outline
        let colorClass: string;
        if (showFilled) {
          colorClass = "text-primary";
        } else if (hoverIndex !== null) {
          colorClass = isRatedOriginal ? "text-primary/70" : "text-primary/30";
        } else {
          colorClass = "text-primary/30";
        }

        return (
          <span
            key={i}
            className={`inline-flex transition-transform duration-150 ${scaleClass}`}
            onMouseEnter={() => setHoverIndex(i)}
            role="img"
            aria-label={`Star ${i + 1}`}
          >
            {showFilled ? (
              <IconStarFilled
                style={{ width: size, height: size }}
                className={colorClass}
              />
            ) : (
              <IconStar
                style={{ width: size, height: size }}
                className={colorClass}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

export default Rating;
