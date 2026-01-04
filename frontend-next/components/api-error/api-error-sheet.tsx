import { useMemo, useState } from "react";
import {
  IconAlertCircle,
  IconApi,
  IconArrowsRightLeft,
  IconCheck,
  IconCode,
  IconCopy,
  IconDatabase,
  IconLink,
  IconServer,
  IconTerminal,
  IconWorld,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import JsonSection from "./components/json-section";
import HeadersSection from "./components/header-section";

/**
 * ----------------------------------------------------------------------------
 * TYPES
 * ----------------------------------------------------------------------------
 */

// Basic shape of your debug object to replace 'any'
interface DebugRequest {
  method?: string;
  url?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  params?: any;
  query?: any;
  searchParams?: any;
  body?: any;
  data?: any;
}

interface DebugResponse {
  status?: number;
  headers?: Record<string, string>;
  data?: any;
}

interface ApiErrorDetails {
  debug?: {
    request?: DebugRequest;
    response?: DebugResponse;
  };
  details?: {
    plugins?: string[];
    metadata?: string[];
    webhooks?: string[];
  };
}

interface ApiErrorSheetProps {
  error: ApiErrorDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * ----------------------------------------------------------------------------
 * LOGIC HOOK (The "Brain")
 * ----------------------------------------------------------------------------
 */

function useApiDebug(error: ApiErrorDetails | null) {
  return useMemo(() => {
    if (!error) return null;

    const { debug, details } = error;
    const request = debug?.request || {};
    const response = debug?.response;

    // Normalize Data
    const method = (request.method || "GET").toUpperCase();
    const url = request.url || "/";
    const baseURL =
      request.baseURL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const fullUrl = baseURL ? `${baseURL.replace(/\/$/, "")}${url}` : url;
    const status = response?.status || 0;

    // Normalize Params
    const params =
      request.params || request.query || request.searchParams || null;

    // Generate cURL
    let curl = `curl -X ${method} "${fullUrl}"`;
    if (request.headers) {
      Object.entries(request.headers).forEach(([key, value]) => {
        curl += ` \\\n  -H "${key}: ${value}"`;
      });
    }
    const bodyData = request.body || request.data;
    if (bodyData) {
      try {
        const serialized =
          typeof bodyData === "string" ? bodyData : JSON.stringify(bodyData);
        curl += ` \\\n  -d '${serialized.replace(/'/g, "'\\''")}'`;
      } catch (e) {
        curl += ` \\\n  -d '[Complex Data]'`;
      }
    }

    // Generate "OpenAPI-Style" Log
    // We intentionally use 'payload' instead of 'example' or 'schema'
    // so it reads like a log of the actual event.
    const apiLog = {
      [url]: {
        [method.toLowerCase()]: {
          summary: "Captured Request",
          timestamp: new Date().toISOString(),
          headers: request.headers, // Direct header dump is often cleaner than param list
          requestBody: bodyData
            ? {
                content: {
                  "application/json": {
                    payload: bodyData, // <--- The actual data, plainly labeled
                  },
                },
              }
            : undefined,
          responses: {
            [status || "No Status"]: {
              description: "Server Response",
              content: {
                "application/json": {
                  payload: response?.data || {}, // <--- The actual response
                },
              },
            },
          },
        },
      },
    };

    return {
      method,
      url,
      baseURL,
      status,
      params,
      request,
      response,
      details,
      curlCommand: curl,
      openApiJson: JSON.stringify(apiLog, null, 2),
    };
  }, [error]);
}

/**
 * ----------------------------------------------------------------------------
 * HELPER COMPONENTS
 * ----------------------------------------------------------------------------
 */

// Reusable Copy Button to handle the "Copied!" state logic
function CopyButton({
  text,
  label = "Copy",
  variant = "ghost",
  className,
}: {
  text: string;
  label?: React.ReactNode;
  variant?: "outline" | "ghost" | "default";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <IconCheck className="w-4 h-4 text-green-600 mr-2" />
      ) : (
        <IconCopy className="w-4 h-4 mr-2" />
      )}
      {copied ? <span className="text-green-600">Copied</span> : label}
    </Button>
  );
}

/**
 * ----------------------------------------------------------------------------
 * MAIN COMPONENT
 * ----------------------------------------------------------------------------
 */

export function ApiErrorSheet({
  error,
  open,
  onOpenChange,
}: ApiErrorSheetProps) {
  const data = useApiDebug(error);

  if (!data) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl flex flex-col h-full p-0 gap-0 bg-background">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 text-xl font-semibold">
            <IconAlertCircle className="w-5 h-5 text-destructive" />
            Error Details
          </SheetTitle>

          <CopyButton
            text={data.openApiJson}
            label="Copy JSON"
            variant="outline"
            className="h-8 mr-6"
          />
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* 1. Status & Method Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatusBadge label="Request Method" value={data.method} />
              <StatusBadge
                label="Status Code"
                value={data.status}
                variant={
                  data.status >= 200 && data.status < 300
                    ? "success"
                    : "destructive"
                }
              />
            </div>

            <Separator />

            {/* 3. Request Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                label="Endpoint"
                value={data.url}
                icon={<IconLink className="w-3.5 h-3.5" />}
                className="md:col-span-2"
                mono
              />
              <InfoCard
                label="Base URL"
                value={data.baseURL}
                icon={<IconWorld className="w-3.5 h-3.5" />}
                mono
              />
              <InfoCard
                label="Params"
                value={data.params}
                icon={<IconDatabase className="w-3.5 h-3.5" />}
                mono
              />

              <div className="md:col-span-2">
                <CurlSection command={data.curlCommand} />
              </div>
            </div>

            <Separator />

            {/* 4. Tabs */}
            <Tabs defaultValue="request" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request" className="flex gap-2">
                  <IconArrowsRightLeft className="w-4 h-4" /> Request
                </TabsTrigger>
                <TabsTrigger value="response" className="flex gap-2">
                  <IconServer className="w-4 h-4" /> Response
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="request"
                className="mt-4 space-y-4 animate-in fade-in-50"
              >
                <HeadersSection
                  title="Request Headers"
                  headers={data.request.headers}
                  icon={<IconCode className="w-4 h-4" />}
                />
                <JsonSection
                  title="Request Body"
                  data={data.request.body || data.request.data}
                  icon={<IconDatabase className="w-4 h-4" />}
                />
              </TabsContent>

              <TabsContent
                value="response"
                className="mt-4 space-y-4 animate-in fade-in-50"
              >
                {data.response ? (
                  <>
                    <HeadersSection
                      title="Response Headers"
                      headers={data.response.headers}
                      icon={<IconCode className="w-4 h-4" />}
                    />
                    <JsonSection
                      title="Response Body"
                      data={data.response.data}
                      icon={<IconDatabase className="w-4 h-4" />}
                    />
                  </>
                ) : (
                  <EmptyResponseState />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * ----------------------------------------------------------------------------
 * SUB-COMPONENTS
 * ----------------------------------------------------------------------------
 */

function StatusBadge({
  label,
  value,
  variant = "method",
}: {
  label: string;
  value: any;
  variant?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}:
      </span>
      {/* Note: Ensure your Badge component actually accepts these variants, or map them to standard variants */}
      <Badge variant={variant as any} className="rounded-sm text-xs w-fit">
        {value || "---"}
      </Badge>
    </div>
  );
}

function InfoCard({
  label,
  value,
  className,
  icon,
  mono,
}: {
  label: string;
  value: any;
  className?: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  if (!value || (typeof value === "object" && Object.keys(value).length === 0))
    return null;

  // Pretty print objects slightly better than [object Object]
  const displayValue =
    typeof value === "object" ? JSON.stringify(value, null, 1) : String(value);

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 py-2 rounded-lg bg-card text-card-foreground",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {icon} {label}
      </div>
      <div
        className={cn(
          "text-sm truncate leading-tight",
          mono && "font-mono text-xs"
        )}
      >
        {displayValue}
      </div>
    </div>
  );
}

function CurlSection({ command }: { command: string }) {
  return (
    <div className="flex flex-col gap-1.5 group">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <IconTerminal className="w-3.5 h-3.5" /> cURL Command
        </span>
        <CopyButton text={command} label="Copy" className="h-6 px-2 text-xs" />
      </div>
      <div className="relative rounded-md border bg-muted/50 p-3 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-32 text-muted-foreground">
        {command}
      </div>
    </div>
  );
}

function EmptyResponseState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
      <IconAlertCircle className="w-8 h-8 mb-2 opacity-50" />
      <span className="text-sm font-medium">
        No response received (Network Error)
      </span>
    </div>
  );
}
