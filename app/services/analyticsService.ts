interface SearchAnalytics {
  query: string;
  category: string;
  timestamp: number;
  resultsCount: number;
  filters?: Record<string, any>;
}

class SearchAnalyticsService {
  private static readonly STORAGE_KEY = 'search-analytics';
  private static readonly MAX_ENTRIES = 100;

  static async logSearch(data: SearchAnalytics) {
    try {
      // Store locally
      const analytics = this.getStoredAnalytics();
      analytics.unshift(data);
      
      // Keep only last MAX_ENTRIES
      if (analytics.length > this.MAX_ENTRIES) {
        analytics.length = this.MAX_ENTRIES;
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(analytics));

      // Send to server if needed
      await fetch('/api/analytics/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Failed to log search:', error);
    }
  }

  static getStoredAnalytics(): SearchAnalytics[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getPopularSearches(): { query: string; count: number }[] {
    const analytics = this.getStoredAnalytics();
    const counts = analytics.reduce((acc, curr) => {
      acc[curr.query] = (acc[curr.query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}

export default SearchAnalyticsService; 