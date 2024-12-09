// js/delete.js
import { insertNavbar, detectActivePage, apiRoute } from './main.js';

// Initialize delete page
window.onload = function() {
    // Insert navigation
    insertNavbar();
    
    // Set active page
    detectActivePage();
    
    // Set up delete functionality
    fetchDeleteData();
};

/**
 * Fetches data and populates delete table with delete buttons
 */
function fetchDeleteData() {
    const reportButton = document.getElementById('delete-report');
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
                const tableBody = document.querySelector("#transact-delete-table tbody");
                tableBody.innerHTML = '';

                // Handle single item vs array of items
                if (!Array.isArray(data)) {
                    const row = document.createElement('tr');
                    console.log(data);
                    console.log(typeof data);
                    row.innerHTML = `
                        <td>${data.date}</td>
                        <td>${data.amount}</td>
                        <td>${data.type}</td>
                        <td>${data.category}</td>
                        <td>${data.desc}</td>
                        <td>${data.id}</td>
                        <td><button id="delete-button" value=${data.id}>Delete</button></td>
                    `;
                    tableBody.appendChild(row);
                    return;
                }

                // Create rows for array of items
                data.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaction.date}</td>
                        <td>${transaction.amount}</td>
                        <td>${transaction.type}</td>
                        <td>${transaction.category}</td>
                        <td>${transaction.desc}</td>
                        <td>${transaction.id}</td>
                        <td><button class="delete-button" value=${transaction.id}>Delete</button></td>
                    `;
                    tableBody.appendChild(row);
                });
                attachDeleteListeners();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });
}

/**
 * Attaches event listeners to all delete buttons
 */
function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            deleteRow(button.value, button);
        });
    });
}

/**
 * Deletes a specific row from the database and updates UI
 * @param {string} deleteId - ID of row to delete
 * @param {Element} button - Button element that triggered delete
 */
async function deleteRow(deleteId, button) {
    try {
        console.log("Deleting row with id:", deleteId);
        const response = await fetch(`${apiRoute}/${deleteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            let row = button.closest('tr');
            row.innerHTML = '';
            console.log("Successfully deleted: " + deleteId);
        } else {
            console.error('Failed to delete row. Status:', response.status);
        }
    } catch (error) {
        console.error('Error deleting row:', error);
    }
}