// js/report.js javascript for the contact page

import { insertNavbar, detectActivePage, apiRoute } from './main.js';

// Initialize page
window.onload = function() {
    // Insert navigation
    insertNavbar();
    
    // Set active page
    detectActivePage();
    
    //set up reporting functionality
    fetchData();

};

// contact page -specific functions
/**
 * Placeholder contact form handler
 * Currently displays an alert indicating functionality is disabled
 */
function contactUs() {
    const sendButton = document.getElementById('send');
    sendButton.addEventListener('click', (event) => {
        // Prevent default behavior if necessary (e.g., form submission)
        if (event) event.preventDefault();
        alert("Sorry, this function is disabled! Well actually I never enabled it :)");
    });
}


/**
 * Fetches transaction data and stores in localStorage
 */
function fetchData() {
    const reportButton = document.getElementById('generate-report');
    reportButton.addEventListener('click', () => {
        console.log("fetching data from: ", apiRoute);

        fetch(apiRoute)
            .then(response => {
                console.log('Response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('transactionData', JSON.stringify(data));
                console.log('Data stored in localStorage:', data);
                console.log(localStorage.getItem('transactionData'));
                window.location.href = 'download.html';
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });
}