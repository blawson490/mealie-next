"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FaviconProps {
  /** The URL to extract the domain from */
  url: string;
  /** Size variant (sm: 16px, default: 24px, lg: 32px) */
  size?: "sm" | "default" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Alt text for the image */
  alt?: string;
}

const sizeMap = {
  sm: 16,
  default: 24,
  lg: 32,
};

/**
 * Generates a favicon image from a given URL using the Vemetric favicon service
 * Falls back to Google's favicon service if Vemetric is unavailable
 * @param url - The URL to extract the domain from (e.g., https://example.com)
 * @param size - Size variant (sm, default, lg)
 * @param className - Additional CSS classes to apply to the image
 * @param alt - Alt text for the image
 */
export function Favicon({
  url,
  size = "default",
  className,
  alt = "favicon",
}: FaviconProps) {
  const [useGoogleFallback, setUseGoogleFallback] = useState(false);

  // Extract domain from URL
  const getDomain = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname || urlString;
    } catch {
      // If URL parsing fails, return the string as-is (might already be a domain)
      return urlString;
    }
  };

  const domain = getDomain(url);
  const pixelSize = sizeMap[size];

  // Primary: Vemetric, Fallback: Google
  const vemetricUrl = `https://favicon.vemetric.com/${domain}`;
  const googleUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    domain
  )}&sz=${pixelSize}`;

  const faviconUrl = useGoogleFallback ? googleUrl : vemetricUrl;

  return (
    <img
      src={faviconUrl}
      alt={alt}
      className={cn("inline-block aspect-square", className)}
      style={{
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
      }}
      onError={() => {
        if (!useGoogleFallback) {
          setUseGoogleFallback(true);
        }
      }}
    />
  );
}
