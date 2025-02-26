/**
 * Footer Component
 */
class Footer {
    constructor(container) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this.container) {
        console.error('Footer: Container not found');
        return;
      }
      
      this.render();
    }
    
    /**
     * Render the footer
     */
    render() {
      const currentYear = new Date().getFullYear();
      
      const footerHTML = `
        <footer class="footer">
          <div class="footer-container">
            <div class="footer-content">
              <div class="footer-section">
                <h3 class="footer-title">Get in Touch</h3>
                <ul class="footer-links">
                  <li><a href="mailto:hello@example.com" class="footer-link">hello@example.com</a></li>
                  <li><a href="tel:+11234567890" class="footer-link">+1 (123) 456-7890</a></li>
                </ul>
              </div>
              
              <div class="footer-section">
                <h3 class="footer-title">Connect</h3>
                <div class="social-links">
                  <a href="https://github.com/" target="_blank" rel="noopener noreferrer" class="social-link">
                    <i class="fa-brands fa-github"></i>
                    <span class="sr-only">GitHub</span>
                  </a>
                  <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer" class="social-link">
                    <i class="fa-brands fa-linkedin"></i>
                    <span class="sr-only">LinkedIn</span>
                  </a>
                  <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" class="social-link">
                    <i class="fa-brands fa-twitter"></i>
                    <span class="sr-only">Twitter</span>
                  </a>
                  <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" class="social-link">
                    <i class="fa-brands fa-instagram"></i>
                    <span class="sr-only">Instagram</span>
                  </a>
                </div>
              </div>
              
              <div class="footer-section">
                <h3 class="footer-title">Navigation</h3>
                <ul class="footer-links">
                  <li><a href="#home" class="footer-link">Home</a></li>
                  <li><a href="#about" class="footer-link">About</a></li>
                  <li><a href="#projects" class="footer-link">Projects</a></li>
                  <li><a href="#skills" class="footer-link">Skills</a></li>
                  <li><a href="#contact" class="footer-link">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div class="footer-bottom">
              <p class="copyright">
                &copy; ${currentYear} Your Name. All rights reserved.
              </p>
              <p class="credits">
                Designed with <i class="fa-solid fa-heart"></i> and <i class="fa-solid fa-coffee"></i>
              </p>
            </div>
          </div>
        </footer>
      `;
      
      this.container.innerHTML = footerHTML;
      this.setupScrollToTop();
    }
    
    /**
     * Set up scroll to top button
     */
    setupScrollToTop() {
      const scrollToTopButton = document.createElement('button');
      scrollToTopButton.className = 'scroll-to-top';
      scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
      scrollToTopButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
      
      this.container.appendChild(scrollToTopButton);
      
      // Show button when scrolled down
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          scrollToTopButton.classList.add('visible');
        } else {
          scrollToTopButton.classList.remove('visible');
        }
      });
      
      // Scroll to top on click
      scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
  
  export default Footer;