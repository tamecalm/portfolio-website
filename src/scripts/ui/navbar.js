/**
 * Navigation bar functionality
 */
import { $, $$ } from '../utils/dom.js';
import { throttle } from '../utils/helpers.js';

/**
 * Initialize navbar functionality
 */
export const initNavbar = () => {
  setupScrollBehavior();
  setupMobileMenu();
  setupActiveLinks();
  setupScrollSpy();
};

/**
 * Set up navbar behavior on scroll
 */
const setupScrollBehavior = () => {
  const navbar = $('.navbar');
  if (!navbar) return;
  
  // Threshold for adding the scrolled class (px)
  const scrollThreshold = 50;
  
  // Handle scroll event with throttle for performance
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 100));
};

/**
 * Set up mobile menu toggle
 */
const setupMobileMenu = () => {
  const menuToggle = $('.menu-toggle');
  const mobileMenu = $('.navbar-links');
  
  if (!menuToggle || !mobileMenu) return;
  
  // Toggle mobile menu visibility
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('active') &&
      !mobileMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
  
  // Close mobile menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
  
  // Close mobile menu on window resize (when switching to desktop)
  window.addEventListener('resize', throttle(() => {
    if (window.innerWidth >= 768 && mobileMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }, 200));
};

/**
 * Set up active link highlighting
 */
const setupActiveLinks = () => {
  const navLinks = $$('.navbar-links a');
  
  // Update active link based on current URL
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Handle index page specially
    if (linkPath === '/' && (currentPath === '/' || currentPath === '/index.html')) {
      link.classList.add('active');
    }
    // Handle other pages
    else if (linkPath !== '/' && currentPath.includes(linkPath)) {
      link.classList.add('active');
    }
  });
};

/**
 * Set up scroll spy for single-page navigation
 */
const setupScrollSpy = () => {
  const navLinks = $$('.navbar-links a[href^="#"]');
  if (navLinks.length === 0) return;
  
  // Get all sections that should be tracked
  const sections = [];
  navLinks.forEach(link => {
    const sectionId = link.getAttribute('href').substring(1);
    const section = document.getElementById(sectionId);
    
    if (section) {
      sections.push({
        id: sectionId,
        element: section,
        link: link
      });
    }
  });
  
  if (sections.length === 0) return;
  
  // Update active section on scroll
  window.addEventListener('scroll', throttle(() => {
    // Get current scroll position with a small offset
    const scrollPosition = window.scrollY + 100; // 100px offset for navbar height
    
    // Find the current section
    let currentSection = sections[0];
    
    for (const section of sections) {
      const sectionTop = section.element.offsetTop;
      
      if (scrollPosition >= sectionTop) {
        currentSection = section;
      }
    }
    
    // Update active links
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    currentSection.link.classList.add('active');
  }, 100));
  
  // Set up smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const sectionId = link.getAttribute('href').substring(1);
      const section = document.getElementById(sectionId);
      
      if (section) {
        // Get the navbar height for offset
        const navbar = $('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        
        // Calculate the position to scroll to
        const targetPosition = section.offsetTop - navbarHeight;
        
        // Smooth scroll to the target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
};

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', initNavbar);