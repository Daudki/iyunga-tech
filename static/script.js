// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = primaryNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.classList.toggle("is-active", isOpen);
    });

    // Close menu when a link is tapped (mobile)
    primaryNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            primaryNav.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// Header shadow / solid state after scrolling
const header = document.getElementById("site-header");
if (header) {
    const onScroll = () => {
        header.style.boxShadow = window.scrollY > 8 ? "0 8px 24px rgba(0,0,0,.25)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

