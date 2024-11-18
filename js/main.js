window.onload = function() {
    insertNavbar();
    detectActivePage();
};

function insertNavbar() {
    /* Create the nav bar */
    const navHtml =`
        <nav>
            <ul>
                <li id="index"><a href="../pages/index.html">Home</a></li>
                <li id="login" ><a href="../pages/login.html">Login</a></li>
                <li id="dashboard"><a href="../pages/dashboard.html">Dashboard</a></li>
                <li id="transact"><a href="../pages/transact.html">Transact</a></li>
                <li id="download"><a  href="../pages/download.html">Download</a></li>
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
}



