// js/index.js - javascript for the index page

import { insertNavbar, detectActivePage } from './main.js';

// Initialize index page
window.onload = function() {
    // Insert navigation
    insertNavbar();
    
    // Set active page
    detectActivePage();
    
    // Any index-specific initialization can go here
    welcomeMessage();
};

// Index-specific functions
function welcomeMessage() {
    const currentHour = new Date().getHours();
    const greeting = document.createElement('p');
    
    let message = '';
    if (currentHour < 12) message = 'Good morning!';
    else if (currentHour < 18) message = 'Good afternoon!';
    else message = 'Good evening!';
    
    greeting.textContent = message;
    document.querySelector('#page-body')?.prepend(greeting);
}