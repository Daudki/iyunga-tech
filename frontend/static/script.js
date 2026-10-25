const API_URL = "https://iyunga-backend-zylh.onrender.com/api/students";

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupStudentForm();
    setupEditModal();
    displayStudents();
    setupBackToTop();
    setupYear();
});

function setupNavigation() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("navShell");
    if (toggle && nav) toggle.onclick = () => nav.classList.toggle("open");
}

async function setupStudentForm() {
    const form = document.getElementById("addForm");
    if (!form) return;

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const student = {
            firstName: document.getElementById("firstName").value.trim(),
            secondName: document.getElementById("secondName").value.trim(),
            email: document.getElementById("email").value.trim(),
            level: document.getElementById("level").value
        };

        if (!student.firstName || !student.secondName || !student.email || !student.level) {
            alert("Please complete all student details before submitting.");
            return;
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Unable to register the student.");
        }

        alert("Student registered successfully");
        form.reset();
        displayStudents();
    });
}

function setupEditModal() {
    const modal = document.getElementById("editStudentModal");
    const form = document.getElementById("editStudentForm");
    const closeButton = document.getElementById("closeEditModal");
    const cancelButton = document.getElementById("cancelEditButton");

    if (!modal || !form || !closeButton || !cancelButton) return;

    closeButton.addEventListener("click", closeEditModal);
    cancelButton.addEventListener("click", closeEditModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) closeEditModal();
    });

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const id = document.getElementById("editStudentId").value;
        const student = {
            firstName: document.getElementById("editFirstName").value.trim(),
            secondName: document.getElementById("editSecondName").value.trim(),
            email: document.getElementById("editEmail").value.trim(),
            level: document.getElementById("editLevel").value
        };

        if (!id || !student.firstName || !student.secondName || !student.email || !student.level) {
            alert("Please complete all fields before saving.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Unable to update the student.");
            }

            alert("Student updated successfully");
            closeEditModal();
            displayStudents();
        } catch (error) {
            alert(error.message || "Unable to update the student.");
        }
    });
}

function openEditStudent(id) {
    const modal = document.getElementById("editStudentModal");
    const form = document.getElementById("editStudentForm");
    if (!modal || !form) return;

    fetch(`${API_URL}/${id}`)
        .then(response => {
            if (!response.ok) throw new Error("Student not found");
            return response.json();
        })
        .then(student => {
            document.getElementById("editStudentId").value = student.id;
            document.getElementById("editFirstName").value = student.firstName || "";
            document.getElementById("editSecondName").value = student.secondName || "";
            document.getElementById("editEmail").value = student.email || "";
            document.getElementById("editLevel").value = student.level || "";
            modal.classList.add("open");
            modal.setAttribute("aria-hidden", "false");
        })
        .catch(error => {
            alert(error.message || "Unable to load student details.");
        });
}

function closeEditModal() {
    const modal = document.getElementById("editStudentModal");
    const form = document.getElementById("editStudentForm");
    if (!modal || !form) return;

    form.reset();
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

async function displayStudents(attempt = 1) {
    const table = document.getElementById("studentTableBody");
    if (!table) return;
    if (attempt === 1) {
        table.innerHTML = '<tr><td colspan="5">Loading students. The server may take up to a minute to wake up.</td></tr>';
    }
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const students = await response.json();
        table.innerHTML = "";
        if (students.length === 0) {
            table.innerHTML = '<tr><td colspan="5">No students registered</td></tr>';
            return;
        }
        students.forEach((student, index) => {
            table.innerHTML += `<tr>
            <td>${index + 1}</td>
            <td>${escapeHTML(student.firstName)} ${escapeHTML(student.secondName)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>${escapeHTML(student.level)}</td>
            <td class="student-actions">
                <button type="button" class="action-btn edit-btn" onclick="openEditStudent(${student.id})">Edit</button>
                <button type="button" class="action-btn delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
            </tr>`;
        });
    } catch (e) {
        if (attempt < 4) {
            setTimeout(() => displayStudents(attempt + 1), 15000);
            return;
        }
        table.innerHTML = '<tr><td colspan="5">Unable to load students from the backend. Please refresh the page.</td></tr>';
    }
}

async function deleteStudent(id) {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to delete the student.");
    }
    displayStudents();
}

function setupBackToTop() {
    const button = document.getElementById("backTop");
    if (!button) return;
    window.addEventListener("scroll", () => button.classList.toggle("visible", window.scrollY > 500));
    button.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}
function setupYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
}
function escapeHTML(value) {
    const d = document.createElement("div");
    d.textContent = value ?? "";
    return d.innerHTML;
}
