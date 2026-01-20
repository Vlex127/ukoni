"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [hasPosted, setHasPosted] = useState(false);

    useEffect(() => {
        // Prevent duplicate firing in strict mode or quick re-renders
        if (hasPosted) return;

        const trackPageView = async () => {
            try {
                await fetch(getApiUrl("analytics"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        event: "page_view",
                        metadata: {
                            path: pathname,
                            search: searchParams.toString(),
                            referrer: document.referrer || 'direct'
                        }
                    }),
                });
                setHasPosted(true);
            } catch (error) {
                console.error("Failed to track page view:", error);
            }
        };

        trackPageView();

        // Reset posted state when path changes to allow tracking the new page
        return () => setHasPosted(false);
    }, [pathname, searchParams]);

    return null;
}
