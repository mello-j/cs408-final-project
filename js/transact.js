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
    const deleteTransaction = document.getElementById('delete-button');

    // Set initial states
    dataEntryTable.style.display = 'none';
    dataEntryForm.style.display = 'flex';
    addRowButton.style.visibility = 'hidden';
    deleteTransaction.style.visibility = 'hidden';

    toggleButton.addEventListener('click', () => {
        if (dataEntryTable.style.display === 'none') {
            // Switch to table view
            dataEntryTable.style.display = 'table';
            dataEntryForm.style.display = 'none';
            addRowButton.style.visibility = 'visible';
            toggleButton.textContent = 'Single Data Entry Mode';
        } else {
            // Switch to form view
            dataEntryTable.style.display = 'none';
            dataEntryForm.style.display = 'flex';
            addRowButton.style.visibility = 'hidden';
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
    document.getElementById('transaction-type').value = 'expense';
    document.getElementById('category-type').value = 'food';
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
        // Perform the PUT request using fetch
        const response = await fetch(apiRoute, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(`Successfully pulled: ${data.date}, ${data.amount}, ${data.type}, ${data.category}, ${data.desc}, ${data.id}`);

        // Check if the request was successful
        if (response.ok) {
            console.log(`Successfully added: ${data.date}, ${data.amount}, ${data.type}, ${data.category}, ${data.desc}, ${data.id}`);
            id++; // Increment the id for the next PUT request
            localStorage.setItem('currentId', id); // Store the new id
        } else {
            console.error(`Failed to submit data: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error submitting data:", error);
    }
}