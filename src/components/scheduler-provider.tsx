'use client';

import { useEffect, useRef } from 'react';

export default function SchedulerProvider() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only start scheduler in browser environment
    if (typeof window !== 'undefined') {
      console.log('Starting browser-based email scheduler...');
      
      // Check immediately on start
      const checkScheduledEmails = async () => {
        try {
          const response = await fetch('/api/send-scheduled', {
            method: 'POST',
            cache: 'no-store',
          });

          if (response.ok) {
            const result = await response.json();
            if (result.results && result.results.length > 0) {
              console.log(`Browser scheduler processed ${result.results.length} emails:`, result.results);
            }
          }
        } catch (error) {
          console.error('Browser scheduler error:', error);
        }
      };

      // Check immediately
      checkScheduledEmails();
      
      // Then check every 2 minutes (more frequent than cron job)
      intervalRef.current = setInterval(checkScheduledEmails, 2 * 60 * 1000);

      // Also check when page becomes visible (user returns to tab)
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          checkScheduledEmails();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Cleanup on unmount
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
