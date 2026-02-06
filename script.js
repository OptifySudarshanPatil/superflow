// Global Application State
const appState = {
  currentPage: 1,
  currentSubPage: null,
  currentTab: 1,
  carouselIndex: {},
  fullscreenActive: false,
  pageHistory: [],
  canNavigate: true,
};

// DOM Elements
const portraitBlocker = document.getElementById('portraitBlocker');
const appContainer = document.getElementById('appContainer');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const nextPageIndicator1 = document.getElementById('nextPageIndicator1');
const nextPageIndicator2 = document.getElementById('nextPageIndicator2');
const introText = document.getElementById('introText');
const subPagesContainer = document.getElementById('subPagesContainer');

const PRODUCTS = ['Rice', 'Corn', 'Wheat', 'Cattle', 'Poultry', 'Aqua'];

/**
 * Initialize Application
 */
function initApp() {
  checkOrientation();
  setupEventListeners();
  preventDefaultNavigation();
}

/**
 * Check and handle device orientation
 */
function checkOrientation() {
  const updateOrientation = () => {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isSmallScreen = window.innerHeight < window.innerWidth;

    if (isPortrait) {
      portraitBlocker.classList.add('active');
      appContainer.style.pointerEvents = 'none';
      appContainer.style.opacity = '0.3';
    } else {
      portraitBlocker.classList.remove('active');
      appContainer.style.pointerEvents = 'auto';
      appContainer.style.opacity = '1';
    }
  };

  updateOrientation();
  window.addEventListener('orientationchange', updateOrientation);
  window.addEventListener('resize', updateOrientation);
}

/**
 * Prevent browser back button and history manipulation
 */
function preventDefaultNavigation() {
  // Prevent back button
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', () => {
    history.pushState(null, null, location.href);
  });

  // Prevent keyboard back shortcuts (Alt+Left, etc.)
  window.addEventListener('keydown', (e) => {
    if ((e.altKey && e.key === 'ArrowLeft') || (e.altKey && e.key === 'ArrowRight')) {
      e.preventDefault();
    }
  });
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
  // Page 1: Next Page on indicator click or user interaction
  document.addEventListener('click', handleFirstInteraction, { once: true });
  nextPageIndicator1.addEventListener('click', () => transitionToPage2());

  // Page 2: Setup after animation completes
  // Page 3: Selection buttons
  document.addEventListener('click', handleSelectionClick);

  // Prevent scrolling
  window.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
  window.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

/**
 * Handle first user interaction - trigger fullscreen and show next indicator on Page 1
 */
function handleFirstInteraction(event) {
  if (appState.currentPage !== 1) return;

  requestFullscreen();

  // Start the 8-second delay timer for Page 1
  setTimeout(() => {
    nextPageIndicator1.classList.remove('hidden');
  }, 8000);
}

/**
 * Request fullscreen mode (graceful fallback for different browsers)
 */
function requestFullscreen() {
  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  }

  appState.fullscreenActive = true;
}

/**
 * Transition to Page 2
 */
function transitionToPage2() {
  if (!appState.canNavigate) return;
  appState.canNavigate = false;

  appState.currentPage = 2;
  appState.pageHistory.push(1);

  // Exit Page 1
  page1.classList.remove('active');
  page1.classList.add('exit-up');

  // Enter Page 2
  setTimeout(() => {
    page2.classList.add('active');
    animateIntroText();
  }, 400);

  // Re-enable navigation after page transition
  setTimeout(() => {
    appState.canNavigate = true;
  }, 800);
}

/**
 * Animate the intro text word-by-word at natural reading pace
 */
function animateIntroText() {
  const rawText = 'Hi!, I\'m OIS AI, Learn how to make milling operations more profitable?';
  const words = rawText.split(' ');

  introText.innerHTML = '';
  let wordIndex = 0;
  const wordDelayMs = 300; // ~200 WPM (comfortable reading speed for presentation)

  const animateWord = () => {
    if (wordIndex < words.length) {
      const word = document.createElement('span');
      word.className = 'word';
      word.textContent = words[wordIndex];
      if (wordIndex < words.length - 1) {
        word.textContent += ' ';
      }
      introText.appendChild(word);

      // Force reflow and trigger animation
      word.offsetHeight;
      word.style.animation = `fadeInUp 0.4s ease-out forwards`;

      wordIndex++;
      setTimeout(animateWord, wordDelayMs);
    } else {
      // All words animated - wait 2 seconds then show next indicator
      setTimeout(() => {
        nextPageIndicator2.classList.remove('hidden');
      }, 2000);
    }
  };

  animateWord();
}

/**
 * Transition to Page 3
 */
function transitionToPage3() {
  if (!appState.canNavigate) return;
  appState.canNavigate = false;

  appState.currentPage = 3;
  appState.pageHistory.push(2);

  // Exit Page 2
  page2.classList.remove('active');
  page2.classList.add('exit-up');

  // Enter Page 3
  setTimeout(() => {
    page3.classList.add('active');
  }, 400);

  // Re-enable navigation
  setTimeout(() => {
    appState.canNavigate = true;
  }, 800);
}

/**
 * Handle selection button clicks
 */
function handleSelectionClick(event) {
  const selectionButton = event.target.closest('.selection-button');
  if (selectionButton && appState.currentPage === 3) {
    const product = selectionButton.dataset.product;
    transitionToSubPage(product);
    return;
  }

  const nextIndicator2 = event.target.closest('#nextPageIndicator2');
  if (nextIndicator2 && appState.currentPage === 2) {
    transitionToPage3();
    return;
  }

  const tabButton = event.target.closest('.tab-button');
  if (tabButton && appState.currentSubPage) {
    const tab = tabButton.dataset.tab;
    switchTab(tab);
    return;
  }

  const carouselPrev = event.target.closest('.carousel-prev');
  if (carouselPrev && appState.currentSubPage) {
    previousCarouselImage();
    return;
  }

  const carouselNext = event.target.closest('.carousel-next');
  if (carouselNext && appState.currentSubPage) {
    nextCarouselImage();
    return;
  }
}

/**
 * Transition to a sub-page
 */
function transitionToSubPage(product) {
  if (!appState.canNavigate) return;
  appState.canNavigate = false;

  appState.currentPage = 'sub';
  appState.currentSubPage = product;
  appState.currentTab = 1;
  appState.pageHistory.push(3);

  // Exit Page 3
  page3.classList.remove('active');
  page3.classList.add('exit-up');

  // Enter Sub-page
  setTimeout(() => {
    subPagesContainer.classList.remove('hidden');
    const subPage = document.getElementById(`subpage-${product}`);
    if (subPage) {
      subPage.classList.add('active');
      // Ensure first tab is active
      const firstTabContent = subPage.querySelector('.tab-content[data-tab="1"]');
      const firstTabButton = subPage.querySelector('.tab-button[data-tab="1"]');
      
      if (firstTabContent && firstTabButton) {
        firstTabContent.classList.add('active');
        firstTabButton.classList.add('active');
        
        // Initialize carousel display for first tab
        const carouselKey = `${product}-1`;
        appState.carouselIndex[carouselKey] = 0;
        updateCarouselDisplay(subPage, '1');
      }
    }
  }, 400);

  // Re-enable navigation
  setTimeout(() => {
    appState.canNavigate = true;
  }, 800);
}

/**
 * Switch between tabs in a sub-page
 */
function switchTab(tabNumber) {
  appState.currentTab = parseInt(tabNumber);
  const subPage = document.getElementById(`subpage-${appState.currentSubPage}`);

  if (!subPage) return;

  // Update tab buttons
  const tabButtons = subPage.querySelectorAll('.tab-button');
  tabButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabNumber) {
      btn.classList.add('active');
    }
  });

  // Update tab content
  const tabContents = subPage.querySelectorAll('.tab-content');
  tabContents.forEach((content) => {
    content.classList.remove('active');
    if (content.dataset.tab === tabNumber) {
      content.classList.add('active');
    }
  });

  // Initialize carousel for this tab if needed
  initializeCarouselForTab(tabNumber, subPage);
}

/**
 * Initialize carousel for a specific tab
 */
function initializeCarouselForTab(tabNumber, subPage) {
  const carouselKey = `${appState.currentSubPage}-${tabNumber}`;

  if (!appState.carouselIndex.hasOwnProperty(carouselKey)) {
    appState.carouselIndex[carouselKey] = 0;
  }

  updateCarouselDisplay(subPage, tabNumber);
}

/**
 * Navigate to next carousel image
 */
function nextCarouselImage() {
  const carouselKey = `${appState.currentSubPage}-${appState.currentTab}`;
  const subPage = document.getElementById(`subpage-${appState.currentSubPage}`);

  if (subPage) {
    const carousel = subPage.querySelector(
      `.tab-content[data-tab="${appState.currentTab}"] .carousel`
    );

    if (carousel) {
      const images = carousel.querySelectorAll('.carousel-image, .carousel-placeholder');
      if (images.length > 0) {
        const currentIndex = appState.carouselIndex[carouselKey] || 0;
        const nextIndex = (currentIndex + 1) % images.length;
        appState.carouselIndex[carouselKey] = nextIndex;
        updateCarouselDisplay(subPage, appState.currentTab);
      }
    }
  }
}

/**
 * Navigate to previous carousel image
 */
function previousCarouselImage() {
  const carouselKey = `${appState.currentSubPage}-${appState.currentTab}`;
  const subPage = document.getElementById(`subpage-${appState.currentSubPage}`);

  if (subPage) {
    const carousel = subPage.querySelector(
      `.tab-content[data-tab="${appState.currentTab}"] .carousel`
    );

    if (carousel) {
      const images = carousel.querySelectorAll('.carousel-image, .carousel-placeholder');
      if (images.length > 0) {
        const currentIndex = appState.carouselIndex[carouselKey] || 0;
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        appState.carouselIndex[carouselKey] = prevIndex;
        updateCarouselDisplay(subPage, appState.currentTab);
      }
    }
  }
}

/**
 * Update carousel display with current index
 */
function updateCarouselDisplay(subPage, tabNumber) {
  const carousel = subPage.querySelector(
    `.tab-content[data-tab="${tabNumber}"] .carousel`
  );

  if (!carousel) return;

  const images = carousel.querySelectorAll('.carousel-image, .carousel-placeholder');
  const indicators = carousel.querySelectorAll('.indicator');
  const carouselKey = `${appState.currentSubPage}-${tabNumber}`;
  const currentIndex = appState.carouselIndex[carouselKey] || 0;

  // Update image visibility
  images.forEach((img, idx) => {
    img.classList.remove('active');
    if (idx === currentIndex) {
      img.classList.add('active');
    }
  });

  // Update indicators
  indicators.forEach((indicator, idx) => {
    indicator.classList.remove('active');
    indicator.textContent = idx === currentIndex ? '#' : '*';
    if (idx === currentIndex) {
      indicator.classList.add('active');
    }
  });
}

/**
 * Create and setup sub-pages
 */
function createSubPages() {
  const template = document.getElementById('subPageTemplate');
  const container = document.getElementById('subPagesContainer');

  PRODUCTS.forEach((product) => {
    const subPage = template.cloneNode(true);
    subPage.id = `subpage-${product}`;
    subPage.style.display = 'flex';
    subPage.classList.remove('hidden');

    // Initialize carousel indices for all tabs
    for (let tab = 1; tab <= 4; tab++) {
      const carouselKey = `${product}-${tab}`;
      appState.carouselIndex[carouselKey] = 0;
    }

    // Setup tab buttons with event delegation
    const tabButtons = subPage.querySelectorAll('.tab-button');
    tabButtons.forEach((btn, index) => {
      if (index === 0) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        switchTab(btn.dataset.tab);
      });
    });

    // Setup carousel controls with proper event handling
    const tabContents = subPage.querySelectorAll('.tab-content');
    tabContents.forEach((content, index) => {
      const isActive = index === 0;
      if (isActive) {
        content.classList.add('active');
      }

      // Initialize carousel images - set first image as active
      const carouselImages = content.querySelectorAll('.carousel-image, .carousel-placeholder');
      const carouselIndicators = content.querySelectorAll('.indicator');

      carouselImages.forEach((img, imgIndex) => {
        if (imgIndex === 0) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });

      carouselIndicators.forEach((indicator, indIdx) => {
        if (indIdx === 0) {
          indicator.classList.add('active');
          indicator.textContent = '#';
        } else {
          indicator.classList.remove('active');
          indicator.textContent = '*';
        }
      });

      // Setup carousel prev/next buttons
      const carouselPrev = content.querySelector('.carousel-prev');
      const carouselNext = content.querySelector('.carousel-next');

      if (carouselPrev) {
        carouselPrev.addEventListener('click', (e) => {
          e.stopPropagation();
          if (appState.currentSubPage === product && appState.currentTab === parseInt(content.dataset.tab)) {
            previousCarouselImage();
          }
        });
      }

      if (carouselNext) {
        carouselNext.addEventListener('click', (e) => {
          e.stopPropagation();
          if (appState.currentSubPage === product && appState.currentTab === parseInt(content.dataset.tab)) {
            nextCarouselImage();
          }
        });
      }
    });

    container.appendChild(subPage);
  });
}

/**
 * Initialize spin wheel with circular word positioning
 */
function initializeSpinWheel() {
  const spinWheel = document.querySelector('.spin-wheel');
  const wheelWords = document.querySelectorAll('.wheel-word');
  const wheelCenter = document.querySelector('.wheel-center');

  if (!spinWheel) return;

  const wheelRadius = 140; // Distance from center to word position
  const wordCount = wheelWords.length;

  wheelWords.forEach((word, index) => {
    const angle = (index / wordCount) * 360;
    const angleInRadians = (angle * Math.PI) / 180;

    // Calculate position on circle
    const x = Math.cos(angleInRadians) * wheelRadius;
    const y = Math.sin(angleInRadians) * wheelRadius;

    // Adjust text orientation based on position
    let textRotation = angle + 90;

    // Flip text for bottom half to keep it readable
    if (angle > 90 && angle < 270) {
      textRotation += 180;
    }

    word.style.setProperty(
      '--x',
      `${x}px`
    );
    word.style.setProperty(
      '--y',
      `${y}px`
    );
    word.style.transform = `translate(calc(-50% + var(--x, 0px)), calc(-50% + var(--y, 0px))) rotate(${textRotation}deg)`;
  });

  // Highlight the word at the top (aligned with sentence)
  // This word rotates into position as the wheel spins
  const highlightTopWord = () => {
    wheelWords.forEach((word, index) => {
      word.classList.remove('highlighted');
    });
    // Highlight word at index 5 (middle of rotating words) as example
    if (wheelWords[5]) {
      wheelWords[5].classList.add('highlighted');
    }
  };

  highlightTopWord();
}

/**
 * Start the application
 */
document.addEventListener('DOMContentLoaded', () => {
  createSubPages();
  initializeSpinWheel();
  initApp();
});

// Cleanup and prevent common navigation issues
window.addEventListener('beforeunload', (e) => {
  // Allow normal navigation away from site
  return undefined;
});

// Prevent accidental page refresh
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R')) {
    // Allow refresh but you could prevent it if needed
  }
  if (e.key === 'F5') {
    // Allow F5 refresh
  }
});
