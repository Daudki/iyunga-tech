document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("siteHeader");
    const navToggle = document.getElementById("navToggle");
    const navShell = document.getElementById("navShell");
    const navLinks = document.querySelectorAll(".nav-link");
    const backTop = document.getElementById("backTop");
    const year = document.getElementById("year");

    if (year) year.textContent = new Date().getFullYear();

    function updateHeader() {
        if (window.scrollY > 35) header.classList.add("scrolled");
        else header.classList.remove("scrolled");

        if (window.scrollY > 500) backTop.classList.add("visible");
        else backTop.classList.remove("visible");
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader);

    navToggle.addEventListener("click", () => {
        navShell.classList.toggle("open");
        navToggle.classList.toggle("open");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => navShell.classList.remove("open"));
    });

    backTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const sections = document.querySelectorAll("main section[id]");

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            navLinks.forEach(link => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${entry.target.id}`
                );
            });
        });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach(section => sectionObserver.observe(section));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", event => {
            const id = anchor.getAttribute("href");
            if (!id || id === "#") return;

            const target = document.querySelector(id);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        });
    });
});
