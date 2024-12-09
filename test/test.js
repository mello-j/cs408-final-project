// test/test.js
import { insertNavbar, detectActivePage, apiRoute } from '../js/main.js';
import { contactUs } from '../js/contact.js';  // Make sure contactUs is exported


//Test the main. js functions!
QUnit.module('Main Webpage functions', function() {
    QUnit.test('insertNavbar adds navigation to header and footer', function(assert) {
        // Create temporary header and footer for testing - I needed help from chatgpt to figure out how to do this
        //neat idea to create a div and append it to the body to use for the testing purposes! I wrote the rest of the test.
        const testDiv = document.createElement('div');
        testDiv.innerHTML = `
            <header></header>
            <footer></footer>
        `;
        document.body.appendChild(testDiv);

        // Call the function
        insertNavbar();

        // Check if nav elements were created
        const headerNav = document.querySelector('header nav');
        const footerNav = document.querySelector('footer nav');
        assert.ok(headerNav, 'Navigation was added to header');
        assert.ok(footerNav, 'Navigation was added to footer');

        // Check if all nav links are present
        const navLinks = headerNav.querySelectorAll('a');
        assert.equal(navLinks.length, 7, 'All seven navigation links are present');

        // Check specific links
        assert.ok(navLinks[0].href.endsWith('index.html'), 'Home link is present');
        assert.ok(navLinks[1].href.endsWith('dashboard.html'), 'Dashboard link is present');
        assert.ok(navLinks[2].href.endsWith('transact.html'), 'Transact link is present');
        assert.ok(navLinks[3].href.endsWith('report.html'), 'Report link is present');
        assert.ok(navLinks[4].href.endsWith('download.html'), 'Download link is present');
        assert.ok(navLinks[5].href.endsWith('delete.html'), 'Delete link is present');
        assert.ok(navLinks[6].href.endsWith('contact.html'), 'Contact link is present');

        // Clean up - remove the test elements
        document.body.removeChild(testDiv);
    });


    QUnit.test('detectActivePage correctly identifies all pages', function(assert) {
        const pages = ['index', 'dashboard', 'transact', 'report', 'download', 'delete', 'contact'];
        
        pages.forEach(function(page) {
            let currentUrl= `http://example.com/pages/${page}.html`
            /* Split the path and get the last element */
            currentUrl = currentUrl.split("/");
            currentUrl = currentUrl[currentUrl.length - 1];
            currentUrl = currentUrl.split(".");
            currentUrl = currentUrl[0];
            assert.equal(currentUrl, page, `Correctly identified ${page} page`);
        });
        
    });

    QUnit.test('Check const APIRoute', function(assert) {
        // Create temporary header and footer for testing
        const apiTestRoute = "https://68y5yyii0l.execute-api.us-east-2.amazonaws.com/transactions";

        assert.equal(apiRoute, apiTestRoute, 'API Route is correct');
    });
});

//Test the contact.js function!
QUnit.module('Contact Webpage functions', function() {
    QUnit.test('contact us shows alert', function(assert) {
        // Create test button
        const button = document.createElement('button');
        button.id = 'send';
        document.body.appendChild(button);
        
        // Mock alert
        let alertMessage = '';
        window.alert = function(message) {
            alertMessage = message;
        };

        // Run contact form setup
        contactUs();

        // Click the button
        button.click();

        // Check if correct message was shown
        assert.equal(alertMessage, "Sorry, this function is disabled! Well actually I never enabled it :)", 'Shows correct alert message');
    });
});

    