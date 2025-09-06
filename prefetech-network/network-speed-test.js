// Adaptive NetworkSpeed Tester (runs once per page load)

window.NetworkSpeed = (() => {

  async function measure(url, { timeoutMs = 8000 } = {}) {
    const withBuster = url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + '_' + Math.random();
    const controller = new AbortController();
    const t0 = performance.now();
    const timer = setTimeout(() => controller.abort('speed-test-timeout'), timeoutMs);
    let bytes = 0;

    try {
      const res = await fetch(withBuster, { cache: 'no-store', signal: controller.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      if (res.body && res.body.getReader) {
        const reader = res.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bytes += value.byteLength;
        }
      } else {
        const buf = await res.arrayBuffer();
        bytes = buf.byteLength;
      }
    } finally {
      clearTimeout(timer);
    }

    const seconds = (performance.now() - t0) / 1000;
    const mbps = (bytes * 8) / (seconds * 1e6); // Mbps = bytes*8 / (s*1e6)
    return mbps;
  }

  async function adaptiveMeasure({ timeoutMs = 8000 } = {}) {
    const tests = [
      { url: 'tes_bin/speed-test-50kb.bin', size: 50 * 1024 },
      { url: 'tes_bin/speed-test-100k.bin', size: 100 * 1024 },
      { url: 'tes_bin/speed-test-500k.bin', size: 500 * 1024 }
    ];

    // Start with smallest file
    let mbps = await measure(tests[0].url, { timeoutMs });

    // If too fast (<300ms), escalate:
    const fastEdgeMbps1 = (tests[0].size * 8) / (0.3 * 1e6);
    if (mbps > fastEdgeMbps1) {
      mbps = await measure(tests[1].url, { timeoutMs });

      const fastEdgeMbps2 = (tests[1].size * 8) / (0.3 * 1e6);
      if (mbps > fastEdgeMbps2) {
        mbps = await measure(tests[2].url, { timeoutMs });
      }
    }

    return mbps;
  }

  let adaptiveMeasurePromise = null;

  function startSpeedTest(opts = {}) {
    if (!adaptiveMeasurePromise) {
      adaptiveMeasurePromise = adaptiveMeasure(opts);
      adaptiveMeasurePromise.then(mbps => {
        window.__netSpeedMbps = mbps;
        localStorage.setItem('lastNetMbps', String(mbps));
        window.dispatchEvent(new CustomEvent('network-speed:ready', { detail: { mbps } }));
      }).catch(err => {
        console.warn('Network speed test failed:', err);
      });
    }
    return adaptiveMeasurePromise;
  }

  // Run speed test early on DOMContentLoaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startSpeedTest();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      startSpeedTest();
    }, { once: true });
  }

  return { measure, adaptiveMeasure, startSpeedTest };

})();
