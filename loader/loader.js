class PortfolioLoader {
  constructor() {
    this.htmlLoader = document.getElementById("html-loader");
    this.mainContent = document.getElementById("main-content-wrapper");
    this.htmlMessage = document.getElementById("html-loader-message");
    this.htmlPercentage = document.getElementById("html-percentage");
    this.isLoading = false;
    this.progressInterval = null;
    this.currentProgress = 0;
    this.isNavigating = false;
    this.init();
  }

  async init() {
    if (document.readyState === 'complete') {
      this.hideHtmlLoader();
      this.setupNavigation();
      return;
    }
    if (this.htmlLoader && this.shouldShowMainLoader()) {
      this.takeControlOfHtmlLoader();
    } else {
      this.hideHtmlLoader();
      this.setupNavigation();
    }
  }

  shouldShowMainLoader() {
  const isDirectAccess = !document.referrer ||
    document.referrer.indexOf(window.location.hostname) === -1;
  const isHome = this.isHomePage();
  
  // Always show loader for main page, regardless of visit status
  return true;
}

  takeControlOfHtmlLoader() {
  this.isLoading = true;
  const firstVisit = !localStorage.getItem("visitedBefore");
  
  if (this.isHomePage()) {
    if (firstVisit) {
      this.htmlMessage.textContent = "Welcome! Preparing your experience...";
    } else {
      this.htmlMessage.textContent = "Loading portfolio...";
    }
  } else if (this.isProjectsPage()) {
    this.htmlMessage.textContent = "Loading projects...";
  } else if (this.isContactPage()) {
    this.htmlMessage.textContent = "Loading contact...";
  } else {
    this.htmlMessage.textContent = "Loading page...";
  }
  
  this.runMainLoader();
}

isProjectsPage() {
  const path = window.location.pathname;
  return path.includes('projects.html');
}

isContactPage() {
  const path = window.location.pathname;
  return path.includes('contact.html');
}

  startMoonProgress(targetProgress = 100, duration = 2000) {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.currentProgress = 0;
    const increment = targetProgress / (duration / 50);
    this.progressInterval = setInterval(() => {
      this.currentProgress = Math.min(this.currentProgress + increment, targetProgress);
      if (this.htmlPercentage) {
        this.htmlPercentage.textContent = Math.round(this.currentProgress) + '%';
      }
      if (this.currentProgress >= targetProgress) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
    }, 50);
  }

  updateMoonProgress(progress) {
    if (this.htmlPercentage) {
      this.htmlPercentage.textContent = Math.round(progress) + '%';
    }
  }

  async runMainLoader() {
  const startTime = performance.now();

  const waitForSpeed = () => new Promise((resolve) => {
    if (typeof window.__netSpeedMbps === 'number') return resolve(window.__netSpeedMbps);
    const cached = parseFloat(localStorage.getItem('lastNetMbps'));
    if (!Number.isNaN(cached)) return resolve(cached);
    const onReady = (e) => resolve(e.detail?.mbps);
    window.addEventListener('network-speed:ready', onReady, { once: true });
    setTimeout(() => resolve(null), 300);
  });

    const measuredMbps = await waitForSpeed();

    const firstVisit = !localStorage.getItem("visitedBefore");

    let minimumDisplayTime;
    if (this.isHomePage() && firstVisit) {
      if (measuredMbps && measuredMbps < 1.5) minimumDisplayTime = 1200;
      else if (measuredMbps && measuredMbps < 5) minimumDisplayTime = 800;
      else minimumDisplayTime = 1200;
    } else {
      minimumDisplayTime = 800;
    }

    this.startMoonProgress(100, minimumDisplayTime);

    const assets = [
      ...Array.from(document.images),
      ...Array.from(document.querySelectorAll("link[rel='stylesheet']")),
      ...Array.from(document.querySelectorAll("script[src]"))
    ];

    let loaded = 0;
    const total = Math.max(assets.length, 1);
    let assetsLoaded = false;
    let windowLoaded = false;

    const updateProgress = () => {
      loaded++;
      const progressPercent = (loaded / total) * 100;
      const combinedProgress = Math.min(progressPercent, this.currentProgress);
      this.updateMoonProgress(combinedProgress);
      if (loaded >= total) {
        assetsLoaded = true;
        checkDone();
      }
    };

    const checkDone = () => {
  if (!windowLoaded) return;
  const elapsed = performance.now() - startTime;
  if (elapsed >= minimumDisplayTime) {
    this.finishMainLoader();
  } else {
    setTimeout(() => this.finishMainLoader(), minimumDisplayTime - elapsed);
  }
};


    assets.forEach(el => {
  if (document.readyState === "complete" || el.complete || el.readyState === "complete") {
    // Treat all as loaded if page already fully loaded (likely cached)
    updateProgress();
    return;
  }
  
  if (el.tagName === "IMG") {
    if (el.complete) {
      updateProgress();
    } else {
      el.addEventListener("load", updateProgress, { once: true });
      el.addEventListener("error", updateProgress, { once: true });
    }
  } else if (el.tagName === "LINK") {
    if (el.sheet) {
      updateProgress();
    } else {
      el.addEventListener("load", updateProgress, { once: true });
      el.addEventListener("error", updateProgress, { once: true });
    }
  } else if (el.tagName === "SCRIPT") {
    // No readyState reliable check - mark loaded if document is fully loaded
    if (document.readyState === "complete") {
      updateProgress();
    } else {
      el.addEventListener("load", updateProgress, { once: true });
      el.addEventListener("error", updateProgress, { once: true });
    }
  } else {
    // Fallback: listen for load/error
    el.addEventListener("load", updateProgress, { once: true });
    el.addEventListener("error", updateProgress, { once: true });
  }
});


    if (assets.length === 0) assetsLoaded = true;

    window.addEventListener("load", () => {
      windowLoaded = true;
      checkDone();
    }, { once: true });

    if (this.isHomePage() && firstVisit) {
      setTimeout(() => {
        if (this.isLoading) this.htmlMessage.textContent = "Loading your portfolio...";
      }, 1200);
      setTimeout(() => {
        if (this.isLoading) this.htmlMessage.textContent = "Almost ready...";
      }, 2200);
    }

    setTimeout(() => {
      if (this.isLoading) this.finishMainLoader();
    }, 1000);
  }

  finishMainLoader() {
    if (!this.isLoading) return;
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.updateMoonProgress(100);

    const firstVisit = !localStorage.getItem("visitedBefore");
    if (this.isHomePage() && firstVisit) {
      this.htmlMessage.textContent = "Welcome to my portfolio!";
      localStorage.setItem("visitedBefore", "true");
    } else {
      this.htmlMessage.textContent = "Ready!";
    }

    setTimeout(() => {
      this.hideHtmlLoader();
      if (this.isHomePage() && window.prefetchManager) {
        setTimeout(() => window.prefetchManager.startPrefetching(), 1000);
      }
    }, 300);
  }

  hideHtmlLoader() {
    if (this.htmlLoader && !this.isNavigating) {
      this.htmlLoader.style.transition = "opacity 0.4s ease-out, visibility 0.4s ease-out";
      this.htmlLoader.style.opacity = "0";
      this.htmlLoader.style.visibility = "hidden";
      setTimeout(() => {
        if (!this.isNavigating) {
          this.htmlLoader.style.display = "none";
          this.showMainContent();
          this.isLoading = false;
          if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
          }
        }
      }, 400);
    } else {
      this.showMainContent();
    }
  }

  showMainContent() {
    if (this.mainContent) {
      this.mainContent.style.opacity = "1";
      this.mainContent.style.visibility = "visible";
      document.body.classList.add('loaded');
    }
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      newLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = newLink.getAttribute('data-target');
        if (!['projects', 'contact', 'home'].includes(target)) {
          this.handleInPageNavigation(target);
          return;
        }
        const url = target === 'home' ? 'index.html' : target + '.html';
        this.handlePageNavigation(url);
      });
    });
  }

  handlePageNavigation(url) {
    if (this.isSamePage(url)) return;
    if (this.isNavigating) return;
    this.isNavigating = true;
    window.location.href = url;
  }

  isHomePage() {
    const path = window.location.pathname;
    return path === '/' || path.includes('index.html') || path.includes('index.html');
  }

  isSamePage(url) {
    const currentPath = window.location.pathname.toLowerCase();
    const targetPath = new URL(url, window.location.origin).pathname.toLowerCase();
    return currentPath === targetPath ||
      (currentPath.includes('index.html') && url.includes('index.html')) ||
      (currentPath === '/' && url.includes('index.html'));
  }

  getEffectiveMbps() {
    return window.__netSpeedMbps ??
      (navigator.connection?.downlink) ??
      2;
  }

  handleInPageNavigation(target) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.id === target ? p.classList.add('active') : p.classList.remove('active'));
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(l => l.classList.remove('active'));
    event.target.classList.add('active');
  }

  destroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
  
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.portfolioLoader) {
    window.portfolioLoader = new PortfolioLoader();
  }
});

window.addEventListener("beforeunload", () => {
  if (window.portfolioLoader) {
    window.portfolioLoader.destroy();
  }
});


