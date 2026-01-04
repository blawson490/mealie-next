import { useState, useMemo } from "react";
import {
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconCopy,
  IconSearch,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
const Highlight = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={i}
            className="bg-yellow-200 dark:bg-yellow-900/60 rounded-[1px] text-foreground"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default function JsonSection({
  title,
  data,
  icon,
}: {
  title: string;
  data: any;
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const lowerQuery = searchQuery.toLowerCase();

    const filterFn = (item: any): any => {
      if (item === null || item === undefined) return undefined;
      if (typeof item !== "object") {
        return String(item).toLowerCase().includes(lowerQuery)
          ? item
          : undefined;
      }

      if (Array.isArray(item)) {
        const filteredArr = item
          .map((child) => filterFn(child))
          .filter((child) => child !== undefined);
        return filteredArr.length > 0 ? filteredArr : undefined;
      }

      const filteredObj: Record<string, any> = {};
      let hasMatch = false;

      Object.entries(item).forEach(([key, val]) => {
        const keyMatches = key.toLowerCase().includes(lowerQuery);

        if (keyMatches) {
          filteredObj[key] = val;
          hasMatch = true;
        } else {
          const filteredVal = filterFn(val);
          if (filteredVal !== undefined) {
            filteredObj[key] = filteredVal;
            hasMatch = true;
          }
        }
      });

      return hasMatch ? filteredObj : undefined;
    };

    if (typeof data !== "object") {
      return String(data).toLowerCase().includes(lowerQuery) ? data : null;
    }

    return filterFn(data);
  }, [data, searchQuery]);

  const displayString = useMemo(() => {
    const source = searchQuery ? filteredData : data;

    if (source === undefined || source === null) return "";

    if (typeof source === "string") return source;

    return JSON.stringify(source, null, 2);
  }, [data, filteredData, searchQuery]);

  if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
    return null;
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy =
      typeof data === "string" ? data : JSON.stringify(data, null, 2);

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden transition-all">
      <div className="flex items-center justify-between p-2 px-4 bg-muted/30 border-b">
        <div
          className="flex items-center gap-2 cursor-pointer grow py-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-muted-foreground">{icon}</span>
          <h4 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/80">
            {title}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {isOpen && (
            <div className="relative hidden sm:block">
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/70" />
              <input
                className="bg-background border rounded-lg pl-8 pr-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-32 focus:w-48 transition-all"
                placeholder="Search JSON..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleCopy}
          >
            {copied ? (
              <IconCheck className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <IconCopy className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <IconChevronDown className="h-4 w-4" />
            ) : (
              <IconChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="relative group">
          <div className="max-h-[500px] overflow-auto p-4 bg-muted/10">
            {(!displayString || displayString === "undefined") &&
            searchQuery ? (
              <div className="text-xs text-muted-foreground italic">
                No matches found for "{searchQuery}"
              </div>
            ) : (
              <pre className="text-xs font-mono leading-relaxed text-muted-foreground whitespace-pre-wrap break-all">
                <Highlight text={displayString} query={searchQuery} />
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
