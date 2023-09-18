/* eslint-disable no-redeclare */
/* ========================================================================
 * Copyright 2022
 * University of Copenhagen, FA Communications, Nanna Ellegaard.
 * ========================================================================*/


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

/**
 * Check OS reduced motion setting
 */
const reduceMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
* Detect screen size.
* @returns boolean.
*/
const isMobile = () => {
    return window.matchMedia('(max-width: 991px)').matches;
}

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /**
     * Detect click on page search overlay
     */
    const searchOverlay = () => {
        const searchOverlayBtnOpen = document.querySelector('#headerSearchOpen');
        const searchOverlayBtnClose = document.querySelector('#headerSearchClose');
        const searchOverlay = document.querySelector('.global-search');
        if (searchOverlayBtnOpen) {
            searchOverlayBtnOpen.addEventListener('click', () => {
                searchOverlay.classList.add('is-open');
            });
        }
        if (searchOverlayBtnClose) {
            searchOverlayBtnClose.addEventListener('click', () => {
                searchOverlay.classList.remove('is-open');
            });
        }
    }
    searchOverlay();

    /**
     * Remove focus from "scroll to top" element when clicked
     */
    document.getElementById('scrollToTop').addEventListener('click', (event) => {
        event.currentTarget.blur();
    });

    /**
     * Class to control if footer is collapsed or expanded.
     */
    const runFooter = () => {
        const footerHeading = document.querySelectorAll('.footer-section-content > details');
        class Footer {
            constructor(footer) {
                this.footer = footer;
                this.setFooter();
                this.addEventListeners();
            }

            /**
             * set up footer.
             * Check if it needs to be collapsed or expanded.
             */
            setFooter() {
                if (isMobile() === false) {
                    this.footer.setAttribute('open', 'true');
                } else {
                    // Not enough to set attribute [open] to false - it needs to be removed entirely
                    this.footer.removeAttribute('open');
                }
            }

            addEventListeners() {
                window.addEventListener('resize', debounce(() => {
                    this.setFooter();
                }, 120));

                window.addEventListener('orientationchange', debounce(() => {
                    this.setFooter();
                }, 120));
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
    }
    runFooter();

    const createMobileMenu = () => {
        const leftMenuList = document.querySelectorAll('.ku-leftmenu > nav > .navbar-nav');
        class MobileMenu {
            constructor(leftmenu) {
                this.leftmenu = leftmenu;
                this.getItems();
                this.addEventListeners();
            }

            /**
             * Append left menu items to global menu items
             */
            getItems() {
                if (isMobile()) {
                    const target = document.querySelector('.catchLeftMenu');
                    if (target) {
                        target.innerHTML = '';
                        target.insertAdjacentHTML('beforeend', this.leftmenu.outerHTML);
                        document.querySelector('.ku-leftmenu').innerHTML = '';
                    }
                }
            }

            addEventListeners() {
                window.addEventListener('resize', debounce(() => {
                    this.getItems();
                }, 120));

                window.addEventListener('orientationchange', debounce(() => {
                    this.getItems();
                }, 120));
            }
        }
        /**
         * Assign class to left menu.
         */
        if (leftMenuList) {
            leftMenuList.forEach((item) => {
                const menuEl = new MobileMenu(item);
            });
        }
    }
    createMobileMenu();

    /**
     * Animate header
     * When scroling down, add class.
     */
    const animateHeader = () => {
        if (isMobile()) {
            return;
        }
        const pageHeader = document.getElementById('page-header');
        // multiple checks for browser compatibility:
        let scollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (pageHeader) {
            pageHeader.classList.toggle('is-small', scollPosition > 100);
        }
    }
    animateHeader();

    /**
     * Animate global menu
     * Hide when scroling down, show when scrolling up
     */
    let lastScrollTop = 160;
    const animateMainmenu = () => {
        if (isMobile()) {
            return;
        }
        const pageHeader = document.getElementById('global-menu');
        if (!pageHeader) {
            return;
        }
        let scrollposition = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollposition > lastScrollTop) {
            // Scrolling down
            pageHeader.classList.add('is-up');
        } else if (scrollposition < lastScrollTop) {
            // Scrolling up
            pageHeader.classList.remove('is-up');
        }
        // else is horizontal scroll
        lastScrollTop = scrollposition <= 0 ? 0 : scrollposition;
    }
    animateMainmenu();

    window.addEventListener('scroll', () => {
        animateHeader();
        animateMainmenu();
    }, {
        passive: true
    });

    window.addEventListener('resize', debounce(function () {
        animateHeader();
        animateMainmenu();
    }, 150));

    window.addEventListener('orientationchange', debounce(function () {
        animateHeader();
        animateMainmenu();
    }, 150));
});
