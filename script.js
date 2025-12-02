// Page turning functionality with touch support
const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

// Function to handle page turning
function handlePageTurn(el, index) {
    // Disable page turning on small screens (mobile layout)
    if (window.matchMedia('(max-width: 768px)').matches) {
        return;
    }

    const pageTurnId = el.getAttribute('data-page');
    const pageTurn = document.getElementById(pageTurnId);

    if(pageTurn.classList.contains('turn')){
        pageTurn.classList.remove('turn');

        setTimeout(() => {
            pageTurn.style.zIndex = 2 - index;
        }, 500);
    } else {
        pageTurn.classList.add('turn');

        setTimeout(() => {
            pageTurn.style.zIndex = 2 + index;
        }, 500);
    }
}

// Add click/tap event listeners to page turn buttons
pageTurnBtn.forEach((el, index) => {
    // Mouse click
    el.onclick = () => {
        handlePageTurn(el, index);
    };

    // Touch support for mobile
    el.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent double-firing on mobile
        handlePageTurn(el, index);
    });
});

// Contact me button functionality
const pages = document.querySelectorAll('.book-page.page-right');
const contactMeBtn = document.querySelector('.btn.contact-me');

function openContactPage() {
    // On small and medium screens, scroll to contact section instead of turning pages
    if (window.innerWidth <= 1024) {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        return;
    }

    pages.forEach((page, index) => {
        setTimeout(() => {
            page.classList.add('turn');
            setTimeout(() => {
                page.style.zIndex = 20 + index;
            }, 500);
        }, (index + 1) * 200 + 100);
    });
}

// Mouse click
contactMeBtn.onclick = (e) => {
    e.preventDefault();
    openContactPage();
};

// Touch support
contactMeBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    openContactPage();
});

// Reverse index function
let totalPages = pages.length;
let pageNumber = 0;

function reverseIndex() {
    pageNumber--;
    if(pageNumber < 0){
        pageNumber = totalPages - 1;
    }
}

// Back to profile button functionality
const backProfileBtn = document.querySelector('.back-profile');

function goBackToProfile() {
    pages.forEach((_, index) => {
        setTimeout(() => {
            reverseIndex();
            pages[pageNumber].classList.remove('turn');

            setTimeout(() => {
                reverseIndex();
                pages[pageNumber].style.zIndex = 10 + index;
            }, 500);
        }, (index + 1) * 200 + 100);
    });
}

// Mouse click
backProfileBtn.onclick = (e) => {
    e.preventDefault();
    goBackToProfile();
};

// Touch support
backProfileBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    goBackToProfile();
});

// Opening animation
const coverRight = document.querySelector('.cover.cover-right');
const pageLeft = document.querySelector('.book-page.page-left');

// Cover right animation
setTimeout(() => {
    coverRight.classList.add('turn');
}, 2100);

setTimeout(() => {
    coverRight.style.zIndex = -1;
}, 2800);

// Initial page setup
setTimeout(() => {
    pages.forEach((_, index) => {
        setTimeout(() => {
            reverseIndex();
            pages[pageNumber].classList.remove('turn');

            setTimeout(() => {
                reverseIndex();
                pages[pageNumber].style.zIndex = 10 + index;
            }, 500);
        }, (index + 1) * 200 + 2100);
    });
}, 100);

// Swipe gesture support for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

const book = document.querySelector('.book');

book.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

book.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const horizontalDiff = touchEndX - touchStartX;
    const verticalDiff = Math.abs(touchEndY - touchStartY);

    // Only register horizontal swipes (ignore vertical scrolling)
    if (verticalDiff < 50) {
        // Swipe left - next page
        if (horizontalDiff < -swipeThreshold) {
            const visibleNextBtn = Array.from(pageTurnBtn).find(btn => {
                const page = btn.closest('.page-front');
                return page && !btn.classList.contains('back') &&
                       window.getComputedStyle(page).visibility !== 'hidden';
            });
            if (visibleNextBtn) {
                visibleNextBtn.click();
            }
        }

        // Swipe right - previous page
        if (horizontalDiff > swipeThreshold) {
            const visibleBackBtn = Array.from(pageTurnBtn).find(btn => {
                const page = btn.closest('.page-back');
                return page && btn.classList.contains('back') &&
                       window.getComputedStyle(page).visibility !== 'hidden';
            });
            if (visibleBackBtn) {
                visibleBackBtn.click();
            }
        }
    }
}

// Prevent default touch behaviors that might interfere
document.querySelectorAll('.nextprev-btn, .btn').forEach(element => {
    element.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    // Force a small delay to allow the browser to adjust
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// Prevent zoom on double-tap for buttons
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
