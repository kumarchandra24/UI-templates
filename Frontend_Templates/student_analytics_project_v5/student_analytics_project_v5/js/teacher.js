// teacher.js - Teacher Dashboard with full analytics (protected)

document.addEventListener("DOMContentLoaded", () => {
  // Guard: redirect if not logged in
  if (!requireTeacherAuth()) {
    return;
  }

  const sortedStudents = getStudentsSortedByAverage();
  const totalStudents = STUDENTS_DATA.length;

  // KPIs
  const avgAttendance =
    STUDENTS_DATA.reduce((sum, s) => sum + s.attendance, 0) / totalStudents;
  const overallAvg =
    STUDENTS_DATA.reduce((sum, s) => sum + getStudentAverage(s), 0) / totalStudents;

  const topAvg = sortedStudents[0].avg;
  const lowestAvg = sortedStudents[sortedStudents.length - 1].avg;

  document.getElementById("kpiTotal").textContent = totalStudents;
  document.getElementById("kpiAvgAtt").textContent = avgAttendance.toFixed(2) + "%";
  document.getElementById("kpiOverallAvg").textContent = overallAvg.toFixed(2) + "%";
  document.getElementById("kpiTopAvg").textContent = topAvg.toFixed(2) + "%";
  document.getElementById("kpiLowAvg").textContent = lowestAvg.toFixed(2) + "%";

  // Ranking table
  const rankingBody = document.getElementById("rankingTableBody");
  sortedStudents.forEach(s => {
    const row = document.createElement("tr");
    const rankClass = s.rank <= 3 ? `rank-${s.rank}` : "";
    row.innerHTML = `
      <td><span class="rank-badge ${rankClass}">${s.rank}</span></td>
      <td style="font-weight:700;">${s.name}</td>
      <td>${s.attendance}%</td>
      <td style="font-weight:800;color:#60a5fa;">${s.avg.toFixed(2)}%</td>
    `;
    rankingBody.appendChild(row);
  });

  // Chart: Average % per student (bar, horizontal)
  const labels = sortedStudents.map(s => s.name);
  const avgData = sortedStudents.map(s => s.avg);

  const ctx1 = document.getElementById("studentAvgChart").getContext("2d");
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Average %",
        data: avgData,
        backgroundColor: "rgba(79,70,229,0.85)",
        borderColor: "#4f46e5",
        borderWidth: 1,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });

  // Chart: Attendance vs Average (bubble)
  const attData = sortedStudents.map(s => ({
    x: s.attendance,
    y: s.avg,
    r: 6,
    name: s.name
  }));

  const ctx2 = document.getElementById("attVsAvgChart").getContext("2d");
  new Chart(ctx2, {
    type: "bubble",
    data: {
      datasets: [{
        label: "Attendance vs Average",
        data: attData,
        backgroundColor: "rgba(16,185,129,0.8)",
        borderColor: "#10b981"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const pt = attData[ctx.dataIndex];
              return `${pt.name}: Att ${pt.x}%, Avg ${pt.y.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: "Attendance (%)" },
          min: 0,
          max: 100,
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          title: { display: true, text: "Average (%)" },
          min: 0,
          max: 100,
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    }
  });

  // Chart: Exam-wise class average (line)
  const examNames = STUDENTS_DATA[0].exams.map(e => e.name);
  const examAverages = examNames.map((name, i) => {
    const sum = STUDENTS_DATA.reduce((acc, s) => acc + s.exams[i].marks, 0);
    return sum / totalStudents;
  });

  const ctx3 = document.getElementById("examTrendChart").getContext("2d");
  new Chart(ctx3, {
    type: "line",
    data: {
      labels: examNames,
      datasets: [{
        label: "Class Average Marks",
        data: examAverages,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.18)",
        fill: true,
        tension: 0.35,
        pointRadius: 6,
        pointHoverRadius: 8
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
