// BALANCED SHOOTING STAR SYSTEM - PRESERVES ALL FUNCTIONALITY
// Check if we're on the projects page
const isProjectsPage = window.location.pathname.includes('projects.html');
const starsContainer = isProjectsPage 
    ? document.querySelector('.project-hero #shooting-star-bg')
    : document.getElementById('shooting-star-bg');

if (!starsContainer) {
    console.log('No stars container found');
} else {
    // Adjust star count based on page
    const starCount = isProjectsPage ? 60 : 120; // Fewer stars for project hero
}
    // Create background stars
for (let i = 0; i < 120; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  const isBig = Math.random() > 0.95;
  const size = isBig ? (5 + Math.random() * 3) : (2 + Math.random() * 2);
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.backgroundColor = Math.random() > 0.5 ? 'white' : 'gold';
  star.style.top = `${Math.random() * 100}vh`;
  star.style.left = `${Math.random() * 100}vw`;
  star.style.animationDelay = `${Math.random() * 3}s`;
  document.getElementById('shooting-star-bg').appendChild(star);
}

function createShootingStar() {
  const container = document.createElement('div');
  container.className = 'shooting-star-container';
  const star = document.createElement('div');
  star.className = 'shooting-star';
  
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight * 0.8;
  const endX = Math.random() * window.innerWidth;
  const endY = Math.random() * window.innerHeight;
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const duration = Math.random() * 2000 + 2000;
  const speed = distance / duration;
  const trailingWidth = Math.random() * 80 + 40;
  const trailingHeight = Math.random() * 1.5 + 1.5;
  
  // Create trail
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: absolute;
    width: ${trailingWidth}px;
    height: ${trailingHeight}px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 70%, white 100%);
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    border-radius: 1px;
    pointer-events: none;
  `;
  
  star.appendChild(trail);
  container.appendChild(star);
  
  // Position container (accounting for larger size)
  container.style.left = `${startX - 30}px`; // Center the larger container
  container.style.top = `${startY - 30}px`; // Center the larger container
  container.style.transform = `rotate(${angle}deg)`;
  container.dataset.speed = speed;
  
  // Add hover effect for better visual feedback
  container.style.transition = 'transform 0.1s ease';
  container.addEventListener('mouseenter', () => {
    container.style.transform = `rotate(${angle}deg) scale(1.2)`;
  });
  container.addEventListener('mouseleave', () => {
    container.style.transform = `rotate(${angle}deg) scale(1)`;
  });
  
  document.getElementById('shooting-star-bg').appendChild(container);
  
  // Animation (adjust for new container size)
  const animation = container.animate([
    { left: `${startX - 30}px`, top: `${startY - 30}px`, opacity: 1 },
    { left: `${endX - 30}px`, top: `${endY - 30}px`, opacity: 0 }
  ], {
    duration: duration,
    easing: 'ease-out',
    fill: 'forwards'
  });
  
  // Enhanced click handler with larger detection area
  const clickHandler = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('⭐ Shooting star burst!'); // Success feedback
    
    // Prevent text selection
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
    
    // Get center of the container for burst effect
    const rect = container.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const currentSpeed = parseFloat(container.dataset.speed) || 1;
    const baseGlowSize = Math.min(currentSpeed * 10 + 20, 45); // Larger glow
    const glowSize = baseGlowSize + Math.random() * 20;
    const numParticles = Math.floor(currentSpeed * 15 + 20); // More particles
    const particleSize = Math.min(currentSpeed * 2 + 5, 12);
    const burstRange = Math.min(currentSpeed * 60 + 100, 180); // Larger burst

    // Enhanced glow effect
    const glow = document.createElement('div');
    glow.className = 'glow';
    glow.style.position = 'fixed';
    glow.style.width = `${glowSize}px`;
    glow.style.height = `${glowSize}px`;
    glow.style.left = `${x - glowSize/2}px`;
    glow.style.top = `${y - glowSize/2}px`;
    glow.style.boxShadow = `0 0 ${glowSize * 4}px ${glowSize * 2}px rgba(255,255,255,0.9)`;
    glow.style.zIndex = '10001';
    glow.style.pointerEvents = 'none';
    
    document.body.appendChild(glow);
    setTimeout(() => {
      if (glow.parentNode) {
        glow.remove();
      }
    }, 600);

    // Enhanced particle burst
    for (let j = 0; j < numParticles; j++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const offsetX = (Math.random() - 0.5) * burstRange;
        const offsetY = (Math.random() - 0.5) * burstRange;
        const pSize = particleSize + Math.random() * 5;
        
        p.style.position = 'fixed';
        p.style.width = `${pSize}px`;
        p.style.height = `${pSize}px`;
        p.style.left = `${x + offsetX}px`;
        p.style.top = `${y + offsetY}px`;
        p.style.backgroundColor = Math.random() > 0.5 ? 'gold' : 'white';
        p.style.zIndex = '10001';
        p.style.pointerEvents = 'none';
        p.style.boxShadow = '0 0 6px rgba(255,255,255,0.8)'; // Glowing particles
        
        const fallDuration = 1800 + (currentSpeed * 400);
        p.style.animation = `fall ${fallDuration}ms ease-out forwards`;
        
        document.body.appendChild(p);
        setTimeout(() => {
          if (p.parentNode) {
            p.remove();
          }
        }, fallDuration);
    }

    // Remove the shooting star immediately
    if (container.parentNode) {
      container.remove();
    }
    animation.cancel();
  };
  
  // Add click event listener
  container.addEventListener('click', clickHandler, { capture: true });
  
  // Cleanup
  setTimeout(() => {
    if (container.parentNode) {
      container.remove();
    }
  }, duration);
}

// Create shooting stars at intervals
setInterval(() => {
  if (Math.random() > 0.3) {
    createShootingStar();
  }
}, 2000);

// Create initial shooting star
createShootingStar();