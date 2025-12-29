import { RecipeNote } from "@/lib/types/recipe";
import MealieMarkdown from "./mealie-markdown";
import { ChefHat, Quote } from "lucide-react";

interface RecipeNotesProps {
  notes: RecipeNote[];
}

export default function RecipeNotes({ notes }: RecipeNotesProps) {
  if (!notes || notes.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 overflow-hidden rounded-xl bg-card shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Header Section */}
      <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50/50 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full text-primary">
          <ChefHat size={20} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Chef's Notes
        </h2>
      </div>

      {/* Notes Container */}
      <div className="space-y-4 p-4">
        {notes.map((note, index) => (
          <div
            key={index}
            className="group relative rounded-xl border border-gray-100 bg-gray-50 p-5 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800/40"
          >
            {/* Decorative Quote Icon (Optional visual flair) */}
            <Quote className="absolute right-4 top-4 h-8 w-8 text-gray-200 opacity-50 dark:text-gray-700" />

            {note.title && (
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                {note.title}
              </h3>
            )}

            <div className="prose prose-sm dark:prose-invert relative z-10 text-gray-600 dark:text-gray-300">
              <MealieMarkdown content={note.text} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
