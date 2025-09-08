// Add this at the beginning of script.js
// SEO: Update page title and meta description based on current section
function updateSEOForSection(sectionName) {
    const titles = {
        'introduction': 'Jaison Joseph - Data Science Engineer | ML & AI Specialist',
        'experience': 'Professional Experience - Jaison Joseph | Machine Learning Engineer',
        'skills': 'Technical Skills - Python, ML, Computer Vision | Jaison Joseph',
        'portfolio': 'Interactive Portfolio - Jaison Joseph | Data Science Projects'
    };
    
    const descriptions = {
        'introduction': 'Recent CSE graduate specializing in Data Science, Machine Learning, and Computer Vision. Experienced in Python, TensorFlow, and Big Data technologies.',
        'experience': 'Machine Learning Engineer Intern at Trecent Systems. Expertise in YOLOv8, computer vision, and OCR solutions for traffic analysis.',
        'skills': 'Technical expertise in Python, SQL, TensorFlow, AWS, Hadoop, Tableau, and advanced ML/AI frameworks.',
        'portfolio': 'Explore interactive portfolio featuring data science projects, computer vision applications, and technical demonstrations.'
    };
    
    if (titles[sectionName]) {
        document.title = titles[sectionName];
        
        // Update meta description if it exists
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && descriptions[sectionName]) {
            metaDesc.content = descriptions[sectionName];
        }
    }
}

// Add this to your existing changeSlides function
function changeSlides(instant) {
    // ... your existing code ...
    
    // Add SEO update based on current slide
    const slideNames = ['introduction', 'experience', 'skills', 'portfolio'];
    if (slideNames[curSlide]) {
        updateSEOForSection(slideNames[curSlide]);
    }
    
    // ... rest of your existing code ...
}
// ==============================// ============================== naviagtion
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            
            // Check if it's a page navigation (external files)
            if (target === 'projects') {
                window.location.href = 'projects.html';
                return;
            }
            if (target === 'contact') {
                window.location.href = 'contact.html';
                return;
            }
            if (target === 'home') {
                window.location.href = 'index.html';
                return;
            }
            
            // For in-page navigation (skills sections)
            pages.forEach(page => {
                if (page.id === target) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });

            // Set active class on nav links
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
// Hide pagination on pages without slider
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const paginationContainer = document.querySelector('.pagination-container');
    
    // If no slider exists on the page, hide pagination
    if (!slider && paginationContainer) {
        paginationContainer.style.display = 'none';
    }
    
    // Also check if we're on specific pages by URL
    const currentPage = window.location.pathname;
    if (paginationContainer && (
        currentPage.includes('projects.html') || 
        currentPage.includes('contact.html') ||
        currentPage.includes('about.html')
    )) {
        paginationContainer.style.display = 'none';
    }
});
// Universal scroll-based pagination control for all screen sizes
function initUniversalScrollPaginationControl() {
    const paginationContainer = document.querySelector('.pagination-container');
    const heroSection = document.querySelector('.hero-section, #hero');
    
    if (!paginationContainer || !heroSection) return;
    
    // Add CSS transition for smooth animation
    paginationContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease';
    
    function handleScroll() {
        const heroRect = heroSection.getBoundingClientRect();
        const heroHeight = heroSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of hero section is visible
        let visibleHeight = 0;
        
        if (heroRect.top >= 0) {
            // Hero section is below viewport top
            visibleHeight = Math.min(heroRect.bottom, viewportHeight) - heroRect.top;
        } else if (heroRect.bottom > 0) {
            // Hero section is partially above viewport
            visibleHeight = heroRect.bottom;
        }
        
        const visibilityPercentage = (visibleHeight / heroHeight) * 100;
        
        // Check if we're in desktop or mobile view
        const isDesktop = window.innerWidth > 768;
        
        // Hide pagination when less than 50% of hero section is visible
        if (visibilityPercentage < 50) {
            // Desktop: Keep it fixed but hide it
            if (isDesktop) {
                paginationContainer.style.opacity = '0';
                paginationContainer.style.visibility = 'hidden';
                paginationContainer.style.transform = 'translateY(20px) scale(0.9)';
                paginationContainer.style.pointerEvents = 'none';
                // Don't change display for desktop to maintain fixed positioning
            } else {
                // Mobile: Completely hide
                paginationContainer.style.display = 'none';
                paginationContainer.style.visibility = 'hidden';
                paginationContainer.style.opacity = '0';
            }
        } else {
            // Show pagination
            if (isDesktop) {
                paginationContainer.style.opacity = '1';
                paginationContainer.style.visibility = 'visible';
                paginationContainer.style.transform = 'translateY(0) scale(1)';
                paginationContainer.style.pointerEvents = 'auto';
            } else {
                paginationContainer.style.display = 'flex';
                paginationContainer.style.visibility = 'visible';
                paginationContainer.style.opacity = '1';
            }
        }
    }
    
    // Optimized scroll listener with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Handle window resize to adjust behavior
    window.addEventListener('resize', () => {
        setTimeout(handleScroll, 100);
    });
    
    // Initial check
    handleScroll();
}

// Desktop-only mouse interaction pagination control
function initDesktopMouseInteractionPagination() {
    const paginationContainer = document.querySelector('.pagination-container');
    
    if (!paginationContainer) return;
    
    let mouseInactivityTimer;
    let isMouseActive = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    const INACTIVITY_DELAY = 2000; // 3 seconds
    const DESKTOP_BREAKPOINT = 768; // Desktop breakpoint
    
    // Check if we're on desktop
    function isDesktop() {
        return window.innerWidth > DESKTOP_BREAKPOINT;
    }
    
    // Show pagination with smooth animation
    function showPagination() {
        if (!isDesktop()) return;
        
        paginationContainer.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s ease';
        paginationContainer.style.opacity = '1';
        paginationContainer.style.visibility = 'visible';
        paginationContainer.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        paginationContainer.style.pointerEvents = 'auto';
        isMouseActive = true;
    }
    
    // Hide pagination with smooth animation
    function hidePagination() {
        if (!isDesktop()) return;
        
        paginationContainer.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s ease';
        paginationContainer.style.opacity = '0';
        paginationContainer.style.visibility = 'hidden';
        paginationContainer.style.transform = 'translateX(-50%) translateY(15px) scale(0.95)';
        paginationContainer.style.pointerEvents = 'none';
        isMouseActive = false;
    }
    
    // Reset the inactivity timer
    function resetInactivityTimer() {
        if (!isDesktop()) return;
        
        clearTimeout(mouseInactivityTimer);
        
        if (!isMouseActive) {
            showPagination();
        }
        
        mouseInactivityTimer = setTimeout(() => {
            hidePagination();
        }, INACTIVITY_DELAY);
    }
    
    // Handle mouse movement
    function handleMouseMove(e) {
        if (!isDesktop()) return;
        
        const currentMouseX = e.clientX;
        const currentMouseY = e.clientY;
        
        // Check if mouse actually moved (minimum 3px movement to avoid jitter)
        if (Math.abs(currentMouseX - lastMouseX) > 3 || Math.abs(currentMouseY - lastMouseY) > 3) {
            lastMouseX = currentMouseX;
            lastMouseY = currentMouseY;
            resetInactivityTimer();
        }
    }
    
    // Handle mouse interactions (clicks, hovers, etc.)
    function handleMouseInteraction() {
        if (!isDesktop()) return;
        resetInactivityTimer();
    }
    
    // Handle window resize to enable/disable based on screen size
    function handleResize() {
        if (isDesktop()) {
            // Desktop: Enable mouse interaction control
            // Start with showing pagination, then hide after delay
            showPagination();
            resetInactivityTimer();
        } else {
            // Mobile/Tablet: Disable this feature and let existing scroll control handle it
            clearTimeout(mouseInactivityTimer);
            // Reset pagination styles to default for mobile
            paginationContainer.style.opacity = '';
            paginationContainer.style.visibility = '';
            paginationContainer.style.transform = '';
            paginationContainer.style.pointerEvents = '';
            paginationContainer.style.transition = '';
            isMouseActive = false;
        }
    }
    
    // Add event listeners only if desktop
    if (isDesktop()) {
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mousedown', handleMouseInteraction);
        document.addEventListener('mouseup', handleMouseInteraction);
        document.addEventListener('click', handleMouseInteraction);
        
        // Also listen for interactions specifically on pagination area
        paginationContainer.addEventListener('mouseenter', handleMouseInteraction);
        paginationContainer.addEventListener('mouseleave', () => {
            if (isDesktop()) resetInactivityTimer();
        });
        paginationContainer.addEventListener('click', handleMouseInteraction);
    }
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Initial setup
    handleResize();
}

// Initialize the desktop mouse interaction control after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a delay to ensure other pagination controls are loaded first
    setTimeout(() => {
        initDesktopMouseInteractionPagination();
    }, 1000);
});



// Skills data (edit to suit)
// ==============================
const skillsData = {
  'data-analytics': {
    title: 'Data Analytics Skills',
    skills: [
      { name: 'SQL', level: 80 },
      { name: 'Python', level: 55 },
      { name: 'Tableau', level: 75 },
      { name: 'Excel / VBA', level: 75 },
      { name: 'Power BI', level: 80 },
      { name: 'R', level: 20 },
      { name: 'Statistics', level: 55 },
    ],
    usage: [
      'Applied Python and SQL for MRI classification and football tracking analytics; built Tableau and Power BI dashboards for visual insights; used Excel/VBA for preprocessing; applied statistical methods to validate accuracy across sports analytics and medical imaging projects.',
      
    ],
  },
  'data-engineering': {
    title: 'Data Engineering Skills',
    skills: [
      { name: 'Apache Spark', level: 65 },
      { name: 'AWS Services', level: 50 },
      { name: 'Docker', level: 55 },
      { name: 'ETL Pipelines', level: 60 },
      { name: 'Apache Kafka', level: 35 },
      { name: 'Hadoop', level: 40 },
      { name: 'Snowflake', level: 50 },
    ],
    usage: [
      'Implemented Spark and Hadoop for large-scale VIDS traffic datasets; developed ETL pipelines for annotation processing; deployed models via AWS; used Docker for reproducible training environments and Kafka for real-time vehicle detection and behavioral analysis in complex traffic scenarios.',
      
    ],
  },
  'ml-ai': {
    title: 'Machine Learning & AI',
    skills: [
      { name: 'Scikit-learn', level: 70 },
      { name: 'TensorFlow', level: 50 },
      { name: 'Deep Learning', level: 75 },
      { name: 'NLP', level: 45 },
      { name: 'Computer Vision', level: 90 },
      { name: 'MLOps', level: 30 },
      { name: 'Feature Engineering', level: 75 },
    ],
    usage: [
      'Built TensorFlow-based MRI classification pipeline; trained YOLOv8 for football player and traffic object detection; implemented NLP features in an e-learning chatbot; optimized models with feature engineering; incorporated computer vision techniques for precise detection, tracking, and formation analysis.',
    ],
  },
  'other': {
    title: 'Additional Skills',
    skills: [
      { name: 'Git / GitHub', level: 60},
      { name: 'CVAT', level: 65 },
      { name: 'YOLO', level: 86 },
      { name: 'DBeaver', level: 30 },
      { name: 'LLM', level: 72 },
      { name: 'Prompt Engineering', level: 68 },
      { name: 'JavaScript', level: 25 },
    ],
    usage: [
      'Used CVAT to annotate over 20,000 frames for YOLO models; managed collaborative repositories on GitHub; integrated JavaScript for e-learning UI; leveraged LLMs and prompt engineering to refine chatbot interactions; applied DBeaver for database management in projects.',
    ],
  },
};

let currentRole = 'data-analytics';

// ==============================
// Right panel rendering
// ==============================
function updateRightPanel(roleKey) {
  const role = skillsData[roleKey] || { title: 'Skills', skills: [], usage: [] };
  const title = document.getElementById('skillsTitle');
  const heading = document.getElementById('skillsRoleHeading');
  const list = document.getElementById('skillsList');
  const usage = document.getElementById('skillsUsage');

  if (title) title.textContent = role.title;
  if (heading) heading.textContent = `${role.title} — details`;

  if (list) {
    list.innerHTML = '';
    (role.skills || []).forEach(s => {
      const row = document.createElement('div');
      row.className = 'skill-item';
      row.innerHTML = `
        <span class="skill-name">${s.name}</span>
        <span class="skill-level ${s.level ? '' : 'empty'}">${s.level ? s.level + '%' : 'Learning'}</span>
      `;
      list.appendChild(row);
    });
  }

  if (usage) {
    usage.innerHTML = '';
    (role.usage || []).forEach(u => {
      const li = document.createElement('li');
      li.textContent = u;
      usage.appendChild(li);
    });
  }
}

// ==============================
// Canvas sizing (HiDPI crisp)
// ==============================
// Sets the canvas drawing buffer to match its CSS size * devicePixelRatio,
// then applies a transform so drawing uses CSS pixels (avoids blur on Retina).
function sizeCanvasFill(canvas, padding = 16) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1); // MDN devicePixelRatio[12], HiDPI technique[18][6]

  // Set actual buffer size in device pixels
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  const ctx = canvas.getContext('2d');
  // Map 1 unit to 1 CSS pixel after scaling
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // CSS pixel space dimensions
  const cssWidth = rect.width;
  const cssHeight = rect.height;

  // Center
  const cx = cssWidth / 2;
  const cy = cssHeight / 2;

  // Leave generous margins for labels
  const radius = Math.max(40, Math.min(cx, cy) - padding - 30);

  return { ctx, cx, cy, radius, width: cssWidth, height: cssHeight };
}

// ==============================
// Radar drawing
// ==============================
function drawRadar(roleKey) {
  const role = skillsData[roleKey];
  if (!role) return;

  const data = role.skills || [];
  const canvas = document.getElementById('radarCanvas');
  if (!canvas || !data.length) return;

  const { ctx, cx, cy, radius, width, height } = sizeCanvasFill(canvas, 16);

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Slight translucent fill so starfield remains visible but grid is legible
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, width, height);

  // Grid rings
  const rings = 5;
  ctx.lineWidth = 1;
  for (let i = 1; i <= rings; i++) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(168,178,193,0.28)';
    ctx.arc(cx, cy, (radius * i) / rings, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Spokes and labels
  const n = data.length;
  const angleStep = (Math.PI * 2) / n;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(230,236,245,0.92)';
  ctx.font = '12.5px Inter, ui-sans-serif';

  data.forEach((skill, i) => {
    const a = i * angleStep - Math.PI / 2;
    const x = cx + Math.cos(a) * radius;
    const y = cy + Math.sin(a) * radius;

    // Spoke
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(168,178,193,0.2)';
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Label slightly outside the radius
    const labelR = radius + 26;
    const lx = cx + Math.cos(a) * labelR;
    const ly = cy + Math.sin(a) * labelR;

    const label = skill.name || '';
    ctx.save();
ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // More opaque white
ctx.strokeStyle = 'rgba(0, 2, 20, 0.8)'; // Dark outline
ctx.lineWidth = 3;
ctx.font = 'bold 13px Inter, ui-sans-serif'; // Made bold and slightly larger
    if (label.length > 12 && label.includes(' ')) {
      const parts = label.split(' ');
      const first = parts[0];
      const second = parts.slice(1).join(' ');
      ctx.strokeText(first, lx, ly - 8);
      ctx.strokeText(second, lx, ly + 8);
      ctx.fillText(first, lx, ly - 8);
      ctx.fillText(second, lx, ly + 8);
    } else {
        ctx.strokeText(label, lx, ly);
      ctx.fillText(label, lx, ly);
    }
  });
  ctx.restore();

  // Data polygon
  if (data.some(s => (s.level || 0) > 0)) {
    ctx.beginPath();
    data.forEach((skill, i) => {
      const a = i * angleStep - Math.PI / 2;
      const r = (radius * Math.max(0, Math.min(100, skill.level || 0))) / 100;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = '#3498db35';
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // Points
    data.forEach((skill, i) => {
      const a = i * angleStep - Math.PI / 2;
      const r = (radius * Math.max(0, Math.min(100, skill.level || 0))) / 100;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.lineWidth = 1.25;
      ctx.strokeStyle = '#00E5FF';
      ctx.stroke();
    });
  }
}


// ==============================
// Render pipeline
// ==============================
function renderSkills() {
  updateRightPanel(currentRole);
  drawRadar(currentRole);
}

// ==============================
// Role buttons (if present)
// ==============================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.role-btn');
  if (!btn) return;

  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  currentRole = btn.getAttribute('data-role');
  renderSkills();
});

// ==============================
// Init + responsive redraw
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  renderSkills();

  // Redraw radar on resize using rAF to avoid thrash
  let raf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => drawRadar(currentRole));
  });
});
// ==============================
// Hero Slider Functionality
// ==============================
// ==============================
// Hero Slider Functionality (Vanilla JS for GitHub Pages)
// ==============================

    // ==============================
// Hero Slider Functionality (Vanilla JS for GitHub Pages)
// ==============================

document.addEventListener('DOMContentLoaded', function() {
    var slider = document.querySelector('.slider');
    var slideBGs = document.querySelectorAll('.slide__bg');
    
    var curSlide = 0;
    var slides = document.querySelectorAll('.slide');
    var numOfSlides = slides.length - 1;
    var animating = false;
    var animTime = 500;
    var autoSlideTimeout;
    var autoSlideDelay = 6000;
    
    if (!slider || !slides.length) return;
    
    // Initialize pagination immediately
    initializePagination();
    
    function initializePagination() {
    const paginationContainer = document.querySelector('.pagination-container');
    const paginationDots = document.querySelector('.pagination');
    const paginationHeader = document.querySelector('.pagination-header');
    const currentSlideSpan = document.querySelector('.current-slide');
    const totalSlidesSpan = document.querySelector('.total-slides');
    
    if (!paginationContainer || !paginationDots) return;
    
    // Clear existing dots
    paginationDots.innerHTML = '';
    
    // Set total slides count
    if (totalSlidesSpan) {
        totalSlidesSpan.textContent = numOfSlides + 1;
    }
    
    const slideNames = ['Introduction', 'Experience', 'Technical Skills', 'Portfolio Details'];
    
    for (var i = 0; i < numOfSlides + 1; i++) {
        var dot = document.createElement('div');
        dot.className = 'pagination-dot';
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-slide', i);
        
        // Use data attribute for tooltip
        dot.setAttribute('data-tooltip', slideNames[i] || 'Section ' + (i + 1));
        
        // Click event with closure
        (function(index) {
            dot.addEventListener('click', function(e) {
                if (index !== curSlide) {
                    curSlide = index;
                    changeSlides();
                }
            });
        })(i);
        
        paginationDots.appendChild(dot);
    }
    
    // Enhanced hover effects for container
    if (paginationContainer && paginationHeader) {
        let hoverTimeout;
        
        paginationContainer.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            paginationHeader.classList.add('show');
        });
        
        paginationContainer.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                paginationHeader.classList.remove('show');
            }, 300);
        });
    }
    
    updatePaginationState();
}


    
    function updatePaginationState() {
        const paginationDots = document.querySelectorAll('.pagination-dot');
        const currentSlideSpan = document.querySelector('.current-slide');
        
        // Update active dot
        paginationDots.forEach(function(dot, index) {
            dot.classList.remove('active');
            if (index === curSlide) {
                dot.classList.add('active');
            }
        });
        
        // Update counter
        if (currentSlideSpan) {
            currentSlideSpan.textContent = curSlide + 1;
        }
        
       
    }
    
    function autoSlide() {
        autoSlideTimeout = setTimeout(function() {
            curSlide++;
            if (curSlide > numOfSlides) curSlide = 0;
            changeSlides();
        }, autoSlideDelay);
    }
    
    function changeSlides(instant) {
        if (!instant) {
            animating = true;
            slider.classList.add('animating');
            
            slides.forEach(function(slide) {
                slide.classList.remove('active');
            });
            slides[curSlide].classList.add('active');
            
            setTimeout(function() {
                slider.classList.remove('animating');
                animating = false;
            }, animTime);
        }
        
        clearTimeout(autoSlideTimeout);
        
        // Update pagination
        updatePaginationState();
        
        slider.style.transform = 'translate3d(' + (-curSlide * 100) + '%,0,0)';
        
        slideBGs.forEach(function(bg) {
            bg.style.transform = 'translate3d(' + (curSlide * 50) + '%,0,0)';
        });
        
        autoSlide();
    }
    
    function navigateLeft() {
        if (animating) return;
        if (curSlide > 0) curSlide--;
        changeSlides();
    }
    
    function navigateRight() {
        if (animating) return;
        if (curSlide < numOfSlides) curSlide++;
        changeSlides();
    }
    
    // Control buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.slider-control.left')) {
            navigateLeft();
        } else if (e.target.closest('.slider-control.right')) {
            navigateRight();
        }
    });
    
    // Start auto-slide
    autoSlide();
    
    // Initialize first slide
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }
});

    // Dynamic pagination resize handler
window.addEventListener('resize', function() {
    const paginationContainer = document.querySelector('.pagination-container');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    const paginationHeader = document.querySelector('.pagination-header');
    
    if (paginationContainer) {
        // Force reflow after resize
        setTimeout(() => {
            paginationContainer.style.display = 'none';
            paginationContainer.offsetHeight; // Trigger reflow
            paginationContainer.style.display = 'flex';
        }, 100);
    }
    
    // Adjust tooltip positioning based on screen size
    const screenWidth = window.innerWidth;
    paginationDots.forEach(dot => {
        if (screenWidth < 480) {
            dot.style.setProperty('--tooltip-size', '0.6rem');
        } else if (screenWidth < 768) {
            dot.style.setProperty('--tooltip-size', '0.7rem');
        } else {
            dot.style.setProperty('--tooltip-size', '0.75rem');
        }
    });
});

// Initial call on page load
document.addEventListener('DOMContentLoaded', function() {
    // Trigger resize event once to set initial responsive state
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 500);
});

// Enhanced slider control management
function manageControls() {
    var leftControl = document.querySelector('.slider-control.left');
    var rightControl = document.querySelector('.slider-control.right');
    
    if (leftControl && rightControl) {
        leftControl.classList.remove('inactive');
        rightControl.classList.remove('inactive');
        
        if (curSlide === 0) leftControl.classList.add('inactive');
        if (curSlide === 1) leftControl.classList.add('active');

        if (curSlide === numOfSlides) rightControl.classList.add('inactive');
    }
}


// Enhanced pagination hover functionality
function initializePaginationControls() {
    const paginationContainer = document.querySelector('.pagination-container');
    const paginationDots = document.querySelector('.pagination');
    const leftControl = document.querySelector('.slider-control.left');
    const rightControl = document.querySelector('.slider-control.right');
    
    if (paginationContainer && leftControl && rightControl) {
        // Show controls when hovering over pagination container
        paginationContainer.addEventListener('mouseenter', function() {
            if (!leftControl.classList.contains('inactive')) {
                leftControl.style.opacity = '1';
            }
            if (!rightControl.classList.contains('inactive')) {
                rightControl.style.opacity = '1';
            }
        });
        
        // Hide controls when leaving pagination container
        paginationContainer.addEventListener('mouseleave', function() {
            leftControl.style.opacity = '0';
            rightControl.style.opacity = '0';
        });
        
        // Also show controls when hovering over pagination dots
        if (paginationDots) {
            paginationDots.addEventListener('mouseenter', function() {
                if (!leftControl.classList.contains('inactive')) {
                    leftControl.style.opacity = '1';
                }
                if (!rightControl.classList.contains('inactive')) {
                    rightControl.style.opacity = '1';
                }
            });
        }
    }
}

// Update your existing initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Your existing slider initialization code...
    
    // Add control initialization
    initializePaginationControls();
    
    // Make sure controls are properly managed
    manageControls();
});

// Update the changeSlides function to manage controls
function changeSlides(instant) {
    if (!instant) {
        animating = true;
        manageControls(); // Update control states
        slider.classList.add('animating');
        
        slides.forEach(function(slide) {
            slide.classList.remove('active');
        });
        slides[curSlide].classList.add('active');
        
        setTimeout(function() {
            slider.classList.remove('animating');
            animating = false;
        }, animTime);
    }
    
    clearTimeout(autoSlideTimeout);
    
    // Update pagination
    updatePaginationState();
    
    slider.style.transform = 'translate3d(' + (-curSlide * 100) + '%,0,0)';
    
    slideBGs.forEach(function(bg) {
        bg.style.transform = 'translate3d(' + (curSlide * 50) + '%,0,0)';
    });
    
    autoSlide();
}

// Add this to your projects.js file - Mobile scroll-based navigation visibility

// Smart Pagination Visibility Control
function initPaginationControl() {
    const paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) return;

    let currentSection = 'hero';
    
    // Create intersection observer to detect current section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const target = entry.target;
                
                // Check what section we're in
                if (target.classList.contains('hero-section') || 
                    target.classList.contains('slider-container') ||
                    target.closest('.hero-section')) {
                    currentSection = 'hero';
                    paginationContainer.classList.remove('hide-pagination');
                } else if (target.classList.contains('skills-section') ||
                          target.classList.contains('projects-content') ||
                          target.classList.contains('contact-content')) {
                    currentSection = 'other';
                    paginationContainer.classList.add('hide-pagination');
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-50px 0px -50px 0px'
    });

    // Observe all major sections
    const sections = document.querySelectorAll('.hero-section, .skills-section, .projects-content, .contact-content, section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Initial check - show pagination if we start on hero
    const heroSection = document.querySelector('.hero-section, .slider-container');
    if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            paginationContainer.classList.remove('hide-pagination');
        } else {
            paginationContainer.classList.add('hide-pagination');
        }
    }
}

// Initialize pagination control when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Add delay to ensure other scripts load first
    setTimeout(initPaginationControl, 500);
});



