const API_URL = "http://localhost:8080/api/students";

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupStudentForm();
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

async function displayStudents() {
    const table = document.getElementById("studentTableBody");
    if (!table) return;
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
            <td><button type="button" onclick="deleteStudent(${student.id})">Delete</button></td>
            </tr>`;
        });
    } catch (e) {
        console.error("Backend unavailable", e);
        table.innerHTML = '<tr><td colspan="5">Unable to load students from the backend.</td></tr>';
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
