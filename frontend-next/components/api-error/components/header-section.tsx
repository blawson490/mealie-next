import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconCopy,
  IconSearch,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

const tryParse = (val: any) => {
  if (typeof val !== "string") return val;
  const trimmed = val.trim();
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return val;
    }
  }
  return val;
};

const Highlight = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-800/50 text-foreground rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

function NestedValue({
  value,
  query,
  depth = 0,
}: {
  value: any;
  query: string;
  depth?: number;
}) {
  // CRITICAL: Try to parse the value in case it is a stringified JSON object (like in your screenshot)
  const parsedValue = tryParse(value);
  const isPrimitive = parsedValue === null || typeof parsedValue !== "object";

  if (isPrimitive) {
    let displayValue = String(parsedValue);
    let style = "text-[11px] font-mono break-all leading-relaxed";

    if (parsedValue === null || parsedValue === undefined) {
      displayValue = "null";
      style = cn(style, "italic text-muted-foreground/50");
    } else if (typeof parsedValue === "boolean") {
      style = cn(style, "font-bold text-orange-600 dark:text-orange-400");
    } else if (typeof parsedValue === "number") {
      style = cn(style, "text-emerald-600 dark:text-emerald-400");
    } else {
      style = cn(style, "text-foreground");
      // Don't add extra quotes if it's already a string we failed to parse
      displayValue = typeof value === "string" ? value : `"${value}"`;
    }

    return (
      <span className={style}>
        <Highlight text={displayValue} query={query} />
      </span>
    );
  }

  if (Array.isArray(parsedValue)) {
    return (
      <div className="flex flex-col gap-1.5 mt-1">
        {parsedValue.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-[10px] text-muted-foreground/40 font-mono mt-0.5 shrink-0">
              [{index}]
            </span>
            <div className="pl-2 border-l border-border/60 grow">
              <NestedValue value={item} query={query} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      {Object.entries(parsedValue).map(([key, val]) => (
        <div key={key} className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-tight shrink-0">
              {key}:
            </span>
            {(typeof tryParse(val) !== "object" || val === null) && (
              <NestedValue value={val} query={query} depth={depth + 1} />
            )}
          </div>
          {typeof tryParse(val) === "object" && val !== null && (
            <div className="pl-3 ml-1 border-l border-primary/20 mt-1">
              <NestedValue value={val} query={query} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HeadersSection({
  title,
  headers,
  icon,
}: {
  title: string;
  headers: Record<string, any> | undefined;
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const headerEntries = useMemo(() => {
    if (!headers) return [];
    const entries = Object.entries(headers);
    if (!searchQuery) return entries;

    const lowerQuery = searchQuery.toLowerCase();
    return entries.filter(([key, val]) => {
      const keyMatch = key.toLowerCase().includes(lowerQuery);
      const valMatch = JSON.stringify(val).toLowerCase().includes(lowerQuery);
      return keyMatch || valMatch;
    });
  }, [headers, searchQuery]);

  if (!headers || Object.keys(headers).length === 0) return null;

  const handleCopy = () => {
    const text = JSON.stringify(headers, null, 2);
    navigator.clipboard.writeText(text);
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
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
        <div className="max-h-[500px] overflow-auto divide-y divide-border/40">
          {headerEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col md:flex-row p-3 hover:bg-muted/10 transition-colors gap-2"
            >
              <div className="md:w-1/3 shrink-0">
                <code className="text-[11px] font-bold text-blue-600 dark:text-blue-400 break-all leading-tight tracking-tight">
                  <Highlight text={key} query={searchQuery} />
                </code>
              </div>
              <div className="md:w-2/3 md:pl-4 border-l-0 md:border-l border-border/50">
                <NestedValue value={value} query={searchQuery} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
