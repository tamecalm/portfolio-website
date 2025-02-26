/**
 * DOM utility functions for easy element manipulation
 */

/**
 * Shorthand for document.querySelector
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context element for the query
 * @returns {Element} - The first matching element
 */
export const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Shorthand for document.querySelectorAll
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context element for the query
 * @returns {NodeList} - All matching elements
 */
export const $$ = (selector, context = document) => context.querySelectorAll(selector);

/**
 * Create a DOM element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} [attrs={}] - Attributes to set on the element
 * @param {Array} [children=[]] - Child nodes to append
 * @returns {Element} - The created element
 */
export const createElement = (tag, attrs = {}, children = []) => {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  
  return element;
};

/**
 * Add event listeners to multiple elements
 * @param {string|NodeList|Array} elements - CSS selector or list of elements
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 */
export const addEventListeners = (elements, event, handler) => {
  const targets = typeof elements === 'string' ? $$(elements) : elements;
  Array.from(targets).forEach(element => {
    element.addEventListener(event, handler);
  });
};

/**
 * Show an element by removing a hidden class
 * @param {Element} element - Element to show
 * @param {string} [displayValue='block'] - Display value to set
 */
export const showElement = (element, displayValue = 'block') => {
  if (element) {
    element.style.display = displayValue;
  }
};

/**
 * Hide an element by setting display to none
 * @param {Element} element - Element to hide
 */
export const hideElement = (element) => {
  if (element) {
    element.style.display = 'none';
  }
};

/**
 * Toggle element visibility
 * @param {Element} element - Element to toggle
 * @param {string} [displayValue='block'] - Display value when showing
 */
export const toggleElement = (element, displayValue = 'block') => {
  if (element) {
    if (element.style.display === 'none') {
      element.style.display = displayValue;
    } else {
      element.style.display = 'none';
    }
  }
};