// js/main.js - javascript shared across all webpages
//Using the same endpoint so make available globally
export const apiRoute = "https://68y5yyii0l.execute-api.us-east-2.amazonaws.com/transactions";

/**
 * Creates and inserts navigation bar into header and footer
 * Contains links to all major sections of the application
 */
export function insertNavbar() {
    /* Create the nav bar */
    console.log("I am here!");
    const navHtml = `
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
    if (header) {
        header.innerHTML += navHtml;
    } else {
        console.log('No Header elements');
    }

    if (footer) {
        footer.innerHTML += navHtml;
    } else {
        console.log('No footer elements');
    }
}

/**
 * Detects and marks the current active page in navigation
 * @returns {string} The current page identifier
 */
export function detectActivePage() {
    /* Get the current page */
    let currentPage = window.location.pathname;

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



