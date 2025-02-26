/**
 * Form handling functionality
 */
import { $, $$, addEventListeners } from '../utils/dom.js';
import { validateField, validateForm } from './validation.js';
import { debounce } from '../utils/helpers.js';

/**
 * Initialize all forms on the page
 */
export const initForms = () => {
  const forms = $$('form');
  forms.forEach(form => {
    setupForm(form);
  });
};

/**
 * Set up a single form with validation and submission handling
 * @param {HTMLFormElement} form - The form element to set up
 */
export const setupForm = (form) => {
  if (!form) return;
  
  // Set up field validation on blur and input
  const fields = form.querySelectorAll('input, textarea, select');
  
  fields.forEach(field => {
    // Validate on blur
    field.addEventListener('blur', () => {
      validateField(field);
    });
    
    // Validate on input with debounce for better performance
    field.addEventListener('input', debounce(() => {
      if (field.dataset.validated === 'true') {
        validateField(field);
      }
    }, 300));
  });
  
  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateForm(form);
    
    if (!isValid) {
      // Focus the first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      
      // Show form error message
      const formError = form.querySelector('.form-error-message');
      if (formError) {
        formError.textContent = 'Please correct the errors in the form.';
        formError.style.display = 'block';
      }
      
      return;
    }
    
    // Show loading state
    toggleFormLoading(form, true);
    
    try {
      // Get the form data
      const formData = new FormData(form);
      const formObject = Object.fromEntries(formData.entries());
      
      // Handle submit based on form type
      if (form.id === 'contact-form') {
        await submitContactForm(formObject, form);
      } else {
        // Generic form submission
        await submitFormData(formObject, form);
      }
      
      // Reset form on success
      form.reset();
      
      // Show success message
      const successMessage = form.dataset.successMessage || 'Form submitted successfully!';
      showFormMessage(form, successMessage, 'success');
      
    } catch (error) {
      // Handle error
      console.error('Form submission error:', error);
      const errorMessage = error.message || 'An error occurred while submitting the form. Please try again.';
      showFormMessage(form, errorMessage, 'error');
    } finally {
      // Hide loading state
      toggleFormLoading(form, false);
    }
  });
};

/**
 * Submit contact form data
 * @param {Object} formData - Form data object
 * @param {HTMLFormElement} form - The form element
 * @returns {Promise} - Submit result
 */
const submitContactForm = async (formData, form) => {
  // Simulate API call - replace with actual API endpoint
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For demo, 90% success rate
      if (Math.random() > 0.1) {
        resolve({ success: true });
      } else {
        reject(new Error('Could not send message. Please try again later.'));
      }
    }, 1000);
  });
};

/**
 * Submit generic form data
 * @param {Object} formData - Form data object
 * @param {HTMLFormElement} form - The form element
 * @returns {Promise} - Submit result
 */
const submitFormData = async (formData, form) => {
  const endpoint = form.getAttribute('action') || '/api/submit';
  const method = form.getAttribute('method') || 'POST';
  
  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  if (!response.ok) {
    throw new Error('Form submission failed. Please try again.');
  }
  
  return response.json();
};

/**
 * Toggle loading state for a form
 * @param {HTMLFormElement} form - The form element
 * @param {boolean} isLoading - Whether the form is loading
 */
export const toggleFormLoading = (form, isLoading) => {
  const submitBtn = form.querySelector('[type="submit"]');
  
  if (submitBtn) {
    submitBtn.disabled = isLoading;
    
    // Toggle loading text/spinner if it exists
    const loadingText = submitBtn.dataset.loadingText || 'Submitting...';
    const originalText = submitBtn.dataset.originalText || submitBtn.textContent;
    
    if (isLoading) {
      // Save original text
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = loadingText;
      submitBtn.classList.add('is-loading');
    } else {
      // Restore original text
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('is-loading');
    }
  }
  
  // Toggle form fields
  const fields = form.querySelectorAll('input, textarea, select');
  fields.forEach(field => {
    field.disabled = isLoading;
  });
};

/**
 * Show a message in the form
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - Message to show
 * @param {string} type - Message type ('success' or 'error')
 */
export const showFormMessage = (form, message, type = 'success') => {
  // Create or get message element
  let messageEl = form.querySelector('.form-message');
  
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.className = 'form-message';
    form.appendChild(messageEl);
  }
  
  // Set message content and style
  messageEl.textContent = message;
  messageEl.className = `form-message ${type === 'error' ? 'form-error-message' : 'form-success-message'}`;
  messageEl.style.display = 'block';
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
};

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', initForms);