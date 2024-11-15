window.onload = function() {
    insertNavbar();
};

function insertNavbar() {
    const navHtml =`
        <nav>
          <a href="../pages/index.html">Home</a>
          <a href="../pages/login.html">Login</a>
          <a href="../pages/index.html">Dashboard</a>
          <a href="../pages/login.html">Transact</a>
          <a href="../pages/index.html">Download</a>
          <a href="../pages/login.html">Contact</a>
        </nav>
    `;

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
    currentPage =window.location.pathname;
    console.log(currentPage);
}



