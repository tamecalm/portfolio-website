/**
 * Project Card Component
 */
class ProjectCard {
    /**
     * Create a project card
     * @param {Object} project - Project data
     * @param {string} project.title - Project title
     * @param {string} project.description - Project description
     * @param {string} project.image - Project image URL
     * @param {string} project.demoUrl - Demo URL
     * @param {string} project.sourceUrl - Source code URL
     * @param {Array} project.technologies - Array of technologies used
     */
    constructor(project) {
      this.project = project;
      this.element = null;
    }
    
    /**
     * Render the project card
     * @returns {HTMLElement} - The project card element
     */
    render() {
      const card = document.createElement('div');
      card.className = 'project-card';
      
      // Create card markup
      card.innerHTML = `
        <div class="project-image-container">
          <img 
            src="${this.project.image}" 
            alt="${this.project.title}" 
            class="project-image"
            loading="lazy"
          >
        </div>
        <div class="project-content">
          <h3 class="project-title">${this.project.title}</h3>
          <p class="project-description">${this.project.description}</p>
          <div class="project-tech">
            ${this.renderTechnologies()}
          </div>
          <div class="project-links">
            ${this.project.demoUrl ? `
              <a href="${this.project.demoUrl}" class="project-link btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                <i class="fa-solid fa-external-link"></i> Live Demo
              </a>
            ` : ''}
            ${this.project.sourceUrl ? `
              <a href="${this.project.sourceUrl}" class="project-link btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-github"></i> Source Code
              </a>
            ` : ''}
          </div>
        </div>
      `;
      
      // Set up hover effects
      card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
      });
      
      // Store reference to element
      this.element = card;
      
      return card;
    }
    
    /**
     * Render project technologies
     * @returns {string} - HTML for technology badges
     */
    renderTechnologies() {
      if (!this.project.technologies || this.project.technologies.length === 0) {
        return '';
      }
      
      return this.project.technologies.map(tech => `
        <span class="tech-badge">${tech}</span>
      `).join('');
    }
    
    /**
     * Create projects grid from array of project data
     * @param {Array} projects - Array of project data
     * @param {Element} container - Container to append projects to
     */
    static createProjectsGrid(projects, container) {
      if (!container) {
        console.error('ProjectCard: Container not found');
        return;
      }
      
      // Clear container
      container.innerHTML = '';
      
      // Create project cards
      projects.forEach(project => {
        const card = new ProjectCard(project);
        container.appendChild(card.render());
      });
    }
  }
  
  export default ProjectCard;