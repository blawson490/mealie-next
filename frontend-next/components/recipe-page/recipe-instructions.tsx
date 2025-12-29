"use client";
import { RecipeIngredient, RecipeStep } from "@/lib/types/recipe";
import {
  IconCircle,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

const parseMarkdown = (text: string) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" class="text-blue-600 hover:underline inline-flex items-center gap-1">$1</a>'
    )
    .replace(/\n/g, "<br />");
};

interface RecipeInstructionsProps {
  instructions: RecipeStep[];
  ingredients: RecipeIngredient[];
}

export default function RecipeInstructions({
  instructions,
  ingredients,
}: RecipeInstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Group steps into sets based on the "title" property
  const instructionSets = useMemo(() => {
    const sets = [];
    let currentSet = null;

    instructions.forEach((step) => {
      if (step.title) {
        currentSet = { title: step.title, steps: [step] };
        sets.push(currentSet);
      } else {
        if (!currentSet) {
          currentSet = { title: "General Instructions", steps: [] };
          sets.push(currentSet);
        }
        currentSet.steps.push(step);
      }
    });
    return sets;
  }, [instructions]);

  const getIngredientByRef = (refId) => {
    return ingredients.find((ing) => ing.referenceId === refId);
  };

  const toggleStep = (id) => {
    const newSet = new Set(completedSteps);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setCompletedSteps(newSet);
  };

  if (!instructions.length) return null;

  return (
    <div className="w-full space-y-10">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-between gap-1">
        Instructions
        <span className="text-xs font-normal text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          {instructions.length} steps
        </span>
      </h2>
      {instructionSets.map((set, setIdx) => (
        <section key={setIdx} className="space-y-4">
          {/* Section Heading */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
            <div className="h-6 w-1 bg-orange-500 rounded-full" />
            <h3 className="font-bold uppercase tracking-wider text-slate-700">
              {set.title}
            </h3>
          </div>

          <div className="grid gap-4">
            {set.steps.map((step, stepIdx) => {
              const isCompleted = completedSteps.has(step.id);
              return (
                <div
                  key={step.id}
                  className={`flex gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    isCompleted
                      ? "bg-slate-50 border-slate-100 opacity-60"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  {/* Interaction Column */}
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={`flex-shrink-0 mt-1 h-6 w-6 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted
                        ? "text-green-500"
                        : "text-slate-300 hover:text-orange-500"
                    }`}
                  >
                    {isCompleted ? (
                      <IconCircleCheck size={24} />
                    ) : (
                      <IconCircle size={24} />
                    )}
                  </button>

                  {/* Content Column */}
                  <div className="flex-1 space-y-3">
                    {step.summary && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                        <IconInfoCircle size={12} />
                        {step.summary}
                      </span>
                    )}

                    <div
                      className={`text-slate-800 leading-relaxed prose prose-sm max-w-none ${
                        isCompleted ? "line-through text-slate-400" : ""
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdown(step.text),
                      }}
                    />

                    {/* Contextual Ingredients List */}
                    {step.ingredientReferences?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {step.ingredientReferences.map((ref) => {
                          const ingredient = getIngredientByRef(
                            ref.referenceId
                          );
                          if (!ingredient) return null;
                          return (
                            <span
                              key={ref.referenceId}
                              className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                            >
                              {ingredient.display}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Step Marker (Optional desktop-only indicator) */}
                  <div className="hidden md:block text-[10px] font-black text-slate-200 select-none">
                    {setIdx + 1}.{stepIdx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
