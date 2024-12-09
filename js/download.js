// js/download.js
import { insertNavbar, detectActivePage } from './main.js';

// Initialize download page
document.addEventListener('DOMContentLoaded', function() {
    // Insert navigation
    insertNavbar();
    
    // Set active page
    detectActivePage();
    
    // Load existing data if any
    let retrievedData = localStorage.getItem('transactionData');
    clearTable();
    console.log(retrievedData);

    if (retrievedData) {
        let parsedData = JSON.parse(retrievedData);
        loadTable(parsedData);
    } else {
        console.log('No data found in localStorage');
    }

    // Set up download functionality
    downloadCSV();
});

/**
 * Populates table with transaction data
 * @param {Object|Array} transactions - Transaction data to display
 */
function loadTable(transactions) {
    console.log(transactions);
    const tableBody = document.querySelector("#transact-display-table tbody");
    tableBody.innerHTML = '';

    // Handle single transaction vs array
    if (!Array.isArray(transactions)) {
        const row = document.createElement('tr');
        console.log(transactions);
        console.log(typeof transactions);
        row.innerHTML = `
            <td>${transactions.date}</td>
            <td>${transactions.amount}</td>
            <td>${transactions.type}</td>
            <td>${transactions.category}</td>
            <td>${transactions.id}</td>
            <td>${transactions.desc}</td>
        `;
        tableBody.appendChild(row);
        return;
    }

    // Handle array of transactions
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.type}</td>
            <td>${transaction.category}</td>
            <td>${transaction.id}</td>
            <td>${transaction.desc}</td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Handles CSV file download functionality for transaction data
 * Creates a CSV file from table data and triggers browser download
 */
function downloadCSV() {
    const downloadButton = document.getElementById('download-csv');

    downloadButton.addEventListener('click', () => {
        const table = document.getElementById('transact-display-table');
        if (!table) {
            console.error('Table not found');
            return;
        }
        else if (table.querySelectorAll('tbody tr').length === 0) {
            console.error('No data to download');
            return;
        }

        let csv = [];

        // Get headers
        const headers = [];
        table.querySelectorAll('th').forEach(th => {
            headers.push(th.textContent.trim());
        });
        csv.push(headers.join(','));

        // Get data rows
        table.querySelectorAll('tbody tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach(cell => {
                // Escape any commas in the cell content
                rowData.push(`"${cell.textContent.trim()}"`);
            });
            csv.push(rowData.join(','));
        });

        // Create and trigger download
        const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

/**
 * Clears the transaction table and removes data from localStorage
 */
function clearTable() {
    const clearButton = document.getElementById('clear-report');
    clearButton.addEventListener('click', (event) => {
        // Prevent default behavior if necessary (e.g., form submission)
        if (event) event.preventDefault();

        const tableBody = document.querySelector("#transact-display-table tbody");
        tableBody.innerHTML = ''; // Clear the table contents

        // Clear the localStorage data
        localStorage.removeItem('transactionData');
    });
}