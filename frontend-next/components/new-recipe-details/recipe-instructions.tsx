"use client";
import { RecipeIngredient, RecipeStep } from "@/lib/types/recipe";
import {
  IconClock,
  IconChefHat,
  IconEdit,
  IconPrinter,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { Button } from "../ui/button";
import MealieMarkdown from "./mealie-markdown";

export default function RecipeInstructions({
  instructions,
  ingredients,
  totalTime,
  cookTime,
}: {
  instructions: RecipeStep[];
  ingredients: RecipeIngredient[];
  totalTime?: string;
  cookTime?: string;
}) {
  const getStepIngredients = (step: RecipeStep) => {
    if (!step.ingredientReferences || !ingredients) return [];
    const refIds = step.ingredientReferences
      .map((r) => r.referenceId)
      .filter(Boolean);
    return ingredients.filter(
      (ing) => ing.referenceId && refIds.includes(ing.referenceId)
    );
  };

  const groupedInstructionsWithIngredients = useMemo(() => {
    const groups: { title: string | null; steps: RecipeStep[] }[] = [];
    let currentGroup: { title: string | null; steps: RecipeStep[] } | null =
      null;

    instructions.forEach((step) => {
      if (step.title || groups.length === 0) {
        currentGroup = {
          title: step.title || null,
          steps: [],
        };
        groups.push(currentGroup);
      }
      if (currentGroup) {
        currentGroup.steps.push(step);
      }
    });

    return groups;
  }, [instructions]);

  const processInstructionText = (
    text: string,
    stepIngredients: RecipeIngredient[]
  ) => {
    if (!stepIngredients.length || !text) return text;

    const names = new Set<string>();
    stepIngredients.forEach((i) => {
      if (i.food) {
        names.add(i.food.name);
        if (i.food.pluralName) names.add(i.food.pluralName);
        if (i.food.aliases) {
          i.food.aliases.forEach((a) => names.add(a.name));
        }
      }
      if (i.display) names.add(i.display);
    });

    const expandedNames = new Set<string>();
    const stopWords = new Set([
      "a",
      "an",
      "the",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "and",
      "or",
    ]);

    names.forEach((name) => {
      if (!name) return;
      expandedNames.add(name);

      const words = name.split(/[\s\-_]+/);
      if (words.length > 1) {
        for (let len = 1; len <= words.length; len++) {
          for (let j = 0; j <= words.length - len; j++) {
            const subPhrase = words.slice(j, j + len).join(" ");
            if (subPhrase.length >= 2) {
              if (len === 1 && stopWords.has(subPhrase.toLowerCase())) {
                continue;
              }
              expandedNames.add(subPhrase);
            }
          }
        }
      }
    });

    const uniqueNames = Array.from(expandedNames)
      .filter((n) => n && n.length >= 2)
      .sort((a, b) => b.length - a.length);

    if (uniqueNames.length === 0) return text;

    const escapedNames = uniqueNames.map((n) =>
      n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const pattern = escapedNames.join("|");
    const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

    const parts = text.split(/(<[^>]+>)/g);

    return parts
      .map((part) => {
        if (part.startsWith("<")) return part;
        // CHANGE: Bold orange text instead of badges or background highlights
        return part.replace(
          regex,
          '<span class="font-bold text-primary">$1</span>'
        );
      })
      .join("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <IconChefHat className="text-primary" size={20} />
          <span>Instructions</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"
            title="Copy to Clipboard"
          >
            <IconPrinter size={16} />
          </Button>

          {/* <Button size="sm">Start Cooking</Button> */}
        </div>
      </div>

      <div className="p-0">
        {groupedInstructionsWithIngredients.map((group, groupIndex) => (
          <div key={`group-${groupIndex}`}>
            {/* Section Header - Only renders if title exists */}
            {group.title && (
              <div className="bg-slate-50 border-y border-slate-100 px-6 py-2 sticky top-0 z-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {group.title}
                </h3>
              </div>
            )}

            {/* List of Steps */}
            <div className="divide-y divide-slate-100">
              {group.steps.map((step, stepIndex) => {
                const stepIngredients = getStepIngredients(step);
                const globalIndex = instructions.indexOf(step);

                return (
                  <div
                    key={`step-${groupIndex}-${stepIndex}`}
                    className="group flex gap-5 px-6 py-5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-shrink-0 pt-1">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary group-hover:bg-primary/30 transition-colors">
                        {globalIndex + 1}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="text-[15px] text-slate-700 leading-relaxed">
                        <MealieMarkdown
                          content={processInstructionText(
                            step.text,
                            stepIngredients
                          )}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-dashed border-slate-200 p-2">
        <Button
          variant="ghost"
          className="justify-start pl-3 gap-2 h-9 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors rounded-lg"
        >
          <IconEdit size={15} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Edit Instructions
          </span>
        </Button>
      </div>
    </div>
  );
}
