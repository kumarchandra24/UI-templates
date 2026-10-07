// analytics.js - Analytics dashboard with per-exam and all-exam graphs

document.addEventListener("DOMContentLoaded", () => {
  const rankMap = computeRankings();

  // KPI cards
  const totalStudents = STUDENTS_DATA.length;
  const avgAttendance =
    STUDENTS_DATA.reduce((sum, s) => sum + s.attendance, 0) / totalStudents;
  const overallAvg =
    STUDENTS_DATA.reduce((sum, s) => sum + getStudentAverage(s), 0) / totalStudents;

  document.getElementById("kpiTotalStudents").textContent = totalStudents;
  document.getElementById("kpiAvgAttendance").textContent = avgAttendance.toFixed(2) + "%";
  document.getElementById("kpiOverallAvg").textContent = overallAvg.toFixed(2) + "%";

  // Top 5 students
  const sorted = [...STUDENTS_DATA].sort(
    (a, b) => getStudentAverage(b) - getStudentAverage(a)
  );
  const top5 = sorted.slice(0, 5);

  const top5List = document.getElementById("top5List");
  top5.forEach((s, idx) => {
    const avg = getStudentAverage(s);
    const li = document.createElement("li");
    li.style.padding = "11px 0";
    li.style.borderBottom = "1px solid #374151";
    li.innerHTML = `
      <strong>#${idx + 1}</strong> ${s.name} – <span class="text-primary" style="color:#60a5fa;font-weight:800;">${avg.toFixed(2)}%</span>
    `;
    top5List.appendChild(li);
  });

  // All exams combined average (class-wide)
  const examNames = STUDENTS_DATA[0].exams.map(e => e.name);
  const examAverages = examNames.map((name, i) => {
    const sum = STUDENTS_DATA.reduce((acc, s) => acc + s.exams[i].marks, 0);
    return sum / totalStudents;
  });

  const ctxAll = document.getElementById("allExamsChart").getContext("2d");
  new Chart(ctxAll, {
    type: "bar",
    data: {
      labels: examNames,
      datasets: [{
        label: "Class Average Marks (All Exams)",
        data: examAverages,
        backgroundColor: "rgba(79,70,229,0.85)",
        borderColor: "#4f46e5",
        borderWidth: 1,
        borderRadius: 8
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

  // Per-exam charts: create 5 small charts
  const examContainers = [
    { id: "exam1Chart", examIndex: 0, title: "Exam 1 – Class Performance" },
    { id: "exam2Chart", examIndex: 1, title: "Exam 2 – Class Performance" },
    { id: "exam3Chart", examIndex: 2, title: "Exam 3 – Class Performance" },
    { id: "exam4Chart", examIndex: 3, title: "Exam 4 – Class Performance" },
    { id: "exam5Chart", examIndex: 4, title: "Exam 5 – Class Performance" }
  ];

  examContainers.forEach(({ id, examIndex, title }) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const labels = STUDENTS_DATA.map(s => s.name);
    const data = STUDENTS_DATA.map(s => s.exams[examIndex].marks);

    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: title,
          data,
          backgroundColor: "rgba(16,185,129,0.85)",
          borderColor: "#10b981",
          borderWidth: 1,
          borderRadius: 8
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

  // Distribution of averages (doughnut)
  const buckets = {
    "90–100": 0,
    "80–89": 0,
    "70–79": 0,
    "60–69": 0,
    "Below 60": 0
  };

  STUDENTS_DATA.forEach(s => {
    const avg = getStudentAverage(s);
    if (avg >= 90) buckets["90–100"]++;
    else if (avg >= 80) buckets["80–89"]++;
    else if (avg >= 70) buckets["70–79"]++;
    else if (avg >= 60) buckets["60–69"]++;
    else buckets["Below 60"]++;
  });

  const ctxDist = document.getElementById("distributionChart").getContext("2d");
  new Chart(ctxDist, {
    type: "doughnut",
    data: {
      labels: Object.keys(buckets),
      datasets: [{
        data: Object.values(buckets),
        backgroundColor: [
          "#10b981",
          "#34d399",
          "#f59e0b",
          "#f97316",
          "#ef4444"
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
});
