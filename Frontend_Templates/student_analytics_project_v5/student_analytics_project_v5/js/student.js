// student.js - Student detail page

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

document.addEventListener("DOMContentLoaded", () => {
  const id = parseInt(getQueryParam("id"), 10);
  const student = STUDENTS_DATA.find(s => s.id === id);

  if (!student) {
    document.getElementById("studentContent").innerHTML = `
      <div class="card">
        <h2>Student Not Found</h2>
        <p>No student found with this ID.</p>
        <a href="results.html" class="btn">Back to Results</a>
      </div>
    `;
    return;
  }

  const avg = getStudentAverage(student);
  const rankMap = computeRankings();
  const rank = rankMap[student.id];

  // Basic info
  document.getElementById("studentName").textContent = student.name;
  document.getElementById("studentRoll").textContent = student.rollNo;
  document.getElementById("studentAdmission").textContent = student.admissionNo;
  document.getElementById("studentAttendance").textContent = student.attendance + "%";
  document.getElementById("studentAverage").textContent = avg.toFixed(2) + "%";
  document.getElementById("studentRank").textContent = "#" + rank;

  // Status
  const statusEl = document.getElementById("studentStatus");
  if (avg >= 85) {
    statusEl.textContent = "Excellent";
    statusEl.className = "value text-success";
  } else if (avg >= 70) {
    statusEl.textContent = "Good";
    statusEl.className = "value text-success";
  } else if (avg >= 50) {
    statusEl.textContent = "Average";
    statusEl.className = "value text-warning";
  } else {
    statusEl.textContent = "Needs Improvement";
    statusEl.className = "value text-danger";
  }

  // Exam table
  const examTableBody = document.getElementById("examTableBody");
  student.exams.forEach(exam => {
    const percentage = (exam.marks / exam.maxMarks) * 100;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exam.name}</td>
      <td>${exam.marks} / ${exam.maxMarks}</td>
      <td>${percentage.toFixed(2)}%</td>
    `;
    examTableBody.appendChild(row);
  });

  // Chart: Progress over 5 exams
  const ctx = document.getElementById("progressChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: student.exams.map(e => e.name),
      datasets: [{
        label: "Marks",
        data: student.exams.map(e => e.marks),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.18)",
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
});
