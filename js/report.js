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

/**
 * Fetches transaction data and stores in localStorage
 */
function fetchData() {
    const reportButton = document.getElementById('generate-report');
    reportButton.addEventListener('click', () => {
        console.log("fetching data from: ", apiRoute);

        const queryFilter = validateFormData();
        localStorage.setItem('filterData', JSON.stringify(queryFilter));
 
        
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

/**
 * Validates form data and returns filter object
 * @returns {Object} Filter object
 */
function validateFormData() {
     const dateFilter = document.getElementById('date-field').value;
     const amountFilter = document.getElementById('amount-field').value;
     const typeFilter = document.getElementById('transaction-field').value;
     const categoryFilter = document.getElementById('category-field').value;
   
     const filters = {
        date: dateFilter,
        amount: amountFilter,
        type: typeFilter,
        category: categoryFilter
     }
     return filters;
}
