document.addEventListener("DOMContentLoaded", function () {
    setupNavigation();
    setupStudentForm();
    displayStudents();
    setupBackToTop();
    setupYear();
});

function setupNavigation() {
    const hamburger = document.getElementById("navToggle");
    const navigation = document.getElementById("navShell");

    if (!hamburger || !navigation) {
        return;
    }

    hamburger.addEventListener("click", function () {
        navigation.classList.toggle("open");
    });
}

function getStudents() {
    const data = localStorage.getItem("iyungaStudents");

    if (!data) {
        return [];
    }

    try {
        const students = JSON.parse(data);

        return Array.isArray(students) ? students : [];
    } catch (error) {
        console.error("Unable to read student records:", error);
        return [];
    }
}

function saveStudents(students) {
    localStorage.setItem("iyungaStudents", JSON.stringify(students));
}

function setupStudentForm() {
    const form = document.getElementById("addForm");

    if (!form) {
        return;
    }

    const url = new URLSearchParams(window.location.search);
    const editID = url.get("edit");

    if (editID) {
        loadStudent(editID);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const student = {
            firstName: document.getElementById("first-name").value.trim(),
            secondName: document.getElementById("second-name").value.trim(),
            surname: document.getElementById("surname").value.trim(),
            level: document.getElementById("level").value,
            dateOfBirth: document.getElementById("date").value,
            birthPlace: document.getElementById("birth-place").value.trim(),
            nationality: document.getElementById("nationality").value.trim(),
            religion: document.getElementById("religion").value,
            region: document.getElementById("region").value.trim(),
            district: document.getElementById("district").value.trim(),
            ward: document.getElementById("ward").value.trim(),
            address: document.getElementById("address").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim()
        };

        const students = getStudents();

        if (editID) {
            const index = students.findIndex(function (item) {
                return String(item.id) === String(editID);
            });

            if (index !== -1) {
                student.id = students[index].id;
                students[index] = student;
                saveStudents(students);
                alert("Student updated successfully.");

                return;
            }
        }

        student.id = Date.now();

        students.push(student);
        saveStudents(students);

        alert("Student registered successfully.");
    });
}

function loadStudent(id) {
    const students = getStudents();
    const student = students.find(function (item) {
        return String(item.id) === String(id);
    });

    if (!student) {
        return;
    }

    document.getElementById("first-name").value = student.firstName || "";
    document.getElementById("second-name").value = student.secondName || "";
    document.getElementById("surname").value = student.surname || "";
    document.getElementById("level").value = student.level || "";
    document.getElementById("date").value = student.dateOfBirth || "";
    document.getElementById("birth-place").value = student.birthPlace || "";
    document.getElementById("nationality").value = student.nationality || "";
    document.getElementById("religion").value = student.religion || "";
    document.getElementById("region").value = student.region || "";
    document.getElementById("district").value = student.district || "";
    document.getElementById("ward").value = student.ward || "";
    document.getElementById("address").value = student.address || "";
    document.getElementById("phone").value = student.phone || "";
    document.getElementById("email").value = student.email || "";

    const button = document.getElementById("submitButton");

    if (button) {
        button.innerHTML = "Update Student <span>→</span>";
    }
}

function displayStudents() {
    const tableBody = document.getElementById("studentTableBody");

    if (!tableBody) {
        return;
    }

    const students = getStudents();

    tableBody.innerHTML = "";

    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">No students registered yet</td>
            </tr>
        `;

        return;
    }

    students.forEach(function (student, index) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                ${escapeHTML(student.firstName)}
                ${escapeHTML(student.secondName)}
                ${escapeHTML(student.surname)}
            </td>
            <td>${escapeHTML(student.level)}</td>
            <td>${escapeHTML(student.nationality)}</td>
            <td>${escapeHTML(student.phone)}</td>
            <td>
                <button
                    class="table-button edit"
                    type="button"
                    onclick="editStudent('${student.id}')">
                    Edit
                </button>

                <button
                    class="table-button delete"
                    type="button"
                    onclick="deleteStudent('${student.id}')">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function editStudent(id) {
    window.location.href = "add-students.html?edit=" + encodeURIComponent(id);
}

function deleteStudent(id) {
    const answer = confirm("Are you sure you want to delete this student?");

    if (!answer) {
        return;
    }

    let students = getStudents();

    students = students.filter(function (student) {
        return String(student.id) !== String(id);
    });

    saveStudents(students);

    displayStudents();
}

function setupBackToTop() {
    const button = document.getElementById("backTop");

    if (!button) {
        return;
    }

    window.addEventListener("scroll", function () {
        if (window.scrollY > 500) {
            button.classList.add("visible");
        } else {
            button.classList.remove("visible");
        }
    });

    button.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

function setupYear() {
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
}

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}
