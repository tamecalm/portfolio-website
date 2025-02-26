/**
 * UI animations and transitions
 */
import { $$, $ } from '../utils/dom.js';
import { isInViewport, throttle } from '../utils/helpers.js';

/**
 * Elements that should animate when they come into view
 */
const animatableElements = [
  { selector: '.fade-in', animation: 'fadeIn' },
  { selector: '.slide-up', animation: 'slideUp' },
  { selector: '.slide-down', animation: 'slideDown' },
  { selector: '.slide-left', animation: 'slideLeft' },
  { selector: '.slide-right', animation: 'slideRight' },
  { selector: '.scale-in', animation: 'scaleIn' },
  { selector: '.rotate-in', animation: 'rotateIn' },
  { selector: '.project-card', animation: 'fadeInUp', delay: true },
  { selector: '.skill-badge', animation: 'popIn', delay: true },
];

/**
 * Initialize animations
 */
export const initAnimations = () => {
  // Set up scroll-triggered animations
  setupScrollAnimations();
  
  // Set up hover animations
  setupHoverAnimations();
  
  // Set up click animations
  setupClickAnimations();
  
  // Initial check for elements in viewport
  checkElementsInViewport();
};

/**
 * Set up animations triggered by scrolling
 */
const setupScrollAnimations = () => {
  // Handle scroll event with throttle for performance
  window.addEventListener('scroll', throttle(() => {
    checkElementsInViewport();
  }, 150));
  
  // Handle resize events (e.g., when orientation changes)
  window.addEventListener('resize', throttle(() => {
    checkElementsInViewport();
  }, 250));
};

/**
 * Check which elements are in the viewport and animate them
 */
const checkElementsInViewport = () => {
  animatableElements.forEach(({ selector, animation, delay }) => {
    const elements = $$(selector);
    
    elements.forEach((element, index) => {
      // Skip elements that have already been animated
      if (element.classList.contains('animated')) {
        return;
      }
      
      // Check if element is in viewport
      if (isInViewport(element, -50)) { // -50px offset to trigger animation slightly earlier
        // Add a delay if specified and there are multiple elements
        if (delay && elements.length > 1) {
          const delayTime = index * 100; // 100ms between each element
          setTimeout(() => {
            animateElement(element, animation);
          }, delayTime);
        } else {
          animateElement(element, animation);
        }
      }
    });
  });
};

/**
 * Apply animation to an element
 * @param {Element} element - Element to animate
 * @param {string} animationName - Name of the animation to apply
 */
const animateElement = (element, animationName) => {
  // Add the animation class
  element.classList.add(animationName);
  
  // Mark as animated to avoid re-animation
  element.classList.add('animated');
  
  // Listen for animation end to clean up classes if needed
  element.addEventListener('animationend', () => {
    // Some animations may want to keep their final state (handled by CSS)
    // For others, we might want to remove the animation class
    if (element.dataset.removeAnimation === 'true') {
      element.classList.remove(animationName);
    }
  }, { once: true });
};

/**
 * Set up animations triggered by hover
 */
const setupHoverAnimations = () => {
  // Project cards hover effect
  const projectCards = $$('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover');
    });
  });
  
  // Navigation links hover effect
  const navLinks = $$('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.classList.add('hover');
    });
    
    link.addEventListener('mouseleave', () => {
      link.classList.remove('hover');
    });
  });
  
  // Buttons hover effect
  const buttons = $$('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.classList.add('hover');
    });
    
    button.addEventListener('mouseleave', () => {
      button.classList.remove('hover');
    });
  });
};

/**
 * Set up animations triggered by clicks
 */
const setupClickAnimations = () => {
  // Button click ripple effect
  const buttons = $$('.btn, .btn-link');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      // Position the ripple where the user clicked
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      button.appendChild(ripple);
      
      // Remove the ripple after animation completes
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Mobile menu toggle animation
  const menuToggle = $('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
    });
  }
};

// Initialize animations when the DOM is loaded
document.addEventListener('DOMContentLoaded', initAnimations);