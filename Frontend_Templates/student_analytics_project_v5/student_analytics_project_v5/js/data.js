// data.js - Student data and helper functions

const STUDENTS_DATA = [
  {
    id: 1,
    name: "Aarav Reddy",
    rollNo: "23CS001",
    admissionNo: "ADM2023001",
    dob: "2005-04-12",
    attendance: 92,
    exams: [
      { name: "Exam 1", marks: 78, maxMarks: 100 },
      { name: "Exam 2", marks: 81, maxMarks: 100 },
      { name: "Exam 3", marks: 75, maxMarks: 100 },
      { name: "Exam 4", marks: 84, maxMarks: 100 },
      { name: "Exam 5", marks: 80, maxMarks: 100 }
    ]
  },
  {
    id: 2,
    name: "Diya Sharma",
    rollNo: "23CS002",
    admissionNo: "ADM2023002",
    dob: "2005-07-22",
    attendance: 96,
    exams: [
      { name: "Exam 1", marks: 88, maxMarks: 100 },
      { name: "Exam 2", marks: 90, maxMarks: 100 },
      { name: "Exam 3", marks: 87, maxMarks: 100 },
      { name: "Exam 4", marks: 92, maxMarks: 100 },
      { name: "Exam 5", marks: 89, maxMarks: 100 }
    ]
  },
  {
    id: 3,
    name: "Ishaan Patel",
    rollNo: "23CS003",
    admissionNo: "ADM2023003",
    dob: "2005-02-09",
    attendance: 85,
    exams: [
      { name: "Exam 1", marks: 70, maxMarks: 100 },
      { name: "Exam 2", marks: 72, maxMarks: 100 },
      { name: "Exam 3", marks: 68, maxMarks: 100 },
      { name: "Exam 4", marks: 74, maxMarks: 100 },
      { name: "Exam 5", marks: 71, maxMarks: 100 }
    ]
  },
  {
    id: 4,
    name: "Meera Iyer",
    rollNo: "23CS004",
    admissionNo: "ADM2023004",
    dob: "2005-11-03",
    attendance: 94,
    exams: [
      { name: "Exam 1", marks: 85, maxMarks: 100 },
      { name: "Exam 2", marks: 86, maxMarks: 100 },
      { name: "Exam 3", marks: 84, maxMarks: 100 },
      { name: "Exam 4", marks: 88, maxMarks: 100 },
      { name: "Exam 5", marks: 87, maxMarks: 100 }
    ]
  },
  {
    id: 5,
    name: "Rohan Gupta",
    rollNo: "23CS005",
    admissionNo: "ADM2023005",
    dob: "2005-05-17",
    attendance: 78,
    exams: [
      { name: "Exam 1", marks: 62, maxMarks: 100 },
      { name: "Exam 2", marks: 65, maxMarks: 100 },
      { name: "Exam 3", marks: 60, maxMarks: 100 },
      { name: "Exam 4", marks: 67, maxMarks: 100 },
      { name: "Exam 5", marks: 64, maxMarks: 100 }
    ]
  },
  {
    id: 6,
    name: "Saanvi Kumar",
    rollNo: "23CS006",
    admissionNo: "ADM2023006",
    dob: "2005-08-30",
    attendance: 91,
    exams: [
      { name: "Exam 1", marks: 80, maxMarks: 100 },
      { name: "Exam 2", marks: 82, maxMarks: 100 },
      { name: "Exam 3", marks: 79, maxMarks: 100 },
      { name: "Exam 4", marks: 85, maxMarks: 100 },
      { name: "Exam 5", marks: 83, maxMarks: 100 }
    ]
  },
  {
    id: 7,
    name: "Arjun Nair",
    rollNo: "23CS007",
    admissionNo: "ADM2023007",
    dob: "2005-01-25",
    attendance: 88,
    exams: [
      { name: "Exam 1", marks: 74, maxMarks: 100 },
      { name: "Exam 2", marks: 76, maxMarks: 100 },
      { name: "Exam 3", marks: 73, maxMarks: 100 },
      { name: "Exam 4", marks: 78, maxMarks: 100 },
      { name: "Exam 5", marks: 75, maxMarks: 100 }
    ]
  },
  {
    id: 8,
    name: "Kavya Menon",
    rollNo: "23CS008",
    admissionNo: "ADM2023008",
    dob: "2005-10-14",
    attendance: 97,
    exams: [
      { name: "Exam 1", marks: 91, maxMarks: 100 },
      { name: "Exam 2", marks: 93, maxMarks: 100 },
      { name: "Exam 3", marks: 90, maxMarks: 100 },
      { name: "Exam 4", marks: 95, maxMarks: 100 },
      { name: "Exam 5", marks: 92, maxMarks: 100 }
    ]
  },
  {
    id: 9,
    name: "Vikram Singh",
    rollNo: "23CS009",
    admissionNo: "ADM2023009",
    dob: "2005-03-07",
    attendance: 82,
    exams: [
      { name: "Exam 1", marks: 66, maxMarks: 100 },
      { name: "Exam 2", marks: 68, maxMarks: 100 },
      { name: "Exam 3", marks: 65, maxMarks: 100 },
      { name: "Exam 4", marks: 70, maxMarks: 100 },
      { name: "Exam 5", marks: 67, maxMarks: 100 }
    ]
  },
  {
    id: 10,
    name: "Ananya Das",
    rollNo: "23CS010",
    admissionNo: "ADM2023010",
    dob: "2005-06-19",
    attendance: 93,
    exams: [
      { name: "Exam 1", marks: 83, maxMarks: 100 },
      { name: "Exam 2", marks: 85, maxMarks: 100 },
      { name: "Exam 3", marks: 82, maxMarks: 100 },
      { name: "Exam 4", marks: 87, maxMarks: 100 },
      { name: "Exam 5", marks: 84, maxMarks: 100 }
    ]
  },
  {
    id: 11,
    name: "Karan Joshi",
    rollNo: "23CS011",
    admissionNo: "ADM2023011",
    dob: "2005-12-01",
    attendance: 76,
    exams: [
      { name: "Exam 1", marks: 58, maxMarks: 100 },
      { name: "Exam 2", marks: 61, maxMarks: 100 },
      { name: "Exam 3", marks: 57, maxMarks: 100 },
      { name: "Exam 4", marks: 63, maxMarks: 100 },
      { name: "Exam 5", marks: 60, maxMarks: 100 }
    ]
  },
  {
    id: 12,
    name: "Pooja Rao",
    rollNo: "23CS012",
    admissionNo: "ADM2023012",
    dob: "2005-09-11",
    attendance: 90,
    exams: [
      { name: "Exam 1", marks: 77, maxMarks: 100 },
      { name: "Exam 2", marks: 79, maxMarks: 100 },
      { name: "Exam 3", marks: 76, maxMarks: 100 },
      { name: "Exam 4", marks: 81, maxMarks: 100 },
      { name: "Exam 5", marks: 78, maxMarks: 100 }
    ]
  },
  {
    id: 13,
    name: "Rahul Verma",
    rollNo: "23CS013",
    admissionNo: "ADM2023013",
    dob: "2005-04-28",
    attendance: 84,
    exams: [
      { name: "Exam 1", marks: 69, maxMarks: 100 },
      { name: "Exam 2", marks: 71, maxMarks: 100 },
      { name: "Exam 3", marks: 68, maxMarks: 100 },
      { name: "Exam 4", marks: 73, maxMarks: 100 },
      { name: "Exam 5", marks: 70, maxMarks: 100 }
    ]
  },
  {
    id: 14,
    name: "Sneha Kapoor",
    rollNo: "23CS014",
    admissionNo: "ADM2023014",
    dob: "2005-07-05",
    attendance: 95,
    exams: [
      { name: "Exam 1", marks: 86, maxMarks: 100 },
      { name: "Exam 2", marks: 88, maxMarks: 100 },
      { name: "Exam 3", marks: 85, maxMarks: 100 },
      { name: "Exam 4", marks: 90, maxMarks: 100 },
      { name: "Exam 5", marks: 87, maxMarks: 100 }
    ]
  },
  {
    id: 15,
    name: "Aditya Bose",
    rollNo: "23CS015",
    admissionNo: "ADM2023015",
    dob: "2005-02-16",
    attendance: 80,
    exams: [
      { name: "Exam 1", marks: 64, maxMarks: 100 },
      { name: "Exam 2", marks: 66, maxMarks: 100 },
      { name: "Exam 3", marks: 63, maxMarks: 100 },
      { name: "Exam 4", marks: 68, maxMarks: 100 },
      { name: "Exam 5", marks: 65, maxMarks: 100 }
    ]
  }
];

// Helper: compute average percentage for a student
function getStudentAverage(student) {
  const totalMarks = student.exams.reduce((sum, e) => sum + e.marks, 0);
  const maxTotal = student.exams.reduce((sum, e) => sum + e.maxMarks, 0);
  return (totalMarks / maxTotal) * 100;
}

// Helper: compute rank for each student based on average
function computeRankings() {
  const withAvg = STUDENTS_DATA.map(s => ({
    id: s.id,
    name: s.name,
    avg: getStudentAverage(s)
  }));
  withAvg.sort((a, b) => b.avg - a.avg);
  const rankMap = {};
  withAvg.forEach((s, idx) => {
    rankMap[s.id] = idx + 1;
  });
  return rankMap;
}

// Helper: get sorted students by average (for ranking table)
function getStudentsSortedByAverage() {
  const withAvg = STUDENTS_DATA.map(s => ({
    ...s,
    avg: getStudentAverage(s)
  }));
  withAvg.sort((a, b) => b.avg - a.avg);
  withAvg.forEach((s, idx) => {
    s.rank = idx + 1;
  });
  return withAvg;
}

// Helper: find student by admission or roll
function findStudentByAdmissionOrRoll(key) {
  key = key.trim().toUpperCase();
  return STUDENTS_DATA.find(
    s =>
      s.admissionNo.toUpperCase() === key ||
      s.rollNo.toUpperCase() === key
  );
}

// Expose to window for other scripts
window.STUDENTS_DATA = STUDENTS_DATA;
window.getStudentAverage = getStudentAverage;
window.computeRankings = computeRankings;
window.getStudentsSortedByAverage = getStudentsSortedByAverage;
window.findStudentByAdmissionOrRoll = findStudentByAdmissionOrRoll;
