"use client";
import { RecipeIngredient } from "@/lib/types/recipe";
import {
  IconCarrot,
  IconCopy,
  IconCheck,
  IconMinus,
  IconPlus,
  IconShoppingBag,
  IconScale,
  IconEdit,
} from "@tabler/icons-react";
import { decimalToFraction } from "@/lib/fractions";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function RecipeIngredients({
  ingredients,
  yields,
}: {
  ingredients: RecipeIngredient[];
  yields?: number;
}) {
  const baseServings = yields || 1;
  const [currentServings, setCurrentServings] = useState(baseServings);
  const [copied, setCopied] = useState(false);
  const [addedToList, setAddedToList] = useState(false);

  // New: Track checked ingredients
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);

  const scale = currentServings / baseServings;
  const isScaled = currentServings !== baseServings;

  const handleAdjustServings = (delta: number) => {
    setCurrentServings((prev) => Math.max(1, prev + delta));
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getScaledDetails = (ing: RecipeIngredient) => {
    const baseQty = ing.quantity || 0;
    const scaledQty = baseQty * scale;

    let qtyString = "";
    if (baseQty > 0) {
      qtyString = decimalToFraction(scaledQty);
    }

    let unit = ing.unit?.name || "";
    if (scaledQty > 1 && ing.unit?.pluralName) {
      unit = ing.unit.pluralName;
    }

    const name = ing.food?.name || ing.display || ing.note || "";
    const note = ing.food ? ing.note : "";

    return { qtyString, unit, name, note };
  };

  const handleCopy = () => {
    const text = ingredients
      .map((ing) => {
        const { qtyString, unit, name, note } = getScaledDetails(ing);
        const noteStr = note ? ` (${note})` : "";
        return `- ${qtyString} ${unit} ${name}${noteStr}`
          .trim()
          .replace(/\s+/g, " ");
      })
      .join("\n");

    const header = `Ingredients (For ${currentServings} servings)\n`;
    navigator.clipboard.writeText(header + text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAddToList = () => {
    setAddedToList(true);
    setTimeout(() => setAddedToList(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden h-fit flex flex-col">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <IconCarrot className="text-primary" size={20} />
          <span>Ingredients</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"
            title="Copy to Clipboard"
          >
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </Button>

          <Button
            size="sm"
            onClick={handleAddToList}
            className={cn(
              "text-xs transition-all ml-1 gap-2",
              addedToList
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            {addedToList ? (
              <>
                <IconCheck size={14} /> Added
              </>
            ) : (
              <>
                <IconShoppingBag size={14} /> Add to List
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 2. Toolbar */}
      <div className="flex items-center justify-between border-y border-slate-100 bg-slate-50/30 px-5 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-md border border-slate-200 shadow-sm">
            <button
              onClick={() => handleAdjustServings(-1)}
              disabled={currentServings <= 1}
              className="px-2 py-1 hover:bg-slate-50 text-slate-500 disabled:opacity-30 transition-colors border-r border-slate-100"
            >
              <IconMinus size={14} />
            </button>
            <div className="px-3 py-1 min-w-[3rem] text-center text-sm font-bold text-slate-900 tabular-nums">
              {currentServings}
            </div>
            <button
              onClick={() => handleAdjustServings(1)}
              className="px-2 py-1 hover:bg-slate-50 text-slate-500 transition-colors border-l border-slate-100"
            >
              <IconPlus size={14} />
            </button>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Servings
          </span>
        </div>

        {isScaled && (
          <Button
            onClick={() => setCurrentServings(baseServings)}
            className="flex items-center gap-1.5 text-xs bg-background text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors rounded-lg border-dashed border-slate-200 px-2 py-1"
          >
            <IconScale size={12} />
            <span>Original: {baseServings}</span>
          </Button>
        )}
      </div>

      {/* 3. List */}
      <div className="divide-y divide-slate-100 flex-1">
        {ingredients.map((ing, i) => {
          const { qtyString, unit, name, note } = getScaledDetails(ing);
          const isChecked = checkedIngredients.includes(i);

          return (
            <div
              key={i}
              onClick={() => toggleIngredient(i)}
              className={cn(
                "group flex items-start gap-3.5 px-5 py-3.5 transition-all cursor-pointer select-none",
                isChecked ? "bg-slate-50/50" : "hover:bg-slate-50/20 bg-white"
              )}
            >
              {/* Check Circle Logic */}
              <div
                className={cn(
                  "mt-1 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  isChecked
                    ? "bg-primary border-primary scale-100"
                    : "border-slate-200 group-hover:border-primary/80 bg-transparent"
                )}
              >
                {isChecked && (
                  <IconCheck size={12} className="text-white" stroke={3} />
                )}
              </div>

              {/* Text Logic */}
              <div
                className={cn(
                  "text-[15px] leading-relaxed transition-colors duration-200",
                  isChecked
                    ? "text-slate-400 line-through decoration-slate-300"
                    : "text-slate-700"
                )}
              >
                {(qtyString || unit) && (
                  <span
                    className={cn(
                      "font-bold",
                      isChecked ? "text-slate-400" : "text-slate-900"
                    )}
                  >
                    {qtyString} {unit}
                  </span>
                )}{" "}
                <span className="font-medium">{name}</span>{" "}
                {note && (
                  <span
                    className={cn(
                      "italic",
                      isChecked ? "text-slate-300" : "text-slate-400"
                    )}
                  >
                    ({note})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-dashed border-slate-200 p-2 mt-auto">
        <Button
          variant="ghost"
          className="justify-start pl-3 gap-2 h-9 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors rounded-lg"
        >
          <IconEdit size={15} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Edit Ingredients
          </span>
        </Button>
      </div>
    </div>
  );
}
