"use client";

import { useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getApiUrl } from "@/lib/api";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const trackEvent = useCallback(async (event: string, metadata?: any) => {
        try {
            await fetch(getApiUrl('analytics'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event,
                    metadata: {
                        path: pathname,
                        ...metadata
                    }
                }),
            });
        } catch (error) {
            console.error('Failed to track analytics event:', error);
        }
    }, [pathname]);

    // Track page views
    useEffect(() => {
        trackEvent('page_view', {
            search: searchParams?.toString(),
            referrer: document.referrer
        });
    }, [pathname, searchParams, trackEvent]);

    // Track session heartbeat (every 30 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            // Only track if page is visible
            if (document.visibilityState === 'visible') {
                trackEvent('heartbeat');
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [trackEvent]);

    return null;
}
