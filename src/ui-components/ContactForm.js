/**
 * Contact Form Component
 */
import { validateField, validateForm } from '../scripts/forms/validation.js';
import { showFormMessage, toggleFormLoading } from '../scripts/forms/form.js';

class ContactForm {
  constructor(container) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('ContactForm: Container not found');
      return;
    }
    
    this.render();
    this.setupEventListeners();
  }
  
  /**
   * Render the contact form
   */
  render() {
    const formHTML = `
      <form id="contact-form" class="contact-form" novalidate>
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            class="form-control" 
            required 
            data-validate="name"
            placeholder="Your name"
          >
          <div id="name-error" class="invalid-feedback"></div>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            class="form-control" 
            required 
            data-validate="email"
            placeholder="Your email address"
          >
          <div id="email-error" class="invalid-feedback"></div>
        </div>
        
        <div class="form-group">
          <label for="subject">Subject</label>
          <input 
            type="text" 
            id="subject" 
            name="subject" 
            class="form-control" 
            required 
            data-validate="text"
            placeholder="Message subject"
          >
          <div id="subject-error" class="invalid-feedback"></div>
        </div>
        
        <div class="form-group">
          <label for="message">Message</label>
          <textarea 
            id="message" 
            name="message" 
            class="form-control" 
            required 
            data-validate="message"
            rows="5"
            placeholder="Your message"
          ></textarea>
          <div id="message-error" class="invalid-feedback"></div>
        </div>
        
        <div class="form-message-container">
          <div class="form-message" style="display: none;"></div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" data-loading-text="Sending...">
            Send Message
          </button>
        </div>
      </form>
    `;
    
    this.container.innerHTML = formHTML;
    this.form = this.container.querySelector('#contact-form');
  }
  
  /**
   * Set up event listeners for the form
   */
  setupEventListeners() {
    if (!this.form) return;
    
    // Set up validation on blur
    const fields = this.form.querySelectorAll('input, textarea');
    fields.forEach(field => {
      field.addEventListener('blur', () => {
        validateField(field);
      });
      
      // Real-time validation for fields that have been validated once
      field.addEventListener('input', () => {
        if (field.dataset.validated === 'true') {
          validateField(field);
        }
      });
    });
    
    // Handle form submission
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }
  
  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate the form
    const isValid = validateForm(this.form);
    
    if (!isValid) {
      // Focus the first invalid field
      const firstInvalid = this.form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }
    
    // Show loading state
    toggleFormLoading(this.form, true);
    
    try {
      // Get the form data
      const formData = new FormData(this.form);
      const formObject = Object.fromEntries(formData.entries());
      
      // Submit the form (for demo purposes, using a timeout to simulate an API call)
      await this.submitForm(formObject);
      
      // Show success message
      showFormMessage(
        this.form, 
        'Thanks for your message! I\'ll get back to you as soon as possible.', 
        'success'
      );
      
      // Reset the form
      this.form.reset();
      
    } catch (error) {
      // Show error message
      showFormMessage(
        this.form, 
        error.message || 'There was a problem sending your message. Please try again.', 
        'error'
      );
    } finally {
      // Hide loading state
      toggleFormLoading(this.form, false);
    }
  }
  
  /**
   * Submit the form data
   * @param {Object} data - Form data
   * @returns {Promise} - Form submission promise
   */
  submitForm(data) {
    // For demo purposes, we'll use a timeout to simulate an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 80% success rate
        if (Math.random() > 0.2) {
          console.log('Form data submitted:', data);
          resolve({ success: true });
        } else {
          reject(new Error('Could not send message. Please try again later.'));
        }
      }, 1500);
    });
  }
}

export default ContactForm;