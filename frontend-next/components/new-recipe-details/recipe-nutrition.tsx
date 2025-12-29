"use client";
import { useMemo, useState } from "react";
import { Nutrition } from "@/lib/types/recipe";
import {
  IconActivity,
  IconCandy,
  IconChevronDown,
  IconDna,
  IconDroplet,
  IconFlame,
  IconHeart,
  IconScale,
  IconWheat,
} from "@tabler/icons-react";

// Utilities

/**
 * Extracts a numeric value from a string like "20g", "20 g", "100 mg".
 * Returns 0 if invalid.
 */
const parseValue = (val: string | null | undefined): number => {
  if (!val) return 0;
  const match = val.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

/**
 * Returns the unit from a string (e.g. "g" from "20g") or defaults based on context.
 */
const getUnit = (val: string | null | undefined, defaultUnit = "g"): string => {
  if (!val) return defaultUnit;
  const match = val.match(/[a-zA-Z]+/);
  return match ? match[0] : defaultUnit;
};

/**
 * A sub-component for individual nutrient rows
 */
const NutrientRow = ({
  label,
  value,
  icon: Icon,
  subItem = false,
  highlight = false,
}: {
  label: string;
  value?: string | null;
  icon?: React.ElementType;
  subItem?: boolean;
  highlight?: boolean;
}) => {
  if (!value) return null;

  return (
    <div
      className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-0 ${
        subItem ? "pl-8 text-sm" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            className={`w-4 h-4 ${
              highlight ? "text-primary" : "text-gray-400"
            }`}
          />
        )}
        <span
          className={`${
            highlight ? "font-medium text-gray-900" : "text-gray-600"
          }`}
        >
          {label}
        </span>
      </div>
      <span
        className={`font-medium ${
          highlight ? "text-gray-900" : "text-gray-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

export default function RecipeNutrition({
  nutrition,
}: {
  nutrition?: Nutrition;
}) {
  // Calculate macro distribution for the visual bar
  const macros = useMemo(() => {
    if (!nutrition) {
      return {
        proteinPct: 0,
        carbsPct: 0,
        fatPct: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }

    const protein = parseValue(nutrition.proteinContent);
    const carbs = parseValue(nutrition.carbohydrateContent);
    const fat = parseValue(nutrition.fatContent);

    const total = protein + carbs + fat;

    // Avoid division by zero
    if (total === 0)
      return { proteinPct: 0, carbsPct: 0, fatPct: 0, protein, carbs, fat };

    return {
      proteinPct: Math.round((protein / total) * 100),
      carbsPct: Math.round((carbs / total) * 100),
      fatPct: Math.round((fat / total) * 100),
      protein,
      carbs,
      fat,
    };
  }, [nutrition]);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!nutrition) return null;

  // If nutrition data is missing, don't render the card
  const hasMacros = macros.protein > 0 || macros.carbs > 0 || macros.fat > 0;

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow overflow-hidden font-sans">
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <IconActivity className="w-5 h-5 text-primary" />
            Nutrition Facts
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium bg-muted p-1 rounded-full text-primary shadow-sm hover:cursor-pointer"
          >
            <IconChevronDown
              className={`w-4 h-4 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Primary Stat: Calories */}
        <div className="flex items-end justify-between bg-white/60 p-4 rounded-xl border border-white/50 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Energy
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {parseValue(nutrition.calories)}
              </span>
              <span className="text-lg font-medium text-gray-500">kcal</span>
            </div>
          </div>
          <IconFlame className="w-10 h-10 text-primary opacity-80" />
        </div>
      </div>

      {/* Macro Distribution Bar */}
      {hasMacros && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            <span>Macro Distribution</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full flex overflow-hidden">
            <div
              style={{ width: `${macros.proteinPct}%` }}
              className="bg-emerald-500 transition-all duration-1000 ease-out"
            />
            <div
              style={{ width: `${macros.carbsPct}%` }}
              className="bg-amber-400 transition-all duration-1000 ease-out delay-100"
            />
            <div
              style={{ width: `${macros.fatPct}%` }}
              className="bg-rose-400 transition-all duration-1000 ease-out delay-200"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-gray-600">
                Protein ({macros.proteinPct}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-gray-600">Carbs ({macros.carbsPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-gray-600">Fat ({macros.fatPct}%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Wrapper for the Expansion Animation */}
      <div
        className={`
    grid transition-[grid-template-rows] duration-300 ease-out
    ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
  `}
      >
        {/* The "Mask" - hides content when height is zero */}
        <div className="overflow-hidden">
          {/* The Content - Slides up/down as it opens/closes */}
          <div
            className={`
        p-6 pt-2 space-y-1
        transition-transform duration-300
        ${isExpanded ? "translate-y-0" : "-translate-y-6"}
      `}
          >
            {/* Macros Main */}
            <div className="pb-2">
              <NutrientRow
                label="Protein"
                value={nutrition.proteinContent}
                icon={IconDna}
                highlight
              />
              <NutrientRow
                label="Total Carbohydrate"
                value={nutrition.carbohydrateContent}
                icon={IconWheat}
                highlight
              />
              <NutrientRow
                label="Dietary Fiber"
                value={nutrition.fiberContent}
                subItem
              />
              <NutrientRow
                label="Sugars"
                value={nutrition.sugarContent}
                icon={IconCandy}
                subItem
              />
            </div>

            {/* Fats Detail */}
            <div className="pb-2 pt-2 border-t border-gray-100">
              <NutrientRow
                label="Total Fat"
                value={nutrition.fatContent}
                icon={IconDroplet}
                highlight
              />
              <NutrientRow
                label="Saturated Fat"
                value={nutrition.saturatedFatContent}
                subItem
              />
              <NutrientRow
                label="Trans Fat"
                value={nutrition.transFatContent}
                subItem
              />
              <NutrientRow
                label="Unsaturated Fat"
                value={nutrition.unsaturatedFatContent}
                subItem
              />
            </div>

            {/* Micros */}
            <div className="pt-2 border-t border-gray-100">
              <NutrientRow
                label="Cholesterol"
                value={nutrition.cholesterolContent}
                icon={IconHeart}
              />
              <NutrientRow
                label="Sodium"
                value={nutrition.sodiumContent}
                icon={IconScale}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 text-[10px] text-gray-400 text-center leading-tight">
        <span>
          *Percent values are based on a 2,000 calorie diet. Your daily values
          may be higher or lower depending on your calorie needs.
        </span>
        <span className="block mt-1">
          †Nutrient values may be pulled from original recipe website. See their
          website for accuracy.
        </span>
      </div>
    </div>
  );
}
