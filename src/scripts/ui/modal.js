/**
 * Modal dialog functionality
 */
import { $, $$ } from '../utils/dom.js';

// Track open modals
let activeModal = null;

/**
 * Initialize modal functionality
 */
export const initModals = () => {
  // Find all modal triggers
  const modalTriggers = $$('[data-modal-target]');
  
  // Set up event listeners for triggers
  modalTriggers.forEach(trigger => {
    const modalId = trigger.dataset.modalTarget;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modalId);
    });
  });
  
  // Set up close buttons
  const closeButtons = $$('.modal-close, [data-modal-close]');
  closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(button.closest('.modal'));
    });
  });
  
  // Close when clicking on the backdrop (outside modal content)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
      closeModal(e.target);
    }
  });
  
  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) {
      closeModal(activeModal);
    }
  });
};

/**
 * Open a modal by ID
 * @param {string} modalId - ID of the modal to open
 */
export const openModal = (modalId) => {
  const modal = $(`#${modalId}`);
  
  if (!modal) {
    console.error(`Modal with ID "${modalId}" not found.`);
    return;
  }
  
  // Close any open modal first
  if (activeModal) {
    closeModal(activeModal);
  }
  
  // Add active class to show the modal
  modal.classList.add('active');
  
  // Update active modal reference
  activeModal = modal;
  
  // Prevent body scrolling
  document.body.classList.add('modal-open');
  
  // Focus the first focusable element inside the modal
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    setTimeout(() => {
      focusableElements[0].focus();
    }, 100);
  }
  
  // Trigger open event
  const event = new CustomEvent('modal:open', { detail: { modal } });
  document.dispatchEvent(event);
};

/**
 * Close a modal
 * @param {Element} modal - Modal element to close
 */
export const closeModal = (modal) => {
  if (!modal) return;
  
  // Remove active class to hide the modal
  modal.classList.remove('active');
  
  // Update active modal reference
  activeModal = null;
  
  // Allow body scrolling again
  document.body.classList.remove('modal-open');
  
  // Trigger close event
  const event = new CustomEvent('modal:close', { detail: { modal } });
  document.dispatchEvent(event);
};

/**
 * Create and show a modal programmatically
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string} options.content - Modal content HTML
 * @param {Array} [options.buttons] - Modal buttons config
 * @param {string} [options.size] - Modal size ('small', 'medium', 'large')
 * @returns {Element} - The created modal element
 */
export const showModal = (options) => {
  const {
    title,
    content,
    buttons = [{ text: 'Close', action: 'close' }],
    size = 'medium'
  } = options;
  
  // Generate a unique ID for the modal
  const modalId = `modal-${Date.now()}`;
  
  // Create the modal HTML
  const modalHTML = `
    <div id="${modalId}" class="modal">
      <div class="modal-dialog modal-${size}">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button type="button" class="modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer">
            ${buttons.map(btn => `
              <button type="button" class="btn ${btn.class || ''}" data-action="${btn.action}">
                ${btn.text}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add the modal to the DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Get the modal element
  const modal = $(`#${modalId}`);
  
  // Set up event listeners for buttons
  const buttonElements = modal.querySelectorAll('.modal-footer .btn');
  buttonElements.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      
      if (action === 'close') {
        closeModal(modal);
      } else {
        // Find matching button config
        const buttonConfig = buttons.find(btn => btn.action === action);
        if (buttonConfig && typeof buttonConfig.handler === 'function') {
          buttonConfig.handler(modal);
        }
      }
    });
  });
  
  // Set up close button
  const closeButton = modal.querySelector('.modal-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closeModal(modal);
    });
  }
  
  // Open the modal
  openModal(modalId);
  
  return modal;
};

// Initialize modals when DOM is loaded
document.addEventListener('DOMContentLoaded', initModals);