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
     * Run footer
     */
    const runFooter = () => {
        const footerHeading = document.querySelectorAll('.footer-section-content .footer-col-header');
        class Footer {
            constructor(footer) {
                this.footer = footer;
                this.list = this.footer.nextElementSibling;
                this.setAriaAttr();
                this.addEventListeners();
            }

            /**
             * Add attributes.
             */
            setAriaAttr() {
                //console.log(this.isMobile());
                this.footer.setAttribute('aria-expanded', isMobile() ? 'false' : 'true');
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
    }
    runFooter();
});


window.addEventListener('DOMContentLoaded', () => {
    'use strict';

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
     * Hide when scroling down, show when scrolling up
     */
    let lastScrollTop = 160;
    const animateMainmenu = () => {
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

    window.addEventListener('scroll', () => {
        animatePageHeader();
        animateMainmenu();
        scrollToTopIcon();
    }, {
        passive: true
    });

    window.addEventListener('resize', debounce(function () {
        getGlobalMenuHeight();
        animatePageHeader();
        animateMainmenu();
    }, 150));

    window.addEventListener('orientationchange', debounce(function () {
        getGlobalMenuHeight();
        animatePageHeader();
        animateMainmenu();
    }, 150));

});
