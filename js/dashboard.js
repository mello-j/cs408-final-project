// js/dashboard.js javascript for the dashboard page

import { insertNavbar, detectActivePage, apiRoute } from './main.js';

// Initialize page
window.onload = function() {
    // Insert navigation
    insertNavbar();
    
    // Set active page
    detectActivePage();
    // Set up dashboard functionality
    toggleReporting();
    
    fetchDashboardData().then(data => {
        if (data) {
            createDashboard(data);
        } else {
            console.error('Failed to fetch dashboard data');
        }
    });
    updateDashboard();
};

//page -specific functions
/**
 * Fetches data specifically for dashboard visualization
 * @returns {Promise} Resolves to dashboard data or null if error
 */
async function fetchDashboardData() {
    try {
        const response = await fetch(apiRoute);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        localStorage.setItem('transactionData', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
}

/**
 * Creates and displays dashboard visualizations
 * @param {Array} data - Transaction data for visualization
 */
function createDashboard(data) {
    // Process data for charts
    const categories = {};
    console.log(data);
    data.forEach(transaction => {
        console.log("test");
        categories[transaction.category] = (categories[transaction.category] || 0) + parseFloat(transaction.amount);        
    });

    // Define chart colors
    const chartColors = [
        '#92D36E', // Original brand color
        '#7AB559', // Darker
        '#A8DC89', // Lighter
        '#649744', // Even darker
        '#BFE5A4', // Even lighter
        '#4D7934' // Darkest
    ];

    // Create/Update Pie Chart
    const pieChartCanvas = document.getElementById('pieChart');
    let pieChart = Chart.getChart(pieChartCanvas);

    if (pieChart) {
        pieChart.data.labels = Object.keys(categories);
        pieChart.data.datasets[0].data = Object.values(categories);
        pieChart.update();
    } else {
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
                        text: 'Expenses by Category',
                        font: {
                            color: '#333'
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14,   // Set legend font size
                            }
                    }
                }
            }
            }
        });
    }

    // Create/Update Bar Chart
    const barChartCanvas = document.getElementById('barChart');
    let barChart = Chart.getChart(barChartCanvas);

    if (barChart) {
        barChart.data.labels = Object.keys(categories);
        barChart.data.datasets[0].data = Object.values(categories);
        barChart.update();
    } else {
        barChart = new Chart(barChartCanvas, {
            type: 'bar',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    label: 'Amount ($)',
                    data: Object.values(categories),
                    backgroundColor: '#92D36E'
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
                        display: false,
                        labels: {
                            font: {
                                size: 14,   // Set legend font size
                            }
                    }
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

/**
 * Toggles dashboard reporting interface visibility
 */
function toggleReporting() {
    const toggleButton = document.getElementById('update-report');
    const dataEntryForm = document.getElementById('dashboard-data-form');
    const updateButton = document.getElementById('generate-report');

    dataEntryForm.style.display = 'none';
    updateButton.style.visibility = 'hidden';

    toggleButton.addEventListener('click', () => {
        if (dataEntryForm.style.display === 'flex') {
            dataEntryForm.style.display = 'none';
            toggleButton.textContent = 'Show Dashboard Filter';
            updateButton.style.visibility = 'hidden';
        } else {
            dataEntryForm.style.display = 'flex';
            toggleButton.textContent = 'Hide Dashboard Filter';
            updateButton.style.visibility = 'visible';
        }
    });
}


//FINISH ME!
// /*
// * Update dashboard with new data
//  */
// function updateDashboard() {
//     const reportButton = document.getElementById('generate-report');
//     reportButton.addEventListener('click', () => {
//         let filters = validateFormData();
        
//         createDashboard(filteredData);
//     });
// }

// /**
//  * Validates form data and returns filter object
//  * @returns {Object} Filter object
//  */
// function validateFormData() {
//     const dateFilter = document.getElementById('date-field').value;
//     const amountFilter = document.getElementById('amount-field').value;
//     const typeFilter = document.getElementById('transaction-field').value;
//     const categoryFilter = document.getElementById('category-field').value;
  
//     const filters = {
//        date: dateFilter,
//        amount: amountFilter,
//        type: typeFilter,
//        category: categoryFilter
//     }
//     return filters;
// }
// /**
//  * Validates transaction data against filter criteria
//  * @param {Object} transaction - Transaction data to validate
//  * @returns {boolean} Whether the transaction matches the filter criteria
//  */
// function validateResults(transaction) {
//     let isMatch = true;

//     if (filterData.date && transaction.date !== filterData.date) {
//         isMatch = false;
//     }

//     if (filterData.amount && transaction.amount !== filterData.amount) {
//         isMatch = false;
//     }

//     if (filterData.type && transaction.type !== filterData.type) {
//         isMatch = false;
//     }

//     if (filterData.category && transaction.category !== filterData.category) {
//         isMatch = false;
//     }

//     return isMatch;
// }
