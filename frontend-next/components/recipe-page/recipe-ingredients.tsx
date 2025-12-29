"use client";
import { RecipeIngredient } from "@/lib/types/recipe";
import {
  IconCheck,
  IconChefHat,
  IconCopy,
  IconMinus,
  IconPlus,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

const groupIngredients = (ingredients: RecipeIngredient[]) => {
  const sections: Array<{ title: string; items: RecipeIngredient[] }> = [];
  let currentSection: { title: string; items: RecipeIngredient[] } = {
    title: "Ingredients",
    items: [],
  };

  ingredients.forEach((ing, index) => {
    // If an ingredient has a title, it starts a new section
    if (ing.title) {
      // Push previous section if it has items
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      // Start new section
      currentSection = {
        title: ing.title,
        items: [ing], // The item with the title is the first item of the new section
      };
    } else {
      // Add to current section
      currentSection.items.push(ing);
    }
  });

  // Push the final section
  if (currentSection.items.length > 0) {
    sections.push(currentSection);
  }

  return sections;
};

const formatQuantityForClipboard = (value: number) => {
  const tolerance = 0.05;
  const whole = Math.floor(value);
  const decimal = value - whole;

  if (Math.abs(decimal) < tolerance) return whole > 0 ? whole.toString() : "";

  const fractions = [
    { dec: 0.125, char: "⅛" },
    { dec: 0.25, char: "¼" },
    { dec: 0.333, char: "⅓" },
    { dec: 0.5, char: "½" },
    { dec: 0.666, char: "⅔" },
    { dec: 0.75, char: "¾" },
  ];

  let fractionChar = "";
  for (let f of fractions) {
    if (Math.abs(decimal - f.dec) < tolerance) {
      fractionChar = f.char;
      break;
    }
  }

  if (fractionChar) {
    return whole > 0 ? `${whole} ${fractionChar}` : fractionChar;
  }

  return parseFloat(value.toFixed(2)).toString();
};

const QuantityDisplay = ({ value }: { value: number }) => {
  const tolerance = 0.05;
  const whole = Math.floor(value);
  const decimal = value - whole;

  // Render simple number if no fraction part
  if (Math.abs(decimal) < tolerance) {
    return whole > 0 ? <span>{whole}</span> : null;
  }

  const fractions = [
    { dec: 0.125, num: 1, den: 8 },
    { dec: 0.25, num: 1, den: 4 },
    { dec: 0.333, num: 1, den: 3 },
    { dec: 0.5, num: 1, den: 2 },
    { dec: 0.666, num: 2, den: 3 },
    { dec: 0.75, num: 3, den: 4 },
  ];

  let match = null;
  for (let f of fractions) {
    if (Math.abs(decimal - f.dec) < tolerance) {
      match = f;
      break;
    }
  }

  if (match) {
    return (
      <span className="inline-flex flex-row items-baseline whitespace-nowrap">
        {whole > 0 && <span className="mr-1">{whole}</span>}
        <span className="inline-flex items-baseline text-primary">
          <sup className="text-[0.65em]" style={{ top: "-0.3em" }}>
            {match.num}
          </sup>
          <span className="mx-[1px] text-[0.8em]">&frasl;</span>
          <sub className="text-[0.65em]" style={{ bottom: "-0.1em" }}>
            {match.den}
          </sub>
        </span>
      </span>
    );
  }

  // Fallback for non-standard decimals
  return <span>{parseFloat(value.toFixed(2))}</span>;
};

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ml-2 border border-transparent"
    style={{
      backgroundColor: `${color}20`, // 20% opacity background
      color: color || "#666",
      borderColor: `${color}30`, // Subtle border
    }}
  >
    {label}
  </span>
);

const IngredientRow = ({
  ingredient,
  scale,
  isChecked,
  onToggle,
}: {
  ingredient: RecipeIngredient;
  scale: number;
  isChecked: boolean;
  onToggle: (id: string) => void;
}) => {
  const scaledQty = (ingredient.quantity ?? 0) * scale;

  // Logic for Pluralization & Abbreviations
  let unitDisplay = "";
  let foodDisplay = "";

  if (ingredient.unit) {
    // Check for abbreviation first
    if (ingredient.unit.useAbbreviation && ingredient.unit.abbreviation) {
      unitDisplay = ingredient.unit.abbreviation;
    } else {
      // Fallback to standard plural/singular name
      unitDisplay =
        scaledQty > 1 && ingredient.unit.pluralName
          ? ingredient.unit.pluralName
          : ingredient.unit.name;
    }
  }

  foodDisplay =
    scaledQty > 1 && ingredient.food?.pluralName
      ? ingredient.food.pluralName
      : ingredient.food?.name || "";

  return (
    <div
      onClick={() => ingredient.referenceId && onToggle(ingredient.referenceId)} // Row click handler
      className={`group flex items-start py-2 transition-colors hover:bg-slate-50 cursor-pointer ${
        isChecked ? "opacity-50" : ""
      }`}
    >
      <div className="pt-1 pr-4">
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
            isChecked
              ? "bg-primary border-primary text-white"
              : "border-gray-300 group-hover:border-primary text-transparent"
          }`}
        >
          <IconCheck size={14} strokeWidth={3} />
        </div>
      </div>

      <div className="flex-1">
        <div
          className={`text-base ${
            isChecked ? "line-through text-gray-400" : "text-slate-800"
          }`}
        >
          <span className="font-semibold tabular-nums text-primary">
            <QuantityDisplay value={scaledQty} />
          </span>{" "}
          {unitDisplay && (
            <span className="text-slate-600">{unitDisplay} </span>
          )}
          <span className="font-medium">{foodDisplay}</span>
          {ingredient.food &&
            "label" in ingredient.food &&
            ingredient.food.label && (
              <Badge
                label={ingredient.food.label.name}
                color={ingredient.food.label.color || "#666"}
              />
            )}
        </div>

        {ingredient.note && (
          <p className="text-sm text-gray-500 italic mt-0.5">
            {ingredient.note}
          </p>
        )}
      </div>
    </div>
  );
};

interface RecipeIngredientProps {
  ingredients: RecipeIngredient[];
  baseScale: number;
}

export default function RecipeIngredients({
  ingredients,
  baseScale,
}: RecipeIngredientProps) {
  const [scale, setScale] = useState(1);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [copied, setCopied] = useState(false);

  // Memoize grouped sections so we don't recalculate on every render
  const sections = useMemo(() => groupIngredients(ingredients), [ingredients]);

  // Handle Checkbox Toggle
  const toggleIngredient = (id: string) => {
    const next = new Set(checkedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCheckedIds(next);
  };

  // Handle Add to List
  const addToList = () => {
    const selectedCount = checkedIds.size;
    let countToAdd = selectedCount;

    if (selectedCount === 0) {
      // If nothing selected, simulate adding ALL items
      console.log(
        "Adding all items to list:",
        ingredients.map((i) => i.referenceId)
      );
      countToAdd = ingredients.length;
    } else {
      // Add only selected
      console.log("Adding items to list:", Array.from(checkedIds));
    }

    alert(
      `Added ${countToAdd} ingredient${
        countToAdd > 1 ? "s" : ""
      } to your shopping list!`
    );
    setCheckedIds(new Set()); // Reset selection
  };

  // Handle Copy to Clipboard
  const handleCopy = () => {
    let copyText = `Ingredients (Scaled ${scale}x)\n\n`;

    sections.forEach((section) => {
      if (section.title) {
        copyText += `${section.title.toUpperCase()}\n`;
      }

      section.items.forEach((item) => {
        const qty = (item.quantity ?? 0) * scale;
        const formattedQty = formatQuantityForClipboard(qty); // Use Unicode for text copy

        let unit = "";
        if (item.unit) {
          // Check for abbreviation first
          if (item.unit.useAbbreviation && item.unit.abbreviation) {
            unit = item.unit.abbreviation;
          } else {
            // Fallback to standard logic
            unit =
              qty > 1 && item.unit.pluralName
                ? item.unit.pluralName
                : item.unit.name;
          }
        }

        let food =
          qty > 1 && item.food?.pluralName
            ? item.food.pluralName
            : item.food?.name || "";

        copyText += `- ${formattedQty} ${unit ? unit + " " : ""}${food}`;
        if (item.note) copyText += ` (${item.note})`;
        copyText += `\n`;
      });
      copyText += `\n`;
    });

    // Use modern clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(copyText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      // Fallback for older browsers or iframes without perm
      const textArea = document.createElement("textarea");
      textArea.value = copyText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate total ingredients count for display
  const totalIngredients = ingredients.length;
  const selectedCount = checkedIds.size;

  return (
    <div className="md:w-1/3 flex flex-col rounded">
      {/* Header Section */}
      <div className="">
        <div className="flex flex-row justify-between gap-4 mb-6 overflow:hidden">
          <h2 className="w-full text-2xl font-bold text-slate-800 flex items-center justify-between gap-1">
            Ingredients
            <span className="text-xs font-normal text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              {totalIngredients} items
            </span>
          </h2>

          {/* TODO: Add Scale */}
          {/* Scale Controls
          <div className="print:hidden flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setScale((s) => Math.max(0.25, s - 0.25))}
              className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600 disabled:opacity-30"
              disabled={scale <= 0.25}
              title="Decrease servings"
            >
              <IconMinus size={16} />
            </button>
            <div className="px-3 min-w-[3rem] text-center font-semibold text-sm text-slate-700">
              {scale}x
            </div>
            <button
              onClick={() => setScale((s) => s + 0.25)}
              className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
              title="Increase servings"
            >
              <IconPlus size={16} />
            </button>
          </div> */}
        </div>

        {/* Action Bar */}
        <div className="print:hidden flex items-center justify-between border-b pb-2 text-sm ">
          <button
            onClick={addToList}
            className="flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors cursor-pointer"
          >
            <IconShoppingCart size={16} />
            {selectedCount > 0
              ? `Add ${selectedCount} items to list`
              : "Add to shopping list"}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {copied ? (
              <IconCheck size={16} className="text-primary" />
            ) : (
              <IconCopy size={16} />
            )}
            {copied ? "Copied!" : ""}
          </button>
        </div>
      </div>

      {/* Ingredients List */}
      <div className="">
        {sections.map((section, idx) => (
          <div key={idx} className="">
            {section.title && section.title != "Ingredients" && (
              <div className="bg-slate-50/50 py-3 font-bold text-slate-700 text-sm tracking-wide uppercase border-b border-gray-100 sticky top-0 backdrop-blur-sm">
                {section.title}
              </div>
            )}

            {/* Items */}
            <div className="">
              {section.items.map((ing) => (
                <IngredientRow
                  key={ing.referenceId}
                  ingredient={ing}
                  scale={scale}
                  isChecked={checkedIds.has(ing.referenceId)}
                  onToggle={toggleIngredient}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="print:hidden bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          Tap items to check them off as you go.
        </p>
      </div>
    </div>
  );
}
