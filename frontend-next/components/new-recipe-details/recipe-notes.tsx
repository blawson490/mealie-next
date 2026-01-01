"use client";
import { RecipeNote } from "@/lib/types/recipe";
import MealieMarkdown from "./mealie-markdown";
import { IconChefHat, IconQuote, IconPlus } from "@tabler/icons-react";
import { Button } from "../ui/button";

interface RecipeNotesProps {
  notes: RecipeNote[];
}

export default function RecipeNotes({ notes }: RecipeNotesProps) {
  const hasNotes = notes && notes.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
        <IconChefHat className="text-orange-500" size={20} />
        <span className="font-bold text-slate-900">Chef's Notes</span>
      </div>

      <div className="p-0 flex-1">
        {hasNotes ? (
          <div className="divide-y divide-slate-100">
            {notes.map((note, index) => (
              // CHANGE 1: Remove bg-amber-50. Use white.
              // Add pl-5 to align text, but no colored box.
              <div
                key={index}
                className="group relative bg-white p-5 transition-all"
              >
                {/* Visual Accent: A subtle colored bar on the left instead of a full background */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-400/50 group-hover:bg-amber-500 transition-colors" />

                {note.title && (
                  <h3 className="mb-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                    {note.title}
                  </h3>
                )}

                {/* CHANGE 2: Aggressively clamp prose headers */}
                <div
                  className="
                  text-sm text-slate-700 leading-relaxed
                  prose prose-sm max-w-none

                  /* Force all headers to look like small bold text */
                  prose-headings:text-slate-900 prose-headings:font-bold prose-headings:text-sm prose-headings:mt-2 prose-headings:mb-1
                  prose-h1:text-sm prose-h2:text-sm prose-h3:text-sm

                  prose-p:my-1 prose-p:leading-relaxed
                  prose-strong:text-slate-900 prose-strong:font-bold
                  prose-ul:my-2 prose-li:my-0
                "
                >
                  <MealieMarkdown content={note.text} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center text-center opacity-60 min-h-[100px]">
            <IconQuote size={24} className="text-slate-300 mb-2" />
            <span className="text-xs font-medium text-slate-400">
              No notes yet.
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-slate-200 p-2 mt-auto">
        <Button
          variant="ghost"
          className="justify-start pl-3 gap-2 h-9 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors rounded-lg"
        >
          <IconPlus size={15} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Add Note
          </span>
        </Button>
      </div>
    </div>
  );
}
