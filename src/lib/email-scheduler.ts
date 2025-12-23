class EmailScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 60000; // Check every minute

  start() {
    if (this.intervalId) {
      console.log('Email scheduler is already running');
      return;
    }

    console.log('Starting email scheduler...');
    
    // Check immediately on start
    this.checkScheduledEmails();
    
    // Then check periodically
    this.intervalId = setInterval(() => {
      this.checkScheduledEmails();
    }, this.CHECK_INTERVAL);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Email scheduler stopped');
    }
  }

  private async checkScheduledEmails() {
    try {
      // Use relative URL since we're in the same app
      const response = await fetch('/api/send-scheduled', {
        method: 'POST',
        cache: 'no-store', // Ensure we don't cache this request
      });

      if (!response.ok) {
        console.error('Failed to check scheduled emails:', response.statusText);
        return;
      }

      const result = await response.json();
      
      if (result.results && result.results.length > 0) {
        console.log(`Processed ${result.results.length} scheduled emails:`, result.results);
      }
    } catch (error) {
      console.error('Error checking scheduled emails:', error);
    }
  }
}

// Create singleton instance
const emailScheduler = new EmailScheduler();

export default emailScheduler;
