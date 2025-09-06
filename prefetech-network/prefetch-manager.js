class PrefetchManager {
    constructor() {
        this.cacheKey = 'portfolio_prefetch_cache';
        this.visitedKey = 'portfolio_visited';
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
        this.pagesToPrefetch = [
            { url: 'projects.html', priority: 'high' },
            { url: 'contact.html', priority: 'medium' }
        ];
        this.prefetchedPages = new Set();
        this.init();
    }

    init() {
        // Start prefetching after page is fully loaded and idle
        if (document.readyState === 'complete') {
            this.startPrefetching();
        } else {
            window.addEventListener('load', () => {
                // Wait for 2 seconds after page load to ensure main content is ready
                setTimeout(() => this.startPrefetching(), 2000);
            });
        }
    }

    async startPrefetching() {
        // Only prefetch on main page
        if (!this.isMainPage()) return;

        
        for (const page of this.pagesToPrefetch) {
            if (!this.prefetchedPages.has(page.url)) {
                await this.prefetchPage(page);
                // Small delay between prefetches to avoid overwhelming
                await this.delay(500);
            }
        }
    }

    isMainPage() {
        const path = window.location.pathname;
        return path === '/' || path.includes('index.html') || path.includes('index.html');
    }

    async prefetchPage(page) {
        try {
            // Check if already cached and fresh
            if (this.isCached(page.url)) {
                return;
            }


            // Create prefetch link
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page.url;
            link.as = 'document';
            document.head.appendChild(link);

            // Also fetch and cache the content
            const response = await fetch(page.url, {
                method: 'GET',
                cache: 'force-cache'
            });

            if (response.ok) {
                const content = await response.text();
                this.cacheContent(page.url, content);
                this.prefetchedPages.add(page.url);

                // Prefetch page-specific resources
                this.prefetchPageResources(content, page.url);
            }
        } catch (error) {
            console.warn(`❌ Failed to prefetch ${page.url}:`, error);
        }
    }

    prefetchPageResources(htmlContent, pageUrl) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Prefetch CSS files
        const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(link => {
            if (!link.href.includes('http')) {
                this.createPrefetchLink(link.getAttribute('href'), 'style');
            }
        });

        // Prefetch JS files
        const scripts = doc.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (!script.src.includes('http')) {
                this.createPrefetchLink(script.getAttribute('src'), 'script');
            }
        });

        // Prefetch images
        const images = doc.querySelectorAll('img[src]');
        Array.from(images).slice(0, 5).forEach(img => { // Limit to first 5 images
            if (!img.src.includes('http')) {
                this.createPrefetchLink(img.getAttribute('src'), 'image');
            }
        });
    }

    createPrefetchLink(href, asType) {
        if (!href || this.prefetchedPages.has(href)) return;

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        link.as = asType;
        document.head.appendChild(link);
        this.prefetchedPages.add(href);
    }

    cacheContent(url, content) {
        try {
            const cache = this.getCache();
            cache[url] = {
                content: content,
                timestamp: Date.now(),
                expires: Date.now() + this.cacheExpiry
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cache));
        } catch (error) {
            console.warn('Failed to cache content:', error);
        }
    }

    isCached(url) {
        const cache = this.getCache();
        const item = cache[url];
        return item && item.expires > Date.now();
    }

    getCachedContent(url) {
        const cache = this.getCache();
        const item = cache[url];
        if (item && item.expires > Date.now()) {
            return item.content;
        }
        return null;
    }

    getCache() {
        try {
            const cache = localStorage.getItem(this.cacheKey);
            return cache ? JSON.parse(cache) : {};
        } catch {
            return {};
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Method to check if this is first visit
    isFirstVisit() {
        const visited = localStorage.getItem(this.visitedKey);
        if (!visited) {
            localStorage.setItem(this.visitedKey, Date.now().toString());
            return true;
        }
        return false;
    }

    // Clear cache if needed
    clearCache() {
        localStorage.removeItem(this.cacheKey);
    }
}

// Initialize prefetch manager
window.prefetchManager = new PrefetchManager();
