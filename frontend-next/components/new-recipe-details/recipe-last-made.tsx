import {
  IconHistory,
  IconPlus,
  IconNote, // Swapped to a note icon for the specific note
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function RecipeLastMade({
  lastMade,
  note,
}: {
  lastMade?: string;
  note?: string;
}) {
  function getRelativeTime(dateString?: string) {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Refined logic: Green only for very recent (7 days), otherwise slate-700
    const isRecent = diffInDays < 7;
    const color = isRecent ? "text-green-600" : "text-slate-700";

    if (diffInDays === 0) return { text: "Today", color: "text-green-600" };
    if (diffInDays === 1) return { text: "Yesterday", color: "text-green-600" };

    if (diffInDays < 7) {
      return { text: `${diffInDays} days ago`, color };
    }
    // ... rest of your logic
    const months = Math.floor(diffInDays / 30);
    return {
      text:
        months <= 0
          ? diffInDays < 30
            ? `${Math.floor(diffInDays / 7)} weeks ago`
            : "A while ago"
          : `${months} months ago`,
      color: "text-slate-500",
    };
  }

  const relative = getRelativeTime(lastMade);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
        <IconHistory className="text-orange-500" size={20} />
        <span className="font-bold text-slate-900">History</span>
      </div>

      <div className="px-4 py-2 flex-1 flex flex-col justify-center">
        {lastMade && relative ? (
          <div>
            {/* Date Grouping */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Last Cooked
                </div>
                <div
                  className={cn(
                    "text-xl font-black tracking-tight",
                    relative.color
                  )}
                >
                  {relative.text}
                </div>
              </div>
              <div className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                {new Date(lastMade).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </div>
            </div>

            {/* Note: Removed the box, kept it clean with a subtle border */}
            {note && (
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <IconNote className="text-slate-300 shrink-0" size={16} />
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  "{note}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-2 gap-4">
            {/* Empty state content */}
            <span className="text-sm font-medium text-slate-400">
              Not made yet
            </span>
            <Button
              variant="outline"
              className="justify-start pl-3 gap-2 h-9 text-slate-600 hover:text-primary-foreground hover:bg-primary hover:border-0 transition-colors rounded-lg"
            >
              <IconPlus size={15} />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Add Entry
              </span>
            </Button>
          </div>
        )}
      </div>
      {lastMade && (
        <div className="border-t border-dashed border-slate-200 p-2 mt-auto">
          <Button
            variant="ghost"
            className="justify-start pl-3 gap-2 h-9 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors rounded-lg"
          >
            <IconPlus size={15} />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Add Entry
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
