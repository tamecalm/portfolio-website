/**
 * Header Component
 */
import { throttle } from '../scripts/utils/helpers.js';

class Header {
  constructor(container) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('Header: Container not found');
      return;
    }
    
    this.render();
    this.setupEventListeners();
  }
  
  /**
   * Render the header
   */
  render() {
    const headerHTML = `
      <header class="header">
        <div class="navbar">
          <div class="navbar-container">
            <a href="/" class="logo">
              <span class="logo-text">Your Name</span>
            </a>
            
            <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
              <span class="menu-toggle-bar"></span>
              <span class="menu-toggle-bar"></span>
              <span class="menu-toggle-bar"></span>
            </button>
            
            <nav class="navbar-links">
              <ul class="nav-list">
                <li class="nav-item">
                  <a href="#home" class="nav-link">Home</a>
                </li>
                <li class="nav-item">
                  <a href="#about" class="nav-link">About</a>
                </li>
                <li class="nav-item">
                  <a href="#projects" class="nav-link">Projects</a>
                </li>
                <li class="nav-item">
                  <a href="#skills" class="nav-link">Skills</a>
                </li>
                <li class="nav-item">
                  <a href="#contact" class="nav-link">Contact</a>
                </li>
              </ul>
            </nav>
            
            <div class="navbar-actions">
              <a href="/resume.pdf" class="btn btn-outline" target="_blank">
                Resume
              </a>
              <button class="theme-toggle" aria-label="Toggle dark theme">
                <i class="fa-solid fa-sun light-icon"></i>
                <i class="fa-solid fa-moon dark-icon"></i>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
    
    this.container.innerHTML = headerHTML;
    
    // Store references to elements
    this.navbar = this.container.querySelector('.navbar');
    this.menuToggle = this.container.querySelector('.menu-toggle');
    this.navbarLinks = this.container.querySelector('.navbar-links');
    this.themeToggle = this.container.querySelector('.theme-toggle');
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Toggle mobile menu
    this.menuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    
    // Close mobile menu when clicking on a link
    const navLinks = this.container.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.navbarLinks.classList.contains('active')) {
          this.toggleMobileMenu();
        }
      });
    });
    
    // Toggle theme
    this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    
    // Handle scroll events for navbar appearance
    window.addEventListener('scroll', throttle(this.handleScroll.bind(this), 100));
    
    // Set up scroll spy for navigation
    this.setupScrollSpy();
    
    // Check initial theme preference
    this.checkThemePreference();
  }
  
  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    this.menuToggle.classList.toggle('active');
    this.navbarLinks.classList.toggle('active');
    
    // Toggle aria-expanded
    const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
    this.menuToggle.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle body class to prevent scrolling
    document.body.classList.toggle('menu-open');
  }
  
  /**
   * Toggle dark/light theme
   */
  toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Store preference
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    
    // Toggle theme toggle button appearance
    this.themeToggle.classList.toggle('dark-active', isDarkTheme);
  }
  
  /**
   * Check user's theme preference
   */
  checkThemePreference() {
    // Check local storage preference
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      this.themeToggle.classList.add('dark-active');
    } else if (storedTheme === 'light') {
      document.body.classList.remove('dark-theme');
      this.themeToggle.classList.remove('dark-active');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (prefersDark) {
        document.body.classList.add('dark-theme');
        this.themeToggle.classList.add('dark-active');
      }
    }
  }
  
  /**
   * Handle scroll events for navbar appearance
   */
  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }
  
  /**
   * Set up scroll spy for navigation
   */
  setupScrollSpy() {
    const navLinks = this.container.querySelectorAll('.nav-link');
    const sections = [];
    
    // Collect sections from nav links
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        sections.push({
          id: targetId,
          element: targetSection,
          link: link
        });
      }
    });
    
    // Skip if no sections found
    if (sections.length === 0) return;
    
    // Update active section on scroll
    window.addEventListener('scroll', throttle(() => {
      // Get current scroll position with offset
      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      
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
    
    // Set up smooth scrolling
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const navbarHeight = this.navbar.offsetHeight;
          const targetPosition = targetSection.offsetTop - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

export default Header;