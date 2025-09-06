let projectData = {};         // Will be loaded from JSON
let imageCache = {};          // To cache preloaded images by project & slide
let currentProjectSlideIndex = 1;
let currentProject = '';
let overlayTimeout;
let activeService = null;



// Fetch JSON and preload images on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  fetch('prefetech-network/partialfecth.json')  // Adjust path based on your folder structure
    .then(response => response.json())
    .then(data => {
      projectData = data;
      preloadAllImages(data);
      initializeProjectCards();
      console.log('Project data loaded and images preloaded');
    })
    .catch(err => console.error('Failed to load project slides JSON:', err));
});

// Preload all images referenced in JSON for smoother navigation
function preloadAllImages(data) {
  for (const projectId in data) {
    if (!imageCache[projectId]) imageCache[projectId] = [];
    const slides = data[projectId].slides;
    slides.forEach((slide, idx) => {
      const img = new Image();
      img.src = slide.image;
      imageCache[projectId][idx] = img;
    });
  }
}

// Initialize click handlers on project cards after JSON is loaded
function initializeProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', function () {
      const projectId = this.dataset.project;
      if (projectData[projectId]) {
        currentProject = projectId;
        currentProjectSlideIndex = 1;
        createSlideIndicators(projectData[projectId].slides.length);
        showProjectOverlay(projectId);
      } else {
        console.error('Project data not found for:', projectId);
      }
    });
  });
}

// Create slide indicator dots
function createSlideIndicators(slideCount) {
  const container = document.getElementById('slideIndicators');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 1; i <= slideCount; i++) {
    const dot = document.createElement('span');
    dot.className = `slide-dot ${i === 1 ? 'active' : ''}`;
    dot.onclick = () => currentProjectSlide(i);
    container.appendChild(dot);
  }
}


// Show project overlay and load the current slide
function showProjectOverlay(projectId) {
  const overlay = document.getElementById('projectOverlay');
  if (!overlay) return;
  document.body.classList.add('overlay-active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateProjectSlide();
}

// Hide overlay and restore page scroll
function hideProjectOverlay() {
  const overlay = document.getElementById('projectOverlay');
  if (!overlay) return;
  document.body.classList.remove('overlay-active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Update slide content with cached images and text
function updateProjectSlide() {
  const project = projectData[currentProject];
  if (!project) return;
  let slideIndex = currentProjectSlideIndex - 1;
  if (slideIndex < 0 || slideIndex >= project.slides.length) return;

  const slide = project.slides[slideIndex];
  const titleEl = document.getElementById('overlayTitle');
  const imgEl = document.getElementById('overlayImage');
  const descEl = document.getElementById('overlayDescription');

  if (titleEl) {
    titleEl.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.textContent = project.title;
    h2.style.margin = '0';
    h2.style.fontSize = '1.6rem';
    h2.style.fontWeight = '700';
    h2.style.color = '#2c3e50';

    const githubLink = document.createElement('a');
    githubLink.href = project.github || '#';
    githubLink.className = 'github-link';
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.title = 'View on GitHub';
    githubLink.innerHTML = `<!-- SVG GitHub icon here -->`;

    titleEl.appendChild(h2);
    titleEl.appendChild(githubLink);
  }

  if (imgEl) {
    const cachedImage = imageCache[currentProject][slideIndex];
    if (cachedImage && cachedImage.complete) {
      imgEl.src = cachedImage.src;
      imgEl.alt = `${project.title} - Slide ${currentProjectSlideIndex}`;
    } else {
      imgEl.src = slide.image; // fallback
      imgEl.alt = `${project.title} - Slide ${currentProjectSlideIndex}`;
    }
  }

  if (descEl) {
    descEl.innerHTML = slide.description;
  }

  // Update slide indicator active state
  const dots = document.querySelectorAll('.slide-dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === slideIndex);
  });

  console.log('Updated slide:', currentProjectSlideIndex, 'for project:', currentProject);
}

// Change slide by direction (+1 or -1)
function changeProjectSlide(direction) {
  const project = projectData[currentProject];
  if (!project) return;
  currentProjectSlideIndex += direction;
  if (currentProjectSlideIndex > project.slides.length) currentProjectSlideIndex = 1;
  else if (currentProjectSlideIndex < 1) currentProjectSlideIndex = project.slides.length;
  updateProjectSlide();
}

// Go to a specific slide
function currentProjectSlide(slideNum) {
  const project = projectData[currentProject];
  if (!project) return;
  if (slideNum >= 1 && slideNum <= project.slides.length) {
    currentProjectSlideIndex = slideNum;
    updateProjectSlide();
  }
}

// Highlight projects by service type
function highlightProjectsByService(serviceType, isActive = false) {
  const projectCards = document.querySelectorAll('.project-card');
  const theme = serviceThemes[serviceType];
  if (!theme) return;

  // Reset all to default colors first
  projectCards.forEach(card => {
    card.classList.remove('highlighted', 'highlighted-blue', 'highlighted-purple', 'highlighted-green');
    const projectTitle = card.querySelector('.project-content h3');
    const projectDescription = card.querySelector('.project-content p');
    const projectTags = card.querySelectorAll('.project-tag');

    if (projectTitle) {
      projectTitle.style.color = '#ffffff';
      projectTitle.style.fontWeight = '600';
    }
    if (projectDescription) {
      projectDescription.style.color = '#929292ff';
      projectDescription.style.opacity = '1';
    }
    projectTags.forEach(tag => {
      tag.style.backgroundColor = '#ffffffff';
      tag.style.color = '#000000ff';
      tag.style.fontWeight = '500';
    });
  });

  // Apply highlight filter & colors only on matching projects
  projectCards.forEach(card => {
    const projectId = card.dataset.project;
    const project = projectData[projectId];
    if (project && project.category === serviceType) {
      card.classList.add('highlighted', theme.highlightClass);
      const projectTitle = card.querySelector('.project-content h3');
      const projectDescription = card.querySelector('.project-content p');
      const projectTags = card.querySelectorAll('.project-tag');

      if (projectTitle) {
        projectTitle.style.color = theme.color;
        projectTitle.style.fontWeight = '700';
      }
      if (projectDescription) {
        projectDescription.style.color = theme.color;
        projectDescription.style.opacity = '0.8';
      }
      projectTags.forEach(tag => {
        tag.style.backgroundColor = '#000000ff';
        tag.style.color = '#ffffffff';
        tag.style.fontWeight = '500';
      });
    }
  });
}

// Apply service theme (keep your existing code or add here)

// Remove project highlights and reset colors (keep your existing code)

// Reset service theme (keep your existing code)

// Main initialization UI logic, event handlers, service theming, overlay controls
document.addEventListener('DOMContentLoaded', function () {
  console.log('Projects.js loaded with click-to-open functionality');
  const projectCards = document.querySelectorAll('.project-card');
  const overlay = document.getElementById('projectOverlay');
  if (!overlay) {
    console.error('Project overlay not found!');
    return;
  }

  // Existing event handlers for overlay, escape key, mouse enter/leave, service clicks, etc.
  // Keep your current code here unchanged
});


// Service color themes
const serviceThemes = {
    analytics: {
        borderColor: '#3498db',
        name: 'service-1',
        color: '#3498db',
        highlightClass: 'highlighted-blue'
    },
    'ml': {
        borderColor: '#a929e4',
        name: 'service-2',
        color: '#a929e4',
        highlightClass: 'highlighted-purple'
    },
    'bi': {
        borderColor: '#6be22b',
        name: 'service-3',
        color: '#6be22b',
        highlightClass: 'highlighted-green'
    }
};



// Function to highlight projects based on service
function highlightProjectsByService(serviceType, isActive = false) {
    const projectCards = document.querySelectorAll('.project-card');
    const theme = serviceThemes[serviceType];
    
    if (!theme) return;
    
    // Reset ALL project cards to default colors
    projectCards.forEach(card => {
        // Remove all highlight classes
        card.classList.remove('highlighted', 'highlighted-blue', 'highlighted-purple', 'highlighted-green');
        
        // Reset all text colors to default
        const projectTitle = card.querySelector('.project-content h3');
        const projectDescription = card.querySelector('.project-content p');
        const projectTags = card.querySelectorAll('.project-tag');
        
        if (projectTitle) {
            projectTitle.style.color = '#ffffff';
            projectTitle.style.fontWeight = '600';
        }
        
        if (projectDescription) {
            projectDescription.style.color = '#929292ff';
            projectDescription.style.opacity = '1';
        }
        
        projectTags.forEach(tag => {
            tag.style.backgroundColor = '#ffffffff';
            tag.style.color = '#000000ff';
            tag.style.fontWeight = '500';
        });
    });
    
    // Apply new category colors only to matching projects
    projectCards.forEach(card => {
        const projectId = card.dataset.project;
        const project = projectData[projectId];
        
        if (project && project.category === serviceType) {
            card.classList.add('highlighted', theme.highlightClass);
            
            const projectTitle = card.querySelector('.project-content h3');
            const projectDescription = card.querySelector('.project-content p');
            const projectTags = card.querySelectorAll('.project-tag');
            
            if (projectTitle) {
                projectTitle.style.color = theme.color;
                projectTitle.style.fontWeight = '700';
            }
            
            if (projectDescription) {
                projectDescription.style.color = theme.color;
                projectDescription.style.opacity = '0.8';
            }
            
            projectTags.forEach(tag => {
                tag.style.backgroundColor = '#000000ff';
                tag.style.color = '#ffffffff';
                tag.style.fontWeight = '500';
            });
        }
    });
}

// Function to apply service theme
function applyServiceTheme(serviceType, isActive = false) {
    const navbar = document.querySelector('.navbar');
    const servicesBar = document.querySelector('.services-bar');
    const projectsContent = document.querySelector('.projects-content');
    const profileImg = document.querySelector('.logo-profile-img');
    const profileCardImg = document.querySelector('.profile-card-img');
    const detailLabels = document.querySelectorAll('.detail-label');
    const currentServiceItem = document.querySelector(`.service-item[data-service="${serviceType}"]`);
    const currentServiceLabel = currentServiceItem ? currentServiceItem.querySelector('.service-label') : null;
    
    const theme = serviceThemes[serviceType];
    if (!theme) return;

    const jobTitle = document.querySelector('.job-title');
    if (jobTitle) {
    jobTitle.style.color = theme.color;
    }

    
    if (activeService && !isActive && activeService !== serviceType) {
        return;
    }
    
    if (navbar) {
        navbar.style.borderBottomColor = theme.borderColor;
        navbar.classList.remove('service-1-active', 'service-2-active', 'service-3-active');
        navbar.classList.add(`${theme.name}-active`);
    }
    
    if (servicesBar) {
        servicesBar.style.borderBottomColor = theme.borderColor;
    }
    
    if (profileImg) {
        profileImg.style.borderColor = theme.borderColor;
        profileImg.style.boxShadow = `0 0 15px ${theme.borderColor}40`;
    }
    
    if (profileCardImg) {
        profileCardImg.style.borderColor = theme.borderColor;
        profileCardImg.style.boxShadow = `0 0 15px ${theme.borderColor}66`;
    }
    
    detailLabels.forEach(label => {
        label.style.color = theme.color;
    });
    
    if (currentServiceLabel) {
        currentServiceLabel.style.color = theme.color;
    }
    
    highlightProjectsByService(serviceType, isActive);
}

// Function to remove all project highlights and reset text colors
function removeProjectHighlights() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.classList.remove('highlighted', 'highlighted-blue', 'highlighted-purple', 'highlighted-green');
        
        const projectTitle = card.querySelector('.project-content h3');
        const projectDescription = card.querySelector('.project-content p');
        const projectTags = card.querySelectorAll('.project-tag');
        
        if (projectTitle) {
            projectTitle.style.color = '#ffffff';
            projectTitle.style.fontWeight = '600';
        }
        
        if (projectDescription) {
            projectDescription.style.color = '#929292ff';
            projectDescription.style.opacity = '1';
        }
        
        projectTags.forEach(tag => {
            tag.style.backgroundColor = '#e2e8f0';
            tag.style.color = '#475569';
            tag.style.fontWeight = '500';
        });
    });
}

// Function to reset theme
function resetServiceTheme() {
    if (activeService) return;
    
    const navbar = document.querySelector('.navbar');
    const servicesBar = document.querySelector('.services-bar');
    const profileImg = document.querySelector('.logo-profile-img');
    const profileCardImg = document.querySelector('.profile-card-img');
    const detailLabels = document.querySelectorAll('.detail-label');

    const serviceLabels = document.querySelectorAll('.service-label');
    
    if (navbar) {
        navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
        navbar.classList.remove('service-1-active', 'service-2-active', 'service-3-active');
    }
     const jobTitle = document.querySelector('.job-title');
    if (jobTitle) {
    jobTitle.style.color = 'rgba(255, 255, 255, 0.7)';
    }

    
    if (servicesBar) {
        servicesBar.style.borderBottomColor = '#717171e3';
    }
    
    if (profileImg) {
        profileImg.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        profileImg.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.1)';
    }
    
    if (profileCardImg) {
        profileCardImg.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        profileCardImg.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.1)';
    }
    
    detailLabels.forEach(label => {
        label.style.color = 'rgba(255, 255, 255, 0.7)';
    });
    
    serviceLabels.forEach(label => {
        label.style.color = '#ffffff';
    });
    
    removeProjectHighlights();
}

// Function to show project overlay
function showProjectOverlay(projectId) {
    console.log('Showing overlay for:', projectId);
    currentProject = projectId;
    currentProjectSlideIndex = 1;
    
    const overlay = document.getElementById('projectOverlay');
    const project = projectData[projectId];
    
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }
    
    // Create slide indicators based on slide count
    createSlideIndicators(project.slides.length);
    
    // Prevent background interaction
    document.body.classList.add('overlay-active');
    
    // Clear any existing timeout
    clearTimeout(overlayTimeout);
    
    // Update slide content
    updateProjectSlide();
    
    // Show overlay
    overlay.classList.add('active');
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    console.log('Overlay shown successfully');
}

// Function to hide project overlay
function hideProjectOverlay() {
    const overlay = document.getElementById('projectOverlay');
    
    // Re-enable background interaction
    document.body.classList.remove('overlay-active');
    
    // Hide overlay
    overlay.classList.remove('active');
    
    // Restore background scrolling
    document.body.style.overflow = '';
    
    console.log('Overlay hidden');
}

// Update slide content
// Update slide content
function updateProjectSlide() {
    const project = projectData[currentProject];
    if (!project || !project.slides[currentProjectSlideIndex - 1]) {
        console.error('Project or slide not found:', currentProject, currentProjectSlideIndex);
        return;
    }
    const slide = project.slides[currentProjectSlideIndex - 1];

    // Update content
    const titleElement = document.getElementById('overlayTitle');
    const imageElement = document.getElementById('overlayImage');
    const descriptionElement = document.getElementById('overlayDescription');

    if (titleElement) {
        // Clear existing content
        titleElement.innerHTML = '';
        
        // Create title text
        const titleText = document.createElement('h2');
        titleText.textContent = project.title;
        titleText.style.margin = '0';
        titleText.style.fontWeight = '700';
        titleText.style.color = '#2c3e50';
        
        // Create GitHub link
        const githubLink = document.createElement('a');
        githubLink.href = project.github || '#'; // Add github property to your project data
        githubLink.className = 'github-link';
        githubLink.target = '_blank';
        githubLink.rel = 'noopener noreferrer';
        githubLink.title = 'View on GitHub';
        
        // Add GitHub SVG icon
        githubLink.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .5C5.648.5.5 5.649.5 12c0 5.094 3.292 9.41 7.865 10.942.575.106.784-.25.784-.555 0-.274-.01-1-.015-1.96-3.198.695-3.873-1.54-3.873-1.54-.523-1.33-1.275-1.686-1.275-1.686-1.044-.714.08-.7.08-.7 1.154.083 1.76 1.184 1.76 1.184 1.026 1.758 2.695 1.25 3.35.955.106-.743.403-1.25.732-1.538-2.553-.29-5.234-1.275-5.234-5.678 0-1.254.445-2.28 1.176-3.084-.12-.29-.51-1.455.11-3.034 0 0 .96-.308 3.14 1.175a10.8 10.8 0 012.86-.39 10.8 10.8 0 012.86.39c2.18-1.483 3.135-1.175 3.135-1.175.623 1.58.235 2.745.115 3.034.735.803 1.175 1.83 1.175 3.084 0 4.414-2.69 5.385-5.25 5.67.415.357.78 1.065.78 2.15 0 1.553-.015 2.803-.015 3.184 0 .31.206.67.792.555C20.71 21.403 24 17.102 24 12c0-6.35-5.148-11.5-12-11.5z" />
            </svg>
        `;
        
        // Append both to title element
        titleElement.appendChild(titleText);
        titleElement.appendChild(githubLink);
    }

    if (imageElement) {
        imageElement.src = slide.image;
        imageElement.alt = `${project.title} - Slide ${currentProjectSlideIndex}`;
    }

    if (descriptionElement) {
        descriptionElement.innerHTML = `<p>${slide.description}</p>`;
    }

    // Update indicators
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentProjectSlideIndex - 1);
    });

    console.log('Updated slide:', currentProjectSlideIndex, 'for project:', currentProject);
}


// Change slide function
function changeProjectSlide(direction) {
    const project = projectData[currentProject];
    if (!project) {
        console.error('No current project for slide change');
        return;
    }
    
    const totalSlides = project.slides.length;
    currentProjectSlideIndex += direction;
    
    if (currentProjectSlideIndex > totalSlides) {
        currentProjectSlideIndex = 1;
    } else if (currentProjectSlideIndex < 1) {
        currentProjectSlideIndex = totalSlides;
    }
    
    updateProjectSlide();
}

// Go to specific slide
function currentProjectSlide(slideNumber) {
    const project = projectData[currentProject];
    if (!project) {
        console.error('No current project for direct slide navigation');
        return;
    }
    
    if (slideNumber >= 1 && slideNumber <= project.slides.length) {
        currentProjectSlideIndex = slideNumber;
        updateProjectSlide();
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Projects.js loaded with click-to-open functionality');
    
    const projectCards = document.querySelectorAll('.project-card');
    const overlay = document.getElementById('projectOverlay');
    const serviceItems = document.querySelectorAll('.service-item');
    
    if (!overlay) {
        console.error('Project overlay not found!');
        return;
    }
    
    // Project card CLICK - show overlay
    projectCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const projectId = this.dataset.project;
            if (projectData[projectId]) {
                clearTimeout(overlayTimeout);
                showProjectOverlay(projectId);
            } else {
                console.error('Project data not found for:', projectId);
            }
        });
    });

    // Get the overlay content element specifically
    const overlayContent = document.querySelector('.project-overlay-content');

    if (overlayContent) {
        // Close when mouse leaves the CONTENT area
        overlayContent.addEventListener('mouseleave', function() {
            console.log('Mouse left overlay content - closing');
            overlayTimeout = setTimeout(() => {
                hideProjectOverlay();
            }, 200);
        });

        // Keep overlay open when mouse is inside the CONTENT
        overlayContent.addEventListener('mouseenter', function() {
            console.log('Mouse entered overlay content - keeping open');
            clearTimeout(overlayTimeout);
        });
    }

    // Close on click outside the CONTENT
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            console.log('Clicked outside content - closing');
            hideProjectOverlay();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            console.log('Escape key pressed - closing');
            hideProjectOverlay();
        }
    });
    
    // Service items functionality
    // Service items functionality
serviceItems.forEach(item => {
    const serviceType = item.dataset.service;
    
    item.addEventListener('mouseenter', function() {
        if (overlay.classList.contains('active')) return;
        applyServiceTheme(serviceType, false);
    });
    
    item.addEventListener('mouseleave', function() {
        if (overlay.classList.contains('active')) return;
        if (activeService !== serviceType) {
            if (activeService) {
                applyServiceTheme(activeService, true);
            } else {
                resetServiceTheme();
            }
        }
    });
    
    item.addEventListener('click', function(e) {
        if (overlay.classList.contains('active')) return;
        
        // If clicking on an already active service, just deselect it without scrolling
        if (activeService === serviceType) {
            e.preventDefault(); // Prevent anchor link navigation
            activeService = null;
            serviceItems.forEach(service => service.classList.remove('active'));
            resetServiceTheme();
            return;
        }
        
        // For new selections, allow normal anchor behavior but also apply theming
        serviceItems.forEach(service => service.classList.remove('active'));
        activeService = serviceType;
        this.classList.add('active');
        applyServiceTheme(serviceType, true);
        
        // Let the anchor link handle navigation to projects section
    });
});
    
    // Reset themes when leaving services container
    const servicesContainer = document.querySelector('.services-container');
    if (servicesContainer) {
        servicesContainer.addEventListener('mouseleave', function() {
            if (overlay.classList.contains('active')) return;
            if (activeService) {
                applyServiceTheme(activeService, true);
            } else {
                resetServiceTheme();
            }
        });
    }
});document.addEventListener("DOMContentLoaded", function() {
  if (window.matchMedia("(max-width: 480px)").matches) {
    var indicator = document.querySelector('.scroll-indicator');
    window.addEventListener('scroll', function() {
      if (!indicator) return;
      if (window.scrollY > 10) {
        indicator.style.opacity = '0';
      } else {
        indicator.style.opacity = '1';
      }
    });
  }
});
// Temporary pagination display
function showTempPagination() {
  const tempPagination = document.getElementById('tempPagination');
  const paginationDots = document.getElementById('paginationDots');
  
  if (!tempPagination || !paginationDots) return;
  
  paginationDots.innerHTML = '';
  
  const project = projectData[currentProject];
  if (!project) return;
  
  for (let i = 1; i <= project.slides.length; i++) {
    const dot = document.createElement('span');
    dot.className = `pagination-dot ${i === currentProjectSlideIndex ? 'active' : ''}`;
    dot.onclick = () => currentProjectSlide(i);
    paginationDots.appendChild(dot);
  }
  
  tempPagination.classList.add('show');
  setTimeout(() => tempPagination.classList.remove('show'), 2000);
}


