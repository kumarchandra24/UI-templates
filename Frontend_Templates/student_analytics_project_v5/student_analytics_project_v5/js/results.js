// results.js - Student Results page with search and overview

document.addEventListener("DOMContentLoaded", () => {
  const studentList = document.getElementById("studentList");
  const searchInput = document.getElementById("searchInput");
  const filterType = document.getElementById("filterType");

  const rankMap = computeRankings();

  function renderTable(data) {
    studentList.innerHTML = "";
    if (!data.length) {
      studentList.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">No students found matching your search.</td>
        </tr>
      `;
      return;
    }

    data.forEach(student => {
      const avg = getStudentAverage(student);
      const rank = rankMap[student.id];

      const row = document.createElement("tr");
      row.style.cursor = "pointer";

      row.innerHTML = `
        <td>${student.id}</td>
        <td><a href="student.html?id=${student.id}" style="text-decoration:none;color:inherit;font-weight:700;">${student.name}</a></td>
        <td>${student.rollNo}</td>
        <td>${student.attendance}%</td>
        <td>${avg.toFixed(2)}%</td>
        <td><span class="rank-badge ${rank <= 3 ? "rank-" + rank : ""}">#${rank}</span></td>
      `;

      row.addEventListener("click", () => {
        window.location.href = `student.html?id=${student.id}`;
      });

      studentList.appendChild(row);
    });
  }

  function filterStudents() {
    const query = searchInput.value.trim().toLowerCase();
    const type = filterType.value;

    let filtered = STUDENTS_DATA;

    if (query) {
      filtered = filtered.filter(s => {
        if (type === "name") {
          return s.name.toLowerCase().includes(query);
        } else if (type === "roll") {
          return s.rollNo.toLowerCase().includes(query);
        } else if (type === "admission") {
          return s.admissionNo.toLowerCase().includes(query);
        }
        return false;
      });
    }

    renderTable(filtered);
  }

  searchInput.addEventListener("input", filterStudents);
  filterType.addEventListener("change", filterStudents);

  // Initial render
  renderTable(STUDENTS_DATA);
});
