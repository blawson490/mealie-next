"use client";

import { useState } from "react";
import { RecipeStep, RecipeIngredient } from "@/lib/types/recipe";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { decimalToFraction } from "@/lib/fractions";

interface RecipeInstructionsProps {
  instructions: RecipeStep[];
  ingredients?: RecipeIngredient[];
}

export default function RecipeInstructions({
  instructions,
  ingredients = [],
}: RecipeInstructionsProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const handleToggleStep = (index: number) => {
    const next = new Set(checkedSteps);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setCheckedSteps(next);
  };

  const getStepIngredients = (step: RecipeStep) => {
    if (!step.ingredientReferences || !ingredients) return [];
    const refIds = step.ingredientReferences
      .map((r) => r.referenceId)
      .filter(Boolean);
    return ingredients.filter(
      (ing) => ing.referenceId && refIds.includes(ing.referenceId)
    );
  };

  const formatIngredient = (ing: RecipeIngredient) => {
    if (ing.food) {
      const qty = ing.quantity ? decimalToFraction(ing.quantity) : "";
      let unit = ing.unit?.name || "";
      if (ing.quantity && ing.quantity > 1 && ing.unit?.pluralName) {
        unit = ing.unit.pluralName;
      }
      const food = ing.food.name || "";
      const note = ing.note ? `(${ing.note})` : "";
      return `${qty} ${unit} ${food} ${note}`.trim();
    } else {
      return ing.display || ing.note || "";
    }
  };

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
        return part.replace(
          regex,
          '<span class="font-medium text-primary">$1</span>'
        );
      })
      .join("");
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-background rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-bold">Instructions</h2>
        <Badge variant="secondary" className="rounded-full">
          {instructions.length}
        </Badge>
      </div>

      <div className="flex flex-col gap-6">
        {instructions.map((step, index) => {
          const isChecked = checkedSteps.has(index);
          const stepIngredients = getStepIngredients(step);

          return (
            <div key={index} className="flex flex-col gap-2">
              {step.title && (
                <div className="font-bold text-lg mt-2 mb-1 text-primary border-b pb-1">
                  {step.title}
                </div>
              )}

              <div
                className={cn(
                  "flex items-start gap-3 p-3 rounded-md border transition-colors",
                  isChecked
                    ? "bg-muted/30 border-muted"
                    : "bg-card border-border",
                  isChecked && "opacity-60"
                )}
              >
                <Checkbox
                  id={`step-${index}`}
                  checked={isChecked}
                  onCheckedChange={() => handleToggleStep(index)}
                  className="mt-1"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <label
                    htmlFor={`step-${index}`}
                    className={cn(
                      "cursor-pointer text-base leading-relaxed",
                      isChecked && "line-through text-muted-foreground"
                    )}
                  >
                    <span className="font-bold text-sm text-muted-foreground block mb-1">
                      Step {index + 1}
                    </span>
                    <div
                      className="[&_img]:rounded-md [&_img]:my-2 [&_img]:max-w-full [&_img]:h-auto"
                      dangerouslySetInnerHTML={{
                        __html: processInstructionText(
                          step.text,
                          stepIngredients
                        ),
                      }}
                    />
                  </label>

                  {stepIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {stepIngredients.map((ing, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs font-normal bg-muted/50 text-muted-foreground border-muted-foreground/20"
                        >
                          {formatIngredient(ing)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
