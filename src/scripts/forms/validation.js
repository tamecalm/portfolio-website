/**
 * Form field validation functionality
 */

/**
 * Validation rules for different field types
 */
const validationRules = {
    email: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Please enter a valid email address.'
    },
    phone: {
      pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      message: 'Please enter a valid phone number.'
    },
    url: {
      pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
      message: 'Please enter a valid URL.'
    },
    password: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      message: 'Password must be at least 8 characters and include uppercase, lowercase, and numbers.'
    },
    name: {
      pattern: /^[a-zA-Z\s'-]{2,}$/,
      message: 'Please enter a valid name (minimum 2 characters).'
    },
    text: {
      pattern: /^.{1,}$/,
      message: 'This field cannot be empty.'
    },
    message: {
      pattern: /^.{10,}$/,
      message: 'Please enter a message (minimum 10 characters).'
    }
  };
  
  /**
   * Validate a single form field
   * @param {HTMLElement} field - The field to validate
   * @returns {boolean} - Whether the field is valid
   */
  export const validateField = (field) => {
    // Mark field as validated (for future real-time validation)
    field.dataset.validated = 'true';
    
    // Get field value and trim it
    const value = field.value.trim();
    
    // Check if field is required
    const isRequired = field.required || field.getAttribute('aria-required') === 'true';
    
    // Empty non-required fields are automatically valid
    if (!isRequired && value === '') {
      setFieldValid(field);
      return true;
    }
    
    // Required fields must have a value
    if (isRequired && value === '') {
      setFieldInvalid(field, 'This field is required.');
      return false;
    }
    
    // Get validation type from data attribute or fallback to input type
    const validationType = field.dataset.validate || field.type || 'text';
    
    // Get validation rule
    const rule = validationRules[validationType];
    
    // If no rule exists, treat as valid
    if (!rule) {
      setFieldValid(field);
      return true;
    }
    
    // Check against pattern
    const isValid = rule.pattern.test(value);
    
    if (isValid) {
      setFieldValid(field);
      return true;
    } else {
      setFieldInvalid(field, rule.message);
      return false;
    }
  };
  
  /**
   * Validate an entire form
   * @param {HTMLFormElement} form - The form to validate
   * @returns {boolean} - Whether the form is valid
   */
  export const validateForm = (form) => {
    // Get all form fields
    const fields = form.querySelectorAll('input, textarea, select');
    
    // Track overall form validity
    let isFormValid = true;
    
    // Validate each field
    fields.forEach(field => {
      // Skip fields that should not be validated (hidden, disabled, etc.)
      if (field.type === 'hidden' || field.disabled) {
        return;
      }
      
      const isFieldValid = validateField(field);
      isFormValid = isFormValid && isFieldValid;
    });
    
    return isFormValid;
  };
  
  /**
   * Mark a field as valid
   * @param {HTMLElement} field - The field to mark as valid
   */
  const setFieldValid = (field) => {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    
    // Hide error message if it exists
    const errorContainer = getErrorContainer(field);
    if (errorContainer) {
      errorContainer.style.display = 'none';
    }
    
    // Update ARIA attributes
    field.setAttribute('aria-invalid', 'false');
    if (field.hasAttribute('aria-describedby')) {
      field.removeAttribute('aria-describedby');
    }
  };
  
  /**
   * Mark a field as invalid
   * @param {HTMLElement} field - The field to mark as invalid
   * @param {string} message - Error message to display
   */
  const setFieldInvalid = (field, message) => {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    
    // Show error message
    const errorContainer = getErrorContainer(field) || createErrorContainer(field);
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    
    // Update ARIA attributes
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorContainer.id);
  };
  
  /**
   * Get the error container for a field
   * @param {HTMLElement} field - The field to get the error container for
   * @returns {HTMLElement|null} - The error container element or null
   */
  const getErrorContainer = (field) => {
    // Try to find an existing error container
    const fieldId = field.id || field.name;
    
    // Check for explicitly linked error container
    if (field.dataset.errorContainer) {
      return document.getElementById(field.dataset.errorContainer);
    }
    
    // Look for an error container with a conventional ID
    const conventionalId = `${fieldId}-error`;
    const container = document.getElementById(conventionalId);
    
    if (container) {
      return container;
    }
    
    // Check sibling elements for an error container
    const parent = field.parentElement;
    if (parent) {
      const siblingError = parent.querySelector('.invalid-feedback, .field-error');
      if (siblingError) {
        return siblingError;
      }
    }
    
    return null;
  };
  
  /**
   * Create an error container for a field
   * @param {HTMLElement} field - The field to create an error container for
   * @returns {HTMLElement} - The created error container
   */
  const createErrorContainer = (field) => {
    const fieldId = field.id || field.name;
    const containerId = `${fieldId}-error`;
    
    // Create the error container
    const container = document.createElement('div');
    container.id = containerId;
    container.className = 'invalid-feedback';
    container.style.display = 'none';
    
    // Insert after the field
    field.parentElement.insertBefore(container, field.nextSibling);
    
    return container;
  };