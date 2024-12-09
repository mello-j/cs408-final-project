// js/contact.js javascript for the contact page

import { insertNavbar, detectActivePage } from './main.js';

// Initialize page
window.onload = function() {
    // Insert navigation
    insertNavbar();
    
    // Set active page
    detectActivePage();
    
    contactUs();
};

// contact page -specific functions
/**
 * Placeholder contact form handler
 * Currently displays an alert indicating functionality is disabled
 */
export function contactUs() {
    const sendButton = document.getElementById('send');
    sendButton.addEventListener('click', (event) => {
        // Prevent default behavior if necessary (e.g., form submission)
        if (event) event.preventDefault();
        alert("Sorry, this function is disabled! Well actually I never enabled it :)");
    });
}