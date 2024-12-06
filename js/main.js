//Using the same endpoint so make available globally
const apiRoute = "https://68y5yyii0l.execute-api.us-east-2.amazonaws.com/transactions";

//global variable to keep track of the id for put request
let id = parseInt(localStorage.getItem('currentId')) || 1;


let currentPage;

window.onload = function() {
    insertNavbar();
    currentPage = detectActivePage();

    if (currentPage == 'transact') {
        toggleDataEntry();
        addRow();
        putData();
    }
    else if (currentPage == 'report') {
        fetchData();
    }
    else if (currentPage == 'download') {
        let retrievedData = localStorage.getItem('transactionData');
        clearTable();
        console.log(retrievedData);

        if (retrievedData) {
            let parsedData = JSON.parse(retrievedData);
            loadTable(parsedData); // Assuming your data is an object with a 'transactions' array
        } else {
            console.log('No data found in localStorage');
        }

        downloadCSV();
    }
    else if (currentPage == 'dashboard') {
        toggleReporting();
        fetchDashboardData().then(data => {
            if (data) {
                createDashboard(data);
            } else {
                console.error('Failed to fetch dashboard data');
            }
        });
    }
    else if (currentPage == 'delete') {
        fetchDeleteData();
    }
    else if (currentPage == 'contact') {
        contactUs();
    }
};

function insertNavbar() {
    /* Create the nav bar */
    console.log("I am here!");
    const navHtml =`
        <nav>
            <ul>
                <li id="index"><a href="../pages/index.html">Home</a></li>
                <li id="dashboard"><a href="../pages/dashboard.html">Dashboard</a></li>
                <li id="transact"><a href="../pages/transact.html">Transact</a></li>
                <li id="report"><a  href="../pages/report.html">Report</a></li>
                <li id="download"><a  href="../pages/download.html">Download</a></li>
                <li id="delete"><a  href="../pages/delete.html">Delete</a></li>
                <li id="contact" ><a href="../pages/contact.html">Contact</a></li>
            </ul>
        </nav>
    `;

    /* Insert the nav bar into the header and footer */
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header){
        header.innerHTML += navHtml;
    } else {
        console.log('No Header elements');
    }

    if (footer){
        footer.innerHTML += navHtml;
    } else {
        console.log('No footer elements');
    }
}

function detectActivePage(){
    /* Get the current page */
    currentPage =window.location.pathname;

    /* Split the path and get the last element */
    currentPage = currentPage.split("/");
    currentPage = currentPage[currentPage.length - 1];
    currentPage = currentPage.split(".");
    currentPage = currentPage[0];

    /* Get the nav links for the current page*/
    const navLinks = document.querySelectorAll(`#${currentPage}`);
    navLinks.forEach(link => {
        link.classList.add('active');
    });

    return currentPage;
}

function toggleDataEntry() {
    const toggleButton = document.getElementById('toggle-button');
    const dataEntryTable = document.getElementById('transact-data-table');
    const dataEntryForm = document.getElementById('transact-data-form');
    const addRowButton = document.getElementById('add-row');
    const deleteTransaction= document.getElementById('delete-button');

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

function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            deleteRow(button.value, button);
        });
    });
}

function fetchDeleteData() {
    const reportButton = document.getElementById('delete-report');
    reportButton.addEventListener('click', () => {

        console.log("fetching data from: ", apiRoute);

        // Use fetch to get the data from the API route
        fetch(apiRoute)
            .then(response => {
                // Check for a successful response
                console.log('Response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse JSON from the response
            })
            .then(data => {
                // output to the table
                const tableBody = document.querySelector("#transact-delete-table tbody");
                // Clear any existing rows
                tableBody.innerHTML = '';
                // If not an array, just create single row
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
                        <td><button id="delete-button"  value=${data.id}>Delete</button></td>
                    `;
                    tableBody.appendChild(row);
                    return;
                }
                // If it is an array, proceed with forEach
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

async function deleteRow(deleteId, button) {
    try {
        console.log("Deleting row with id:", deleteId);
        const response = await fetch(`${apiRoute}/${deleteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check if the request was successful (status 200)
        if (response.ok) {
            let row = button.closest('tr');
            row.innerHTML = '';  // Clear the row from the table

            // Log the successful deletion for debugging purposes
            console.log("Successfully deleted: " + deleteId);
        } else {
            // Handle non-successful responses
            console.error('Failed to delete row. Status:', response.status);
        }
    } catch (error) {
        // Handle any network or other errors
        console.error('Error deleting row:', error);
    }
}

function fetchData() {
    const reportButton = document.getElementById('generate-report');
    reportButton.addEventListener('click', () => {

        console.log("fetching data from: ", apiRoute);

        // Use fetch to get the data from the API route
        fetch(apiRoute)
            .then(response => {
                // Check for a successful response
                console.log('Response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse JSON from the response
            })
            .then(data => {
                // store the data for access later
                localStorage.setItem('transactionData', JSON.stringify(data));
                console.log('Data stored in localStorage:', data);
                console.log(localStorage.getItem('transactionData'));
                // Redirect to download.html to display the data
                window.location.href = 'download.html'; // Adjust the path as necessary
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        });
}

async function fetchDashboardData() {
    try {
        const response = await fetch(apiRoute);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Store in localStorage for the dashboard
        localStorage.setItem('transactionData', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
}

function loadTable(transactions){
    console.log(transactions);
    const tableBody = document.querySelector("#transact-display-table tbody");

    // Clear any existing rows
    tableBody.innerHTML = '';

   // If not an array, just create single row
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

    // If it is an array, proceed with forEach
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

function createDashboard(data) {
    // Process data for charts
    const categories = {};
    console.log(data);
    data.forEach(transaction => {
      console.log("test");
      if (transaction.type === 'expense') {
        categories[transaction.category] = (categories[transaction.category] || 0) + parseFloat(transaction.amount);
      }
    });
  
    // Creating shades of your brand color
    const chartColors = [
      '#92D36E', // Original brand color
      '#7AB559', // Darker
      '#A8DC89', // Lighter
      '#649744', // Even darker
      '#BFE5A4', // Even lighter
      '#4D7934' // Darkest
    ];
  
    // Get the pie chart canvas element
    const pieChartCanvas = document.getElementById('pieChart');
  
    // Check if the pie chart already exists
    let pieChart = Chart.getChart(pieChartCanvas);
  
    // If the pie chart exists, update its data
    if (pieChart) {
      pieChart.data.labels = Object.keys(categories);
      pieChart.data.datasets[0].data = Object.values(categories);
      pieChart.update();
    } else {
      // If the pie chart doesn't exist, create a new one
      pieChart = new Chart(pieChartCanvas, {
        type: 'pie',
        data: {
          labels: Object.keys(categories),
          datasets: [{
            data: Object.values(categories),
            backgroundColor: chartColors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Expenses by Category'
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  
    // Get the bar chart canvas element
    const barChartCanvas = document.getElementById('barChart');
  
    // Check if the bar chart already exists
    let barChart = Chart.getChart(barChartCanvas);
  
    // If the bar chart exists, update its data
    if (barChart) {
      barChart.data.labels = Object.keys(categories);
      barChart.data.datasets[0].data = Object.values(categories);
      barChart.update();
    } else {
      // If the bar chart doesn't exist, create a new one
      barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: {
          labels: Object.keys(categories),
          datasets: [{
            label: 'Amount ($)',
            data: Object.values(categories),
            backgroundColor: '#92D36E' // Using original brand color for bars
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Category Breakdown'
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount ($)'
              }
            }
          }
        }
      });
    }
  }


function toggleReporting(){
    /* Get the date entry form */
    const toggleButton = document.getElementById('update-report');
    const dataEntryForm = document.getElementById('dashboard-data-form');
    const updateButton = document.getElementById('generate-report');

    //set default display
    dataEntryForm.style.display = 'none';
    updateButton.style.visibility = 'hidden';


    /* Toggle the display */    
    toggleButton.addEventListener('click', () => {
        if (dataEntryForm.style.display === 'flex') {
            // If the form is shown, hide it and update the button
            dataEntryForm.style.display = 'none';  // hide the form
            toggleButton.textContent = 'Show Dashboard Filter'; // Update button text
            updateButton.style.visibility = 'hidden';
        } else {
            // If the form is not visible, show it and update the button
            dataEntryForm.style.display = 'flex';  // show the form
            toggleButton.textContent = 'Hide Dashboard Filter'; // Update button text
            updateButton.style.visibility = 'visible';
        } 
    });
}

// CSV Download Function
function downloadCSV() {
    const downloadButton = document.getElementById('download-csv');
    
    /* download a csv if user clicks */    
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

function contactUs(){
    const sendButton = document.getElementById('send');
    sendButton.addEventListener('click', (event) => {
        // Prevent default behavior if necessary (e.g., form submission)
        if (event) event.preventDefault();
        alert("Sorry, this function is disabled! Well actually I never enabled it :)");
    });
}

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
        let payload ={
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
        pushData(payload);
    }
}

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

    function clearTransactionForm() {
        // Clear the form fields
        document.getElementById('date-field').value = '';
        document.getElementById('amount-field').value = '';
        document.getElementById('transaction-type').value = 'expense';
        document.getElementById('category-type').value = 'food';
        document.getElementById('desc-field').value = '';
    }

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