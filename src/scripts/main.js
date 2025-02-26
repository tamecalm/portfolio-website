/**
 * Main JavaScript entry point for the portfolio website
 * Initializes all components and sets up event listeners
 */

// Import UI components
import { initHeader } from './ui/navbar.js';
import { initModal } from './ui/modal.js';
import { setupAnimations } from './ui/animations.js';

// Import form handlers
import { initForms } from './forms/form.js';

// Import helper functions
import { loadComponent } from './utils/dom.js';
import { getProjects, getSkills } from './utils/helpers.js';

// DOM elements
const projectsGrid = document.getElementById('projects-grid');
const skillsGrid = document.querySelector('.skills-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize UI components
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing portfolio website...');
    
    // Initialize header, footer, and contact form components
    await Promise.all([
        loadComponent('header', '../ui-components/Header.js', 'main-header'),
        loadComponent('footer', '../ui-components/Footer.js', 'main-footer'),
        loadComponent('contact-form', '../ui-components/ContactForm.js', '.contact-form-container')
    ]);
    
    // Initialize navigation and modal
    initHeader();
    initModal();
    
    // Initialize animations
    setupAnimations();
    
    // Initialize forms with validation
    initForms();
    
    // Load projects
    loadProjects();
    
    // Load skills
    loadSkills();
    
    // Setup filter functionality
    setupProjectFilters();
    
    console.log('Website initialization complete!');
});

/**
 * Loads project data and creates project cards
 */
async function loadProjects() {
    try {
        const projects = await getProjects();
        projectsGrid.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.dataset.category = project.category;
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-overlay">
                        <button class="view-project" data-id="${project.id}">View Details</button>
                    </div>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.shortDescription}</p>
                    <div class="project-tags">
                        ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
        
        // Add event listeners to view project buttons
        document.querySelectorAll('.view-project').forEach(button => {
            button.addEventListener('click', (e) => {
                const projectId = e.target.dataset.id;
                displayProjectDetails(projectId);
            });
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
    }
}

/**
 * Loads skill data and creates skill badges
 */
async function loadSkills() {
    try {
        const skills = await getSkills();
        skillsGrid.innerHTML = '';
        
        skills.forEach(skill => {
            const skillBadge = document.createElement('div');
            skillBadge.className = 'skill-badge';
            skillBadge.innerHTML = `
                <i class="${skill.icon}"></i>
                <span>${skill.name}</span>
            `;
            skillsGrid.appendChild(skillBadge);
        });
    } catch (error) {
        console.error('Error loading skills:', error);
        skillsGrid.innerHTML = '<p class="error-message">Failed to load skills. Please try again later.</p>';
    }
}

/**
 * Sets up project filtering functionality
 */
function setupProjectFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.dataset.filter;
            
            // Filter projects
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Displays detailed information about a project in the modal
 * @param {string} projectId - The ID of the project to display
 */
async function displayProjectDetails(projectId) {
    try {
        const projects = await getProjects();
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
            throw new Error('Project not found');
        }
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="project-details">
                <h2>${project.title}</h2>
                <div class="project-gallery">
                    <img src="${project.image}" alt="${project.title}" class="main-image">
                    <div class="gallery-thumbnails">
                        ${project.gallery?.map(img => `<img src="${img}" alt="${project.title}">`).join('') || ''}
                    </div>
                </div>
                <div class="project-description">
                    <p>${project.fullDescription}</p>
                </div>
                <div class="project-meta">
                    <div class="meta-item">
                        <h4>Technologies</h4>
                        <div class="project-tech-tags">
                            ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                    <div class="meta-item">
                        <h4>Project Date</h4>
                        <p>${project.date}</p>
                    </div>
                    <div class="meta-item">
                        <h4>Client</h4>
                        <p>${project.client || 'Personal Project'}</p>
                    </div>
                </div>
                <div class="project-links">
                    ${project.liveUrl ? `<a href="${project.liveUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">View Live</a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">View Code</a>` : ''}
                </div>
            </div>
        `;
        
        // Open modal
        const modal = document.getElementById('project-modal');
        modal.classList.add('show-modal');
    } catch (error) {
        console.error('Error displaying project details:', error);
        alert('Failed to load project details. Please try again later.');
    }
}