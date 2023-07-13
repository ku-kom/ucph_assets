

window.addEventListener('DOMContentLoaded', () => {
    'use strict';
    /**
     * Link to open accordion
     */
    const slideToOpenAccordion = () => {
        /**
         * Return if Bootstrap collapse is not present
         */
        if (typeof bootstrap.Collapse !== 'function') {
            return;
        }

        /**
         * Check for accessibility settings
         */
        if (reduceMotion()) {
            return;
        }
        if (window.location.hash !== '') {
            // Open accordions or collapsible elements based on the hash in the url
            let accordionExists = window.location.hash.indexOf('accordion-') >= 0 || window.location.hash.indexOf('collapse-') >= 0;
            if (accordionExists) {
                const accordionID = window.location.hash; // Variable includes hash (#).
                // Open accordion if it exists
                const collapsibleElement = document.querySelector(accordionID);
                if (collapsibleElement) {
                    new bootstrap.Collapse(collapsibleElement).show();
                    // Scroll to accordion
                    document.querySelector(accordionID).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        }
    }
    slideToOpenAccordion();


    window.addEventListener('resize', debounce(function () {
        slideToOpenAccordion();
    }, 150));

    window.addEventListener('orientationchange', debounce(function () {
        slideToOpenAccordion();
    }, 150));

});