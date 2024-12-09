// js/download.js
import { insertNavbar, detectActivePage } from './main.js';

let filterData;
// Initialize download page

window.onload = function() {    
    // Insert navigation
    insertNavbar();
    
    // Set active page
    detectActivePage();
    
    // Load existing data if any
    filterData = JSON.parse(localStorage.getItem('filterData'));
    console.log('Filter data:', filterData);
    let retrievedData = localStorage.getItem('transactionData');
    clearTable();

    if (retrievedData) {
        if (filterData && Object.keys(filterData).some(key => filterData[key])) {
            // filterData has at least one non-empty key
            let parsedData = JSON.parse(retrievedData);
            loadFilteredTable(parsedData);
          } else {
            let parsedData = JSON.parse(retrievedData);
            loadTable(parsedData)
          }
    }
    else {
        console.log('No data found in localStorage');
    }

    // Set up download functionality
    downloadCSV();
};

/**
 * Populates table with transaction data
 * @param {Object|Array} transactions - Transaction data to display
 */
function loadTable(transactions) {
    const tableBody = document.querySelector("#transact-display-table tbody");
    tableBody.innerHTML = '';

    // Handle single transaction vs array
    if (!Array.isArray(transactions)) {
        const row = document.createElement('tr');
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
 * Populates table with transaction data
 * @param {Object|Array} transactions - Transaction data to display
 */
function loadFilteredTable(transactions) {
    const tableBody = document.querySelector("#transact-display-table tbody");
    tableBody.innerHTML = '';

    // Handle single transaction vs array
    if (!Array.isArray(transactions)) {
        if (validateResults(transactions)) {
            const row = document.createElement('tr');
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
    }

    // Handle array of transactions
    transactions.forEach(transaction => {
        if(validateResults(transaction)) {
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
        }
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


/**
 * Validates transaction data against filter criteria
 * @param {Object} transaction - Transaction data to validate
 * @returns {boolean} Whether the transaction matches the filter criteria
 */
function validateResults(transaction) {
    let isMatch = true;

    if (filterData.date && transaction.date !== filterData.date) {
        isMatch = false;
    }

    if (filterData.amount && transaction.amount !== filterData.amount) {
        isMatch = false;
    }

    if (filterData.type && transaction.type !== filterData.type) {
        isMatch = false;
    }

    if (filterData.category && transaction.category !== filterData.category) {
        isMatch = false;
    }

    return isMatch;
}