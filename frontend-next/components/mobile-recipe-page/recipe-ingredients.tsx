"use client";

import { useState } from "react";
import { RecipeIngredient } from "@/lib/types/recipe";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  IconCopy,
  IconShoppingCart,
  IconMinus,
  IconPlus,
  IconScale,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { decimalToFraction } from "@/lib/fractions";

interface RecipeIngredientsProps {
  ingredients: RecipeIngredient[];
  baseServings?: number;
}

export default function RecipeIngredients({
  ingredients,
  baseServings = 1,
}: RecipeIngredientsProps) {
  const [servings, setServings] = useState(baseServings || 1);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );

  const scale = servings / (baseServings || 1);

  const handleToggleIngredient = (index: number) => {
    const next = new Set(checkedIngredients);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setCheckedIngredients(next);
  };

  const handleCopy = () => {
    const text = ingredients
      .map((ing) => {
        if (ing.title) return `\n${ing.title}`;

        if (ing.food) {
          const qty = ing.quantity
            ? decimalToFraction(ing.quantity * scale)
            : "";
          const unit = ing.unit?.name || "";
          const food = ing.food.name || "";
          const note = ing.note ? `(${ing.note})` : "";
          return `${qty} ${unit} ${food} ${note}`.trim();
        } else {
          const display = ing.display || "";
          const note = ing.note ? `(${ing.note})` : "";
          return `${display} ${note}`.trim();
        }
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  const handleAddToList = () => {
    console.log("Add to list", ingredients, scale);
    // Implement add to list logic
  };

  const formatQuantity = (qty?: number | null) => {
    if (!qty) return "";
    return decimalToFraction(qty * scale);
  };

  // Filter out ingredients that are just titles/headers for the count
  const ingredientCount = ingredients.filter((i) => !i.title).length;

  return (
    <div className="flex flex-col gap-4 p-4 bg-background rounded-lg shadow-sm border">
      <div className="flex flex-row flex-wrap justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Ingredients</h2>
          <Badge variant="secondary" className="rounded-full">
            {ingredientCount}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md bg-muted/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setServings(Math.max(1, servings - 1))}
            >
              <IconMinus size={14} />
            </Button>
            <div className="px-2 text-sm font-medium min-w-[3rem] text-center">
              {servings}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setServings(servings + 1)}
            >
              <IconPlus size={14} />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              <IconCopy size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddToList}
              title="Add to shopping list"
            >
              <IconShoppingCart size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {ingredients.map((ingredient, index) => {
          if (ingredient.title) {
            return (
              <div
                key={index}
                className="font-bold text-lg mt-4 mb-2 text-primary border-b pb-1"
              >
                {ingredient.title}
              </div>
            );
          }

          const isChecked = checkedIngredients.has(index);

          return (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 p-2 rounded-md transition-colors hover:bg-muted/50",
                isChecked && "opacity-50"
              )}
            >
              <Checkbox
                id={`ingredient-${index}`}
                checked={isChecked}
                onCheckedChange={() => handleToggleIngredient(index)}
                className="mt-1"
              />
              <label
                htmlFor={`ingredient-${index}`}
                className={cn(
                  "flex-1 cursor-pointer text-sm leading-relaxed",
                  isChecked && "line-through"
                )}
              >
                <div className="flex flex-col">
                  <div>
                    {ingredient.food ? (
                      <>
                        <span className="font-semibold">
                          {formatQuantity(ingredient.quantity)}
                        </span>{" "}
                        {ingredient.unit?.name && (
                          <span className="text-muted-foreground">
                            {/* If quantity is > 1 show plural name */}
                            {ingredient.quantity && ingredient.quantity > 1
                              ? ingredient.unit.pluralName + " " ||
                                ingredient.unit.name
                              : ingredient.unit.name + " "}
                          </span>
                        )}
                        <span>{ingredient.food.name}</span>
                        {"label" in ingredient.food &&
                          ingredient.food.label?.name && (
                            <Badge
                              variant="outline"
                              className="ml-2 h-5 px-1.5 text-[10px] font-normal align-middle"
                              style={
                                ingredient.food.label.color
                                  ? {
                                      borderColor: ingredient.food.label.color,
                                      color: ingredient.food.label.color,
                                    }
                                  : undefined
                              }
                            >
                              {ingredient.food.label.name}
                            </Badge>
                          )}
                      </>
                    ) : (
                      <span>{ingredient.display}</span>
                    )}
                  </div>
                  {ingredient.note && (
                    <div className="text-xs text-muted-foreground italic mt-0.5">
                      {ingredient.note}
                    </div>
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
