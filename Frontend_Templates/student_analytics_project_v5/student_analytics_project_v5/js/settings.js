// settings.js - Settings page (teacher-only) with advanced options

document.addEventListener("DOMContentLoaded", () => {
  // Guard: redirect if not logged in
  if (!requireTeacherAuth()) {
    return;
  }

  const loginSection = document.getElementById("loginSection");
  const settingsSection = document.getElementById("settingsSection");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const studentTableBody = document.getElementById("studentTableBody");
  const addStudentForm = document.getElementById("addStudentForm");

  // Settings toggles
  const authModeSelect = document.getElementById("authMode");
  const publicAccessToggle = document.getElementById("publicAccessToggle");
  const allowDownloadToggle = document.getElementById("allowDownloadToggle");
  const allowPrintToggle = document.getElementById("allowPrintToggle");
  const saveSettingsBtn = document.getElementById("saveSettingsBtn");

  let currentSettings = loadSettings();

  function applySettingsToUI() {
    authModeSelect.value = currentSettings.authMode;
    if (currentSettings.publicAccess) {
      publicAccessToggle.classList.add("active");
    } else {
      publicAccessToggle.classList.remove("active");
    }
    if (currentSettings.allowDownload) {
      allowDownloadToggle.classList.add("active");
    } else {
      allowDownloadToggle.classList.remove("active");
    }
    if (currentSettings.allowPrint) {
      allowPrintToggle.classList.add("active");
    } else {
      allowPrintToggle.classList.remove("active");
    }
  }

  function renderStudentTable() {
    studentTableBody.innerHTML = "";
    STUDENTS_DATA.forEach(s => {
      const avg = getStudentAverage(s);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.rollNo}</td>
        <td>${s.admissionNo}</td>
        <td>${s.attendance}%</td>
        <td>${avg.toFixed(2)}%</td>
        <td>
          <button class="btn btn-danger btn-sm" data-id="${s.id}">Remove</button>
        </td>
      `;
      studentTableBody.appendChild(row);
    });

    document.querySelectorAll("#studentTableBody .btn-danger").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id, 10);
        const idx = STUDENTS_DATA.findIndex(s => s.id === id);
        if (idx !== -1 && confirm("Are you sure you want to remove this student?")) {
          STUDENTS_DATA.splice(idx, 1);
          STUDENTS_DATA.forEach((s, i) => (s.id = i + 1));
          renderStudentTable();
        }
      });
    });
  }

  // Already logged in, so hide login section
  loginSection.style.display = "none";
  settingsSection.style.display = "block";
  renderStudentTable();
  applySettingsToUI();

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const result = loginTeacher(username, password);
    if (result.success) {
      loginSection.style.display = "none";
      settingsSection.style.display = "block";
      renderStudentTable();
      applySettingsToUI();
    } else {
      alert(result.message);
    }
  });

  logoutBtn.addEventListener("click", () => {
    logoutTeacher();
    // Redirect to login page after logout
    window.location.href = "login.html";
  });

  // Toggle handlers
  publicAccessToggle.addEventListener("click", () => {
    publicAccessToggle.classList.toggle("active");
    currentSettings.publicAccess = publicAccessToggle.classList.contains("active");
  });

  allowDownloadToggle.addEventListener("click", () => {
    allowDownloadToggle.classList.toggle("active");
    currentSettings.allowDownload = allowDownloadToggle.classList.contains("active");
  });

  allowPrintToggle.addEventListener("click", () => {
    allowPrintToggle.classList.toggle("active");
    currentSettings.allowPrint = allowPrintToggle.classList.contains("active");
  });

  saveSettingsBtn.addEventListener("click", () => {
    currentSettings.authMode = authModeSelect.value;
    saveSettings(currentSettings);
    alert("Settings saved successfully!");
  });

  addStudentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("newName").value.trim();
    const rollNo = document.getElementById("newRoll").value.trim();
    const admissionNo = document.getElementById("newAdmission").value.trim();
    const dob = document.getElementById("newDob").value.trim();
    const attendance = parseInt(document.getElementById("newAttendance").value, 10);
    const baseMarks = parseInt(document.getElementById("newBaseMarks").value, 10);

    if (!name || !rollNo || !admissionNo || !dob ||
        attendance < 0 || attendance > 100 || baseMarks < 0 || baseMarks > 100) {
      alert("Please enter valid details.");
      return;
    }

    const newId = STUDENTS_DATA.length ? Math.max(...STUDENTS_DATA.map(s => s.id)) + 1 : 1;

    const newStudent = {
      id: newId,
      name,
      rollNo,
      admissionNo,
      dob,
      attendance,
      exams: [
        { name: "Exam 1", marks: baseMarks, maxMarks: 100 },
        { name: "Exam 2", marks: baseMarks + 2, maxMarks: 100 },
        { name: "Exam 3", marks: baseMarks - 1, maxMarks: 100 },
        { name: "Exam 4", marks: baseMarks + 3, maxMarks: 100 },
        { name: "Exam 5", marks: baseMarks + 1, maxMarks: 100 }
      ]
    };

    STUDENTS_DATA.push(newStudent);
    renderStudentTable();
    addStudentForm.reset();
    alert("Student added successfully!");
  });
});
