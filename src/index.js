// Import main styles
import './styles/main.scss';

// Import UI components
import Header from './ui-components/Header';
import Footer from './ui-components/Footer';
import ProjectCard from './ui-components/ProjectCard';
import SkillBadge from './ui-components/SkillBadge';

// Import utilities and helper functions
import * as DOMUtils from './scripts/utils/dom';
import * as Helpers from './scripts/utils/helpers';

// Import UI functionalities
import { initNavbar } from './scripts/ui/navbar';
import { initAnimations } from './scripts/ui/animations';
import { initModals } from './scripts/ui/modal';

// Import data
import projectsData from './data/projects.json';
import skillsData from './data/skills.json';
import testimonialsData from './data/testimonials.json';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI components
  initializeComponents();
  
  // Initialize UI functionalities
  initNavbar();
  initAnimations();
  initModals();
  
  // Load dynamic content
  loadProjects();
  loadSkills();
  loadTestimonials();
  
  // Initialize current page specific content
  initCurrentPage();
});

// Initialize UI Components
function initializeComponents() {
  // Initialize Header
  const headerElement = document.getElementById('header');
  if (headerElement) {
    new Header(headerElement).render();
  }
  
  // Initialize Footer
  const footerElement = document.getElementById('footer');
  if (footerElement) {
    new Footer(footerElement).render();
  }
}

// Load Projects
function loadProjects() {
  const featuredProjectsGrid = document.getElementById('featured-projects-grid');
  if (!featuredProjectsGrid) return;
  
  const featuredProjects = projectsData.filter(project => project.featured);
  
  featuredProjects.forEach(project => {
    const projectCardElement = document.createElement('div');
    projectCardElement.className = 'project-card-wrapper';
    featuredProjectsGrid.appendChild(projectCardElement);
    
    new ProjectCard(projectCardElement, project).render();
  });
}

// Load Skills
function loadSkills() {
  const skillsContainer = document.querySelector('.skills-container');
  if (!skillsContainer) return;
  
  // Technical Skills
  skillsData.technical.forEach(category => {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'skills-category';
    
    categoryElement.innerHTML = `<h3 class="category-title">${category.category}</h3>`;
    
    const skillsGrid = document.createElement('div');
    skillsGrid.className = 'skills-grid';
    
    category.skills.forEach(skill => {
      const skillElement = document.createElement('div');
      skillElement.className = 'skill-badge-wrapper';
      skillsGrid.appendChild(skillElement);
      
      new SkillBadge(skillElement, skill).render();
    });
    
    categoryElement.appendChild(skillsGrid);
    skillsContainer.appendChild(categoryElement);
  });
  
  // Soft Skills
  if (skillsData.soft && skillsData.soft.length > 0) {
    const softSkillsElement = document.createElement('div');
    softSkillsElement.className = 'skills-category soft-skills';
    
    softSkillsElement.innerHTML = `<h3 class="category-title">Soft Skills</h3>`;
    
    const softSkillsCloud = document.createElement('div');
    softSkillsCloud.className = 'soft-skills-cloud';
    
    skillsData.soft.forEach(skill => {
      const skillBadge = document.createElement('span');
      skillBadge.className = 'soft-skill-badge';
      skillBadge.textContent = skill;
      softSkillsCloud.appendChild(skillBadge);
    });
    
    softSkillsElement.appendChild(softSkillsCloud);
    skillsContainer.appendChild(softSkillsElement);
  }
}

// Load Testimonials
function loadTestimonials() {
  const testimonialsContainer = document.getElementById('testimonials-container');
  if (!testimonialsContainer) return;
  
  testimonialsData.forEach(testimonial => {
    const testimonialElement = document.createElement('div');
    testimonialElement.className = 'testimonial-card';
    
    testimonialElement.innerHTML = `
      <div class="testimonial-content">
        <p class="testimonial-text">"${testimonial.testimonial}"</p>
      </div>
      <div class="testimonial-author">
        <div class="author-image">
          <img src="${testimonial.image}" alt="${testimonial.name}" />
        </div>
        <div class="author-info">
          <h4 class="author-name">${testimonial.name}</h4>
          <p class="author-position">${testimonial.position}</p>
          <p class="author-company">${testimonial.company}</p>
        </div>
      </div>
    `;
    
    testimonialsContainer.appendChild(testimonialElement);
  });
  
  // Initialize testimonials slider if more than one testimonial
  if (testimonialsData.length > 1) {
    // This would be where you initialize a slider library
    // For example: new TestimonialsSlider(testimonialsContainer).init();
    console.log('Testimonials slider would be initialized here');
  }
}

// Initialize current page specific content
function initCurrentPage() {
  const currentPath = window.location.pathname;
  
  // Home page specific initialization
  if (currentPath === '/' || currentPath.includes('index.html')) {
    console.log('Home page initialized');
  }
  
  // About page specific initialization
  else if (currentPath.includes('about.html')) {
    console.log('About page initialized');
  }
  
  // Projects page specific initialization
  else if (currentPath.includes('projects.html')) {
    // Load all projects on the projects page
    loadAllProjects();
  }
  
  // Contact page specific initialization
  else if (currentPath.includes('contact.html')) {
    // Initialize contact form
    initContactForm();
  }
}

// Load all projects (for projects page)
function loadAllProjects() {
  const allProjectsGrid = document.getElementById('all-projects-grid');
  if (!allProjectsGrid) return;
  
  projectsData.forEach(project => {
    const projectCardElement = document.createElement('div');
    projectCardElement.className = 'project-card-wrapper';
    allProjectsGrid.appendChild(projectCardElement);
    
    new ProjectCard(projectCardElement, project).render();
  });
}

// Initialize contact form
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  // Import and initialize form handling
  import('./scripts/forms/form.js').then(module => {
    const { initForm } = module;
    initForm(contactForm);
  });
}