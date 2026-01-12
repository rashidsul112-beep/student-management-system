const role = document.getElementById("role").value;
localStorage.setItem("userRole", role);

if (window.location.pathname.includes("index.html")) {
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "login.html";
    }
}
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}

let editIndex = null;

let table = document.getElementById("studentTable");

function addStudent() {
    let name = document.getElementById("name").value.trim();
    let regNo = document.getElementById("regNo").value.trim();
    let course = document.getElementById("course").value.trim();

    if (name === "" || regNo === "" || course === "") {
        alert("Fill your data");
        return;
    }

    let students = JSON.parse(localStorage.getItem("students")) || [];

    if (editIndex === null) {
        // ADD NEW
        students.push({ name, regNo, course });
    } else {
        // UPDATE
        students[editIndex] = { name, regNo, course };
        editIndex = null;
    }

    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
    clearForm();
    document.getElementById("submitBtn").innerText = "Add Student";

}


function displayStudents() {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    table.innerHTML = "";

    students.forEach((student, index) => {
        let row = `
          <tr>
            <td>${student.name}</td>
            <td>${student.regNo}</td>
            <td>${student.course}</td>
            <td>
              <button onclick="editStudent(${index})">Edit</button>
              <button onclick="deleteStudent(${index})">Delete</button>
            </td>
          </tr>
        `;
        table.innerHTML += row;
    });
      updateDashboard();
}
function editStudent(index) {
    let students = JSON.parse(localStorage.getItem("students"));

    document.getElementById("name").value = students[index].name;
    document.getElementById("regNo").value = students[index].regNo;
    document.getElementById("course").value = students[index].course;
document.getElementById("submitBtn").innerText = "Update Student";

    editIndex = index;
}


function deleteStudent(index) {
    let students = JSON.parse(localStorage.getItem("students"));
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("regNo").value = "";
    document.getElementById("course").value = "";
}

displayStudents();
function searchStudent() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let students = JSON.parse(localStorage.getItem("students")) || [];
    table.innerHTML = "";

    students.forEach((student, index) => {
        if (
            student.name.toLowerCase().includes(searchValue) ||
            student.regNo.toLowerCase().includes(searchValue) ||
            student.course.toLowerCase().includes(searchValue)
        ) {
            let row = `
              <tr>
                <td>${student.name}</td>
                <td>${student.regNo}</td>
                <td>${student.course}</td>
                <td><button onclick="deleteStudent(${index})">Delete</button></td>
              </tr>
            `;
            table.innerHTML += row;
        }
    });
}
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
const role = document.getElementById("role").value;
localStorage.setItem("userRole", role);

    // Simple credentials (for now)
    if (username === "Rashid" && password === "6810") {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html";
    } else {
        document.getElementById("errorMsg").innerText = "Invalid login details";
    }
}
function updateDashboard() {
    let students = JSON.parse(localStorage.getItem("students")) || [];

    // Total students
    document.getElementById("totalStudents").innerText = students.length;

    // Unique courses
    let courses = students.map(s => s.course.toLowerCase());
    let uniqueCourses = [...new Set(courses)];
    document.getElementById("totalCourses").innerText = uniqueCourses.length;
    updateCourseReport(); 
}

function updateCourseReport() {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    let courseCount = {};

    students.forEach(student => {
        let course = student.course;
        courseCount[course] = (courseCount[course] || 0) + 1;
    });

    let courseList = document.getElementById("courseList");
    courseList.innerHTML = "";

    for (let course in courseCount) {
        let li = document.createElement("li");
        li.innerHTML = `
          <span>${course}</span>
          <span>${courseCount[course]}</span>
        `;
        courseList.appendChild(li);
    }
}
function exportCSV() {
    let students = JSON.parse(localStorage.getItem("students")) || [];

    if (students.length === 0) {
        alert("No data to-export");
        return;
    }

    let csv = "Name,Registration Number,Course\n";

    students.forEach(student => {
        csv += `${student.name},${student.regNo},${student.course}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();

    URL.revokeObjectURL(url);
}

const modeBtn = document.getElementById("modeBtn");

// Apply saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  modeBtn.innerText = "Light Mode";
}

// Toggle theme
modeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    modeBtn.innerText = "Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    modeBtn.innerText = "Dark Mode";
  }
});
function importCSV() {
   // logic ya import
}


