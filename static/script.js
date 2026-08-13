document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("siteHeader");
    const navToggle = document.getElementById("navToggle");
    const navShell = document.getElementById("navShell");
    const navLinks = document.querySelectorAll(".nav-link");
    const backTop = document.getElementById("backTop");
    const year = document.getElementById("year");


    if (year) {
        year.textContent = new Date().getFullYear();
    }


    const updateHeader = () => {

        if (window.scrollY > 35) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        if (window.scrollY > 600) {
            backTop.classList.add("visible");
        } else {
            backTop.classList.remove("visible");
        }

    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    const closeMenu = () => {

        navToggle.classList.remove("open");
        navShell.classList.remove("open");

        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        document.body.classList.remove("menu-open");
    };


    navToggle.addEventListener("click", () => {

        const isOpen =
            navShell.classList.toggle("open");

        navToggle.classList.toggle("open", isOpen);

        navToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        navToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );
    });


    navLinks.forEach(link => {

        link.addEventListener("click", () => {
            closeMenu();
        });

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });


    const sections = document.querySelectorAll(
        "main section[id]"
    );


    const sectionObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                const id = entry.target.id;

                navLinks.forEach(link => {

                    const matches =
                        link.getAttribute("href") === `#${id}`;

                    link.classList.toggle(
                        "active",
                        matches
                    );

                });

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );


    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    const revealElements =
        document.querySelectorAll(".reveal");


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );


    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    backTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    const counters =
        document.querySelectorAll("[data-count]");


    const animateCounter = element => {

        const target =
            Number(element.dataset.count);

        if (!target) {
            return;
        }

        const duration = 1200;
        const start = performance.now();


        const update = now => {

            const progress =
                Math.min(
                    (now - start) / duration,
                    1
                );

            const eased =
                1 - Math.pow(1 - progress, 3);

            const current =
                Math.floor(target * eased);

            element.textContent =
                `${current}+`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }

        };

        requestAnimationFrame(update);
    };


    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    animateCounter(
                        entry.target
                    );

                    counterObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.6
            }
        );


    counters.forEach(counter => {
        counterObserver.observe(counter);
    });


    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(anchor => {

        anchor.addEventListener(
            "click",
            event => {

                const targetId =
                    anchor.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

});
