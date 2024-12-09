// js/transact.js - javascript for the transactions page

import { insertNavbar, detectActivePage, apiRoute } from './main.js';

//global variable to keep track of the id for put request
let id = parseInt(localStorage.getItem('currentId')) || 1;

// Initialize page
window.onload = function() {
    // Insert navigation
    insertNavbar();
    
    // Set active page
    detectActivePage();
    
    //transaction functionality
    toggleDataEntry();
    addRow();
    putData();
};

// Transaction-specific functions
/**
 * Toggles between single and multiple data entry modes
 * Controls visibility of relevant UI elements
 */
function toggleDataEntry() {
    const toggleButton = document.getElementById('toggle-button');
    const dataEntryTable = document.getElementById('transact-data-table');
    const dataEntryForm = document.getElementById('transact-data-form');
    const addRowButton = document.getElementById('add-row');
    const addTransactionButton = document.getElementById('submit-button');


    // Set initial states
    dataEntryTable.style.display = 'none';
    dataEntryForm.style.display = 'flex';
    addRowButton.style.visibility = 'hidden';

    toggleButton.addEventListener('click', () => {
        if (dataEntryTable.style.display === 'none') {
            // Switch to table view
            dataEntryTable.style.display = 'table';
            dataEntryForm.style.display = 'none';
            addRowButton.style.visibility = 'visible';
            addTransactionButton.textContent = 'Submit All Transactions';
            toggleButton.textContent = 'Single Data Entry Mode';
        } else {
            // Switch to form view
            dataEntryTable.style.display = 'none';
            dataEntryForm.style.display = 'flex';
            addRowButton.style.visibility = 'hidden';
            addTransactionButton.textContent = 'Submit Transaction';
            toggleButton.textContent = 'Multiple Data Entry Mode';
        }
    });
}

/**
 * Adds new row to multiple entry table
 * Creates input fields for transaction data entry
 */
function addRow() {
    const addRowButton = document.getElementById('add-row');
    addRowButton.addEventListener('click', (event) => {
        // Prevent default behavior if necessary (e.g., form submission)
        if (event) event.preventDefault();

        // Create new row
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input id="table-date-field" type="date" name="transaction-date"></td>
            <td>
              <input type="text" id="table-amount-field" name="Transaction type" required placeholder="Enter the amount"></td>
            <td>
                <select id="table-transaction-type" name="transaction-type" required>
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select></td>
            <td>
              <select id="table-category-type" name="category" required>
                <option value="Rent">Rent</option>
                <option value="FastFood">FastFood</option>
                <option value="Supplies">Supplies</option>
                <option value="Gas">Gas</option>
                <option value="Fun">Fun</option>
                <option value="Misc">Misc</option>
              </select>
            </td>
            <td>          
              <input type="textarea" id="table-desc-field" name="description" required placeholder="Enter a description">
            </td>
            `;

        // Append new row to the table
        const tableBody = document.querySelector("#transact-data-table tbody");
        tableBody.appendChild(newRow);
    });
}

/**
 * Resets single entry form to default values
 * Called after successful form submission
 */
function clearTransactionForm() {
    // Clear the form fields
    document.getElementById('date-field').value = '';
    document.getElementById('amount-field').value = '';
    document.getElementById('transaction-type').value = 'debit';
    document.getElementById('category-type').value = 'rent';
    document.getElementById('desc-field').value = '';
}

/**
 * Clears multiple entry table and adds a fresh row
 * Called after successful table submission
 */
function clearTransactionTable() {
    // Clear the table contents
    const tableBody = document.querySelector("#transact-data-table tbody");
    tableBody.innerHTML = '';
    // Trigger the 'click' event to add a new row
    const addRowButton = document.getElementById('add-row');
    if (addRowButton) {
        addRowButton.click(); // This simulates the click on the "Add Row" button
    }
}

// API specific functions
/**
 * Handles data submission for both single and multiple entry modes
 * Determines which mode is active and calls appropriate submission function
 */
function putData() {
    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', () => {

        const dataEntryTable = document.getElementById('transact-data-table');
        const dataEntryForm = document.getElementById('transact-data-form');

        if (dataEntryTable.style.display === 'table') {
            pushDataFromTable();
            clearTransactionTable();
        }
        else {
            let payload = {
                date: document.getElementById('date-field').value,
                amount: document.getElementById('amount-field').value,
                type: document.getElementById('transaction-type').value,
                category: document.getElementById('category-type').value,
                desc: document.getElementById('desc-field').value,
                id: String(id)
            }
            pushData(payload);
            clearTransactionForm();
        }
        });
}

/**
 * Processes and submits data from multiple entry table mode
 * Skips empty rows and validates required fields
 */
async function pushDataFromTable() {
    const rows = document.querySelectorAll("#transact-data-table tbody tr");

    for (const row of rows) {
        // Get values from each row
        const date = row.querySelector('#table-date-field').value;
        const amount = row.querySelector('#table-amount-field').value;
        const type = row.querySelector('#table-transaction-type').value;
        const category = row.querySelector('#table-category-type').value;
        const desc = row.querySelector('#table-desc-field').value;

        // Check if any of the values are empty
        if (!date || !amount || !type || !category || !desc) {
            console.log("Empty row detected, skipping...");
            continue; // Skip this row
        }

        // If all values are present, create the payload and push data
        let payload = {
            date: date,
            amount: amount,
            type: type,
            category: category,
            id: String(id),
            desc: desc
        };

        console.log(payload);
        await pushData(payload);
    }
}


/**
 * Sends transaction data to the API
 * Handles PUT request and updates local ID counter on success
 * @param {Object} data - Transaction data payload
 */
async function pushData(data) {
    try {
        // Sanitize the input data
        const sanitizedData = sanitizeInput(data);
        
        // If sanitization failed, return early
        if (!sanitizedData) {
            console.log("Invalid data");
            return;
        }

        // Validate amount after sanitization
        if (isNaN(sanitizedData.amount)) {
            console.log("Invalid amount");
            return;
        }

        //Data is valid, proceed with PUT request
        // Perform the PUT request using fetch
        const response = await fetch(apiRoute, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sanitizedData)
        });

        console.log(`Successfully pulled: ${data.date}, ${data.amount}, ${data.type}, ${data.category}, ${data.desc}, ${data.id}`);

        //check if the response is ok, if so, show a confirmation message
        if (response.ok) {
            console.log(sanitizedData);
            id++;
            localStorage.setItem('currentId', id);
        } else {
            showConfirmation('Failed to add transaction. Please try again.', 'error');
            console.error(`Failed to submit data: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        showConfirmation('Error submitting transaction. Please try again.', 'error');
        console.error("Error submitting data:", error);
    }
}

/**
 * Sanitizes user input 
 * @param {Object} data - The data to sanitize
 * @returns {Object} Sanitized data
 * 
 * I only need to sanitize the amount, and desc, as the rest of the fields are dropdowns or date fields
 * AI helped write some of the code (return statement, and regex were AI generated to speed up the process)
 */
function sanitizeInput(data) {
    // Define allowed values for dropdowns
    const allowedTypes = ['debit', 'credit'];
    const allowedCategories = ['Rent', 'FastFood', 'Supplies', 'Gas', 'Fun', 'Misc'];
    
    // Validate date (HTML date input returns YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
        showConfirmation('Please enter a valid date', 'error');
        return null;
    }

    // Validate dropdown selections
    if (!allowedTypes.includes(data.type)) {
        showConfirmation('Invalid transaction type', 'error');
        return null;
    }
    if (!allowedCategories.includes(data.category)) {
        showConfirmation('Invalid category', 'error');
        return null;
    }

    return {
        date: data.date, // No need to sanitize date, as it is a date field
        amount: parseFloat(data.amount.replace(/[^0-9.-]/g, '')), // Only allow numbers and decimal
        type: data.type, // No need to sanitize dropdowns, checked via if statement
        category: data.category, // No need to sanitize dropdowns, checked via if statement
        desc: data.desc.trim()
            .substring(0, 200),    // Limit description length
        id: data.id
    };
}

