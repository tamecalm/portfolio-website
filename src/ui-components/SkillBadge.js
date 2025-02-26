/**
 * Skill Badge Component
 */
class SkillBadge {
    /**
     * Create a skill badge
     * @param {Object} skill - Skill data
     * @param {string} skill.name - Skill name
     * @param {number} skill.level - Skill level (0-100)
     * @param {string} skill.icon - Font Awesome icon class or image URL
     * @param {string} skill.category - Skill category
     */
    constructor(skill) {
      this.skill = skill;
      this.element = null;
    }
    
    /**
     * Render the skill badge
     * @returns {HTMLElement} - The skill badge element
     */
    render() {
      const badge = document.createElement('div');
      badge.className = 'skill-badge';
      
      // Add category as data attribute
      if (this.skill.category) {
        badge.dataset.category = this.skill.category;
      }
      
      // Determine icon type (Font Awesome or image)
      const isImageIcon = this.skill.icon && (
        this.skill.icon.endsWith('.png') || 
        this.skill.icon.endsWith('.svg') || 
        this.skill.icon.endsWith('.jpg') ||
        this.skill.icon.endsWith('.jpeg')
      );
      
      // Create badge markup
      badge.innerHTML = `
        <div class="skill-icon">
          ${isImageIcon 
            ? `<img src="${this.skill.icon}" alt="${this.skill.name}" class="skill-image">`
            : `<i class="${this.skill.icon}"></i>`
          }
        </div>
        <div class="skill-info">
          <h4 class="skill-name">${this.skill.name}</h4>
          ${this.renderSkillLevel()}
        </div>
      `;
      
      // Store reference to element
      this.element = badge;
      
      // Set up hover effect
      badge.addEventListener('mouseenter', () => {
        badge.classList.add('hover');
      });
      
      badge.addEventListener('mouseleave', () => {
        badge.classList.remove('hover');
      });
      
      return badge;
    }
    
    /**
     * Render skill level indicator
     * @returns {string} - HTML for skill level
     */
    renderSkillLevel() {
      if (typeof this.skill.level !== 'number') {
        return '';
      }
      
      // Determine level label
      let levelLabel;
      if (this.skill.level >= 90) {
        levelLabel = 'Expert';
      } else if (this.skill.level >= 70) {
        levelLabel = 'Advanced';
      } else if (this.skill.level >= 40) {
        levelLabel = 'Intermediate';
      } else {
        levelLabel = 'Beginner';
      }
      
      return `
        <div class="skill-level">
          <div class="skill-progress-bar">
            <div class="skill-progress" style="width: ${this.skill.level}%"></div>
          </div>
          <span class="skill-level-label">${levelLabel}</span>
        </div>
      `;
    }
    
    /**
     * Create skills grid from array of skill data
     * @param {Array} skills - Array of skill data
     * @param {Element} container - Container to append skills to
     * @param {boolean} [enableFiltering=false] - Whether to enable category filtering
     */
    static createSkillsGrid(skills, container, enableFiltering = false) {
      if (!container) {
        console.error('SkillBadge: Container not found');
        return;
      }
      
      // Clear container
      container.innerHTML = '';
      
      // If filtering is enabled, create filter buttons
      if (enableFiltering && skills.length > 0) {
        // Get unique categories
        const categories = [...new Set(skills.map(skill => skill.category))].filter(Boolean);
        
        if (categories.length > 0) {
          // Create filter container
          const filterContainer = document.createElement('div');
          filterContainer.className = 'skills-filter';
          
          // Create "All" button
          const allButton = document.createElement('button');
          allButton.className = 'filter-btn active';
          allButton.dataset.filter = 'all';
          allButton.textContent = 'All';
          filterContainer.appendChild(allButton);
          
          // Create category buttons
          categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.filter = category;
            button.textContent = category;
            filterContainer.appendChild(button);
          });
          
          // Add filter container before skills grid
          container.parentNode.insertBefore(filterContainer, container);
          
          // Set up filter functionality
          const filterButtons = filterContainer.querySelectorAll('.filter-btn');
          filterButtons.forEach(button => {
            button.addEventListener('click', () => {
              // Update active button
              filterButtons.forEach(btn => btn.classList.remove('active'));
              button.classList.add('active');
              
              // Filter skills
              const filterValue = button.dataset.filter;
              const skillBadges = container.querySelectorAll('.skill-badge');
              
              skillBadges.forEach(badge => {
                if (filterValue === 'all' || badge.dataset.category === filterValue) {
                  badge.style.display = '';
                } else {
                  badge.style.display = 'none';
                }
              });
            });
          });
        }
      }
      
      // Create skill badges
      skills.forEach(skill => {
        const badge = new SkillBadge(skill);
        container.appendChild(badge.render());
      });
    }
  }
  
  export default SkillBadge;