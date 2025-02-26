/**
 * General utility helper functions
 */

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };
  
  /**
   * Throttle function to limit how often a function can be called
   * @param {Function} func - Function to throttle
   * @param {number} limit - Limit in milliseconds
   * @returns {Function} - Throttled function
   */
  export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  };
  
  /**
   * Format date to a readable string
   * @param {Date|string} date - Date to format
   * @param {Object} [options] - Intl.DateTimeFormat options
   * @returns {string} - Formatted date string
   */
  export const formatDate = (date, options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  };
  
  /**
   * Check if an element is in viewport
   * @param {Element} element - Element to check
   * @param {number} [offset=0] - Offset in pixels
   * @returns {boolean} - Whether element is in viewport
   */
  export const isInViewport = (element, offset = 0) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    
    return (
      rect.top + offset < window.innerHeight &&
      rect.bottom > offset &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  };
  
  /**
   * Generate a random ID
   * @param {number} [length=8] - Length of the ID
   * @returns {string} - Random ID
   */
  export const generateId = (length = 8) => {
    return Math.random().toString(36).substring(2, 2 + length);
  };
  
  /**
   * Deep clone an object
   * @param {Object} obj - Object to clone
   * @returns {Object} - Cloned object
   */
  export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj);
    }
    
    if (obj instanceof Array) {
      return obj.map(item => deepClone(item));
    }
    
    if (obj instanceof Object) {
      const copy = {};
      Object.keys(obj).forEach(key => {
        copy[key] = deepClone(obj[key]);
      });
      return copy;
    }
    
    return obj;
  };
  
  /**
   * Get URL parameters as an object
   * @returns {Object} - URL parameters
   */
  export const getUrlParams = () => {
    const params = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };