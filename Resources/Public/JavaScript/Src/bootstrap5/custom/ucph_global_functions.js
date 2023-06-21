/* eslint-disable no-redeclare */
/* ========================================================================
 * Copyright 2022
 * University of Copenhagen, FA Communications, Nanna Ellegaard.
 * ========================================================================*/

//import { Footer } from './ucph_global_footer.js';

/**
 * Check OS reduced motion setting
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Delay function init, e.g. on resizing or orientation change. Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds.
 * Usage: debounce(myFunction, 250)
 * @param {function to be passed in} func 
 * @param {debounce time in ms} wait 
 * @param {If `immediate` is passed, trigger the function on the leading edge, instead of the trailing} immediate 
 * @returns a function
 */
const debounce = (func, wait, immediate) => {
    let timeout;
    return function () {
        let context = this,
            args = arguments;
        let later = () => {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const footerHeading = document.querySelectorAll('.footer-section-content .footer-col-header');
    class Footer {
        constructor(footer) {
            this.footer = footer;
            this.list = this.footer.nextElementSibling;
            this.setAriaAttr();
            this.addEventListeners();
        }

        /**
         * Detect screen size.
         * @returns boolean.
         */
        isMobile() {
            return window.matchMedia('(max-width: 767px)').matches;
        }

        /**
         * Add attributes.
         */
        setAriaAttr() {
            //console.log(this.isMobile());
            this.footer.setAttribute('aria-expanded', this.isMobile() ? 'false' : 'true');
        }

        /**
         * Clear footer.
         */
        resetFooter() {
            this.list.style.removeProperty('height');
            this.list.classList.remove('active');
        }

        /**
         * Slide footer columns open or closed.
         */
        toggleFooter() {
            if (!this.list.classList.contains('active')) {
                /**
                 * Slide down
                 */
                this.list.classList.add('active');
                this.list.style.height = 'auto';

                let height = this.list.clientHeight + 'px';
                this.list.style.height = '0';
                setTimeout(() => {
                    this.list.style.height = height;
                }, 0);
                this.footer.setAttribute('aria-expanded', 'true');
            } else {
                /**
                 * Slide up
                 */
                this.list.style.height = '0';
                this.footer.setAttribute('aria-expanded', 'false');

                /**
                 * Remove the `active` class when the animation ends
                 */
                this.list.addEventListener('transitionend', () => {
                    this.list.classList.remove('active');
                }, {
                    once: true
                });
            }
        }

        addEventListeners() {
            this.footer.addEventListener('click', () => {
                this.toggleFooter();
            });

            window.addEventListener('resize', debounce(() => {
                this.resetFooter();
                this.setAriaAttr();
            }, 150));

            window.addEventListener('orientationchange', debounce(() => {
                this.resetFooter();
                this.setAriaAttr();
            }, 150));
        }
    }
    /**
     * Assign class to footer headings.
     */
    if (footerHeading) {
        footerHeading.forEach((column) => {
            const footerEl = new Footer(column);
        });
    }
});


window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /**
     * Animate page header
     */
    const animatePageHeader = () => {
        const pageHeader = document.getElementById('page-header');
        // multiple checks for browser compatibility:
        let scollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (pageHeader) {
            pageHeader.classList.toggle('is-small', scollPosition > 100);
        }
    }
    animatePageHeader();

    /**
     * Animate global menu
     */
    const animateMainmenu = () => {
        const pageHeader = document.getElementById('global-menu');
        // multiple checks for browser compatibility:
        let scollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (pageHeader) {
            pageHeader.classList.toggle('is-up', scollPosition > 200);
        }
    }
    animateMainmenu();

    /**
     * Get height og global menu and set it on page spacer for styling purposes
     */
    const getGlobalMenuHeight = () => {
        const pageHeader = document.querySelector('.header-navigation');
        const pageHeaderSpacer = document.querySelector('.pageheader-spacer');
        if (pageHeader && pageHeaderSpacer) {
            pageHeaderSpacer.setAttribute('style', '--page-header-height: ' + (pageHeader.offsetHeight) + 'px');
        } 
    }
    getGlobalMenuHeight();

    /**
     * Show/hide "scroll to top" if it exists
     */
    const scrollToTopIcon = () => {
        const scrollToTop = document.getElementById('scrollToTop');
        // multiple checks for browser compatibility:
        let scollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollToTop) {
            scrollToTop.classList.toggle('show', scollPosition > 60);
        }
    }
    scrollToTopIcon();

    /**
     * Remove focus from "scroll to top" element when clicked
     */
    document.getElementById('scrollToTop').addEventListener('click', (event) => {
        event.currentTarget.blur();
    });

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
        if (reduceMotion.matches) {
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
    // slideToOpenAccordion();

    // Listen to "scroll to top" on scroll
    window.addEventListener('scroll', () => {
        animatePageHeader();
        animateMainmenu();
        scrollToTopIcon();
    }, {
        passive: true
    });

    window.addEventListener('resize', debounce(function () {
        animatePageHeader();
        animateMainmenu();
        getGlobalMenuHeight();
        //slideToOpenAccordion();
    }, 150));

    window.addEventListener('orientationchange', debounce(function () {
        animatePageHeader();
        animateMainmenu();
        getGlobalMenuHeight();
        //slideToOpenAccordion();
    }, 150));

});
