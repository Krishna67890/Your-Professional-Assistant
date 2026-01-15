// Google Search Scraper Utility
export class GoogleSearchScraper {
  static async searchAndExtract(query) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
      
      // Use a CORS proxy
      const proxyUrl = 'https://corsproxy.io/?';
      const targetUrl = proxyUrl + encodeURIComponent(searchUrl);
      
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const html = await response.text();
      return {
        success: true,
        query: query,
        extractedInfo: this.extractInfoFromHTML(html, query)
      };
    } catch (error) {
      console.error('Scraping error:', error);
      return { success: false, query, extractedInfo: `I searched Google for "${query}" but encountered a connection issue.` };
    }
  }
  
  static extractInfoFromHTML(html, query) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Check various result containers
    const selectors = [
      '.kno-rdesc span', // Knowledge panel
      '.hgKElc',        // Featured snippet
      '.Z0LcW',         // Quick answer
      '.VwiC3b',        // Snippet
      '.gsrt span'      // Direct answer
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element && element.textContent.trim().length > 15) {
        return element.textContent.trim();
      }
    }
    
    return `I found several results for "${query}" on Google. Would you like me to open the search page for you?`;
  }
}
