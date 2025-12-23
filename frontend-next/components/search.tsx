"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  Utensils,
  Tag,
  Hammer,
  ChefHat,
  Plus,
  ArrowRight,
  Clock,
  Trash2,
  Sparkles,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  IngredientFood,
  RecipeCategoryResponse,
  RecipeIngredient,
  RecipeTagResponse,
  RecipeToolResponse,
} from "@/lib/types/recipe";

interface RecipeSearchProps {
  onActiveChange: (isActive: boolean) => void;
  activeFilters: { id: string; label: string; type: string }[];
  toggleFilter: (label: string, type: string) => void;
  removeFilter: (id: string) => void;
  clearAll: () => void;
  query: string;
  setQuery: (query: string) => void;
  categories: RecipeCategoryResponse[];
  tags: RecipeTagResponse[];
  tools: RecipeToolResponse[];
  foods: IngredientFood[];
}

export default function RecipeSearch({
  onActiveChange,
  activeFilters,
  toggleFilter,
  clearAll,
  removeFilter,
  query,
  setQuery,
  categories,
  tags,
  tools,
  foods,
}: RecipeSearchProps) {
  const [isActive, setIsActive] = useState(false);
  const [liveResultsEnabled, setLiveResultsEnabled] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onActiveChange(isActive);
  }, [isActive, onActiveChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFilterSelected = (label: string, type: string) =>
    activeFilters.some((f) => f.id === `${type}:${label}`);

  const filteredFoods = foods.filter((i) =>
    i.name.toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* --- MAIN SEARCH BAR --- */}
      <div
        className={`
        relative z-50 flex items-center bg-background
        transition-all duration-300 ease-in-out
        border-2 ${
          isActive
            ? "border-primary shadow ring-4 ring-primary/10"
            : "border shadow-sm"
        }
        ${isActive ? "rounded-t-2xl" : "rounded-xl"}
      `}
      >
        <div className="pl-4 pr-2 text-slate-400">
          <Search
            className={`w-5 h-5 transition-colors ${
              isActive ? "text-primary" : ""
            }`}
          />
        </div>

        <div className="flex-1 flex flex-wrap items-center gap-2 py-3 pr-4 min-h-[56px]">
          {activeFilters.map((filter) => (
            <span
              key={filter.id}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary text-white text-[10px] font-bold rounded-md animate-in fade-in zoom-in"
            >
              <span className="opacity-70 font-normal uppercase">
                {filter.type}
              </span>
              {filter.label}
              <button
                onClick={() => removeFilter(filter.id)}
                className="hover:bg-primary rounded p-0.5"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder={
              activeFilters.length > 0
                ? ""
                : "Search recipes by name or keywords..."
            }
            className="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
            onFocus={() => setIsActive(true)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center pr-2 gap-1 border-l pl-2">
          <Button
            variant={"link"}
            onClick={() => setIsActive(!isActive)}
            className={`p-2 rounded-lg transition-colors ${
              isActive ? "bg-primary/10 text-primary shadow-inner" : ""
            }`}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* --- EXPANDED PANEL --- */}
      {isActive && (
        <div className="absolute top-full left-0 right-0 z-40 bg-card border-x-2 border-b-2 border-primary rounded-b-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-top-2">
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Left Column: Navigational Metadata */}
              <div className="space-y-8">
                <section>
                  <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <Utensils className="w-3 h-3" /> Categories (
                    {categories.length})
                  </h4>
                  {/* Question B: Scrollable Grid for many items */}
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar p-1">
                    {categories.map((cat) => {
                      const selected = isFilterSelected(cat.name, "cat");
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleFilter(cat.name, "cat")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-2
                            ${
                              selected
                                ? "bg-primary border-primary text-white shadow-md"
                                : "bg-card-50 dark:bg-card text-slate-600 dark:text-slate-300 border-transparent hover:border-primary"
                            }`}
                        >
                          {selected && <Check className="w-3 h-3" />}
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <Tag className="w-3 h-3" /> Tags ({tags.length})
                  </h4>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar p-1">
                    {tags.map((tag) => {
                      const selected = isFilterSelected(tag.name, "tag");
                      return (
                        <button
                          key={tag.id}
                          onClick={() => toggleFilter(tag.name, "tag")}
                          className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                            selected
                              ? "bg-primary border-primary text-white shadow-sm"
                              : "text-slate-500 border-slate-200 dark:border-slate-700 hover:border-primary"
                          }`}
                        >
                          #{tag.name}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Right Column: Functional Filters */}
              <div className="space-y-8">
                <section>
                  <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <Hammer className="w-3 h-3" /> Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool) => {
                      const selected = isFilterSelected(tool.name, "tool");
                      return (
                        <button
                          key={tool.id}
                          onClick={() => toggleFilter(tool.name, "tool")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            selected
                              ? "bg-primary border-primary text-white shadow-md"
                              : "text-primary bg-primary/10 dark:bg-primary/20 border-primary/20 dark:border-primary/50 hover:bg-primary/20"
                          }`}
                        >
                          {tool.name}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="bg-card dark:bg-card/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Sparkles className="w-3 h-3" /> Ingredients
                    </h4>
                    {/* Question B: Section-specific search for large lists */}
                    <div className="relative group">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                      <input
                        className="text-[10px] bg-input border border-slate-200 dark:border-slate-700 rounded-full pl-7 pr-3 py-1.5 outline-none w-40 focus:ring-2 focus:ring-primary transition-all shadow-sm"
                        placeholder="Filter list..."
                        value={ingredientSearch}
                        onChange={(e) => setIngredientSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {filteredFoods.map((food) => {
                      const selected = isFilterSelected(food.name, "food");
                      return (
                        <button
                          key={food.name}
                          onClick={() => toggleFilter(food.name, "food")}
                          className={`px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1.5 transition-all ${
                            selected
                              ? "bg-primary border-primary text-white"
                              : "bg-card text-slate-600 border-primary/10 dark:border-primary/30 hover:bg-primary/10"
                          }`}
                        >
                          {selected ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Plus className="w-3 h-3 text-primary" />
                          )}
                          {food.name}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-4 bg-card border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-8 shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer scale-90">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={liveResultsEnabled}
                    onChange={() => setLiveResultsEnabled(!liveResultsEnabled)}
                  />
                  <div className="w-9 h-5 bg-input rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  {liveResultsEnabled ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                  Live Results
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={clearAll}
                className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsActive(false)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                View Matches
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
