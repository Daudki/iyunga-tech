document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header", "components/header.html", setupHeader);
    loadComponent("footer", "components/footer.html", setupFooter);

    setupRegistrationForm();
    setupBackToTop();
});

function loadComponent(id, file, callback) {
    const container = document.getElementById(id);

    if (!container) {
        return;
    }

    fetch(file)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not load " + file);
            }

            return response.text();
        })
        .then(function (html) {
            container.innerHTML = html;

            if (callback) {
                callback();
            }
        })
        .catch(function (error) {
            console.error(error);
        });
}

function setupHeader() {
    const navToggle = document.getElementById("navToggle");
    const navShell = document.getElementById("navShell");
    const navLinks = document.querySelectorAll(".nav-link, .nav-btn");

    if (navToggle && navShell) {
        navToggle.addEventListener("click", function () {
            navShell.classList.toggle("open");
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (navShell) {
                navShell.classList.remove("open");
            }
        });
    });

    setActiveLink();
}

function setActiveLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {
        const href = link.getAttribute("href") || "";
        const parts = href.split("#");
        const page = parts[0] || "index.html";
        const hash = parts[1] || "";

        link.classList.remove("active");

        if (page === currentPage && hash === currentHash.substring(1)) {
            link.classList.add("active");
        }

        if (page === currentPage && !hash && !currentHash) {
            link.classList.add("active");
        }

        if (currentPage !== "index.html" && page === currentPage) {
            link.classList.add("active");
        }
    });
}

function setupFooter() {
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
}

function setupRegistrationForm() {
    const form = document.getElementById("addForm");
    const message = document.getElementById("formMessage");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (message) {
            message.textContent = "Student information is ready to be submitted.";
            message.classList.add("show");
        }
    });

    form.addEventListener("reset", function () {
        if (message) {
            message.textContent = "";
            message.classList.remove("show");
        }
    });
}

function setupBackToTop() {
    const backTop = document.getElementById("backTop");

    if (!backTop) {
        return;
    }

    window.addEventListener("scroll", function () {
        if (window.scrollY > 500) {
            backTop.classList.add("visible");
        } else {
            backTop.classList.remove("visible");
        }
    });

    backTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
