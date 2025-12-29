import {
  IconCalendar,
  IconFlame,
  IconHistory,
  IconPlus,
} from "@tabler/icons-react";

export default function RecipeLastMade({
  lastMade,
  note,
}: {
  lastMade?: string;
  note?: string;
}) {
  function getRelativeTime(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }

  return (
    <div
      className={`relative bg-white rounded-xl transition-all duration-300 h-48 flex flex-col overflow-hidden shadow
          ${!lastMade ? "" : "border-dashed border-gray-300 bg-gray-50/30"}`}
    >
      {lastMade ? (
        /* STATE: Populated (Has been made) */
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-5 pt-4 flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary">
                <IconHistory size={14} />
              </span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Last Made
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 px-5 flex flex-col justify-center">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-2xl font-bold text-slate-800">
                {getRelativeTime(lastMade)}
              </h3>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
              <IconCalendar size={12} />
              <span>{lastMade}</span>
            </div>

            {/* Optional Note Section */}
            {note && (
              <div className="relative bg-orange-50 rounded-lg p-2.5 pl-3 border-l-2 border-orange-300">
                <p className="text-xs text-slate-700 italic leading-relaxed line-clamp-2">
                  "{note}"
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-auto border-t border-gray-100 bg-gray-50/50 px-4 py-2.5 flex justify-end">
            <button className="text-xs font-bold text-slate-600 hover:text-orange-600 bg-white border border-gray-200 hover:border-orange-200 px-3 py-1.5 rounded-md shadow-sm transition-all flex items-center gap-2">
              <IconFlame size={12} className="text-orange-500" />
              Log Today
            </button>
          </div>
        </div>
      ) : (
        /* STATE: Empty (Never made) */
        <div className="flex flex-col items-center justify-center h-full text-center p-5">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
            <IconCalendar size={18} />
          </div>
          <h3 className="text-slate-900 font-bold text-sm">Not made yet</h3>
          <p className="text-slate-500 text-xs mt-1 mb-4 px-4">
            No cooking history found for this recipe.
          </p>

          <button
            // onClick={() => setViewState('populated-simple')}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <IconPlus size={14} />
            Mark as Cooked
          </button>
        </div>
      )}
    </div>
  );
}
