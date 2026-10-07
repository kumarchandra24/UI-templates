// auth.js - Teacher auth + settings configuration (client-side demo)

// IMPORTANT: In a real app, never store credentials or config in client-side code.
// This is only for an exam/project demo.

const TEACHER_CREDENTIALS = {
  username: "teacher_admin",
  password: "Exam@2025"
};

function checkTeacherAuth(username, password) {
  return (
    username === TEACHER_CREDENTIALS.username &&
    password === TEACHER_CREDENTIALS.password
  );
}

function isTeacherLoggedIn() {
  return localStorage.getItem("teacherLoggedIn") === "true";
}

function loginTeacher(username, password) {
  if (checkTeacherAuth(username, password)) {
    localStorage.setItem("teacherLoggedIn", "true");
    return { success: true };
  }
  return { success: false, message: "Invalid username or password" };
}

function logoutTeacher() {
  localStorage.removeItem("teacherLoggedIn");
}

// Guard: redirect to login if not authenticated (for teacher-only pages)
function requireTeacherAuth() {
  if (!isTeacherLoggedIn()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Settings configuration (stored in localStorage for demo)
const DEFAULT_SETTINGS = {
  authMode: "password", // "password" | "admission_dob" | "roll_dob"
  publicAccess: false,  // if true, students can view results with admission/roll only
  allowDownload: true,  // allow PDF download of scorecards
  allowPrint: true      // allow direct print
};

function loadSettings() {
  const raw = localStorage.getItem("examSettings");
  if (!raw) {
    localStorage.setItem("examSettings", JSON.stringify(DEFAULT_SETTINGS));
    return { ...DEFAULT_SETTINGS };
  }
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  localStorage.setItem("examSettings", JSON.stringify(settings));
}

function validateStudentAccess(input1, input2, settings) {
  const student = window.findStudentByAdmissionOrRoll(input1);
  if (!student) {
    return { success: false, message: "No record found for this admission/roll number." };
  }
  if (settings.authMode === "admission_dob" || settings.authMode === "roll_dob") {
    if (!input2) {
      return { success: false, message: "Date of Birth is required." };
    }
    if (student.dob !== input2) {
      return { success: false, message: "Date of Birth does not match." };
    }
  }
  return { success: true, student };
}

window.TEACHER_CREDENTIALS = TEACHER_CREDENTIALS;
window.checkTeacherAuth = checkTeacherAuth;
window.isTeacherLoggedIn = isTeacherLoggedIn;
window.loginTeacher = loginTeacher;
window.logoutTeacher = logoutTeacher;
window.requireTeacherAuth = requireTeacherAuth;
window.loadSettings = loadSettings;
window.saveSettings = saveSettings;
window.validateStudentAccess = validateStudentAccess;
