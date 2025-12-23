"use client"; // This file is a Client Component

import { useState } from "react";
import RecipeSearch from "./search";
import {
  IngredientFood,
  RecipeCategoryResponse,
  RecipeIngredient,
  RecipeTagResponse,
  RecipeToolResponse,
} from "@/lib/types/recipe";

interface SearchLayoutProps {
  children: React.ReactNode;
  categories: RecipeCategoryResponse[];
  tags: RecipeTagResponse[];
  tools: RecipeToolResponse[];
  foods: IngredientFood[];
}

export default function SearchLayout({
  children,
  categories,
  tags,
  tools,
  foods,
}: SearchLayoutProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<
    { id: string; label: string; type: string }[]
  >([]);

  const toggleFilter = (label: string, type: string) => {
    const filterId = `${type}:${label}`;
    if (activeFilters.find((f) => f.id === filterId)) {
      setActiveFilters(activeFilters.filter((f) => f.id !== filterId));
    } else {
      setActiveFilters([...activeFilters, { id: filterId, label, type }]);
    }
  };

  const removeFilter = (id: string) =>
    setActiveFilters(activeFilters.filter((f) => f.id !== id));
  const clearAll = () => {
    setActiveFilters([]);
    setQuery("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Standalone Search Bar */}
      <RecipeSearch
        onActiveChange={setIsSearching}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        removeFilter={removeFilter}
        clearAll={clearAll}
        query={query}
        setQuery={setQuery}
        categories={categories}
        tags={tags}
        tools={tools}
        foods={foods}
      />

      {/* Question A: The wrapper that applies the blur effect to its children.
          The children are usually server-rendered recipe cards.
      */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isSearching
            ? "opacity-40 scale-[0.98] blur-[2px] pointer-events-none grayscale-[20%]"
            : "opacity-100 scale-100 blur-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
