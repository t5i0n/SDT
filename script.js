let courses = JSON.parse(localStorage.getItem("courses")) || [];
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
let currentFilter = "all";

function save() {
    localStorage.setItem("courses", JSON.stringify(courses));
    localStorage.setItem("assignments", JSON.stringify(assignments));
}

function addCourse() {
    const name = document.getElementById("courseName").value;
    if (!name) return;

    courses.push({ id: Date.now(), name });
    save();
    renderCourses();
}

function addAssignment() {
    const title = document.getElementById("title").value;
    const courseId = document.getElementById("courseSelect").value;
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;

    if (!title || !deadline) return;

    assignments.push({
        id: Date.now(),
        title,
        courseId,
        deadline,
        priority
    });

    save();
    renderAssignments();
}

function renderCourses() {
    const select = document.getElementById("courseSelect");
    select.innerHTML = "";

    courses.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name;
        select.appendChild(option);
    });
}

function getDaysLeft(date) {
    const today = new Date();
    const due = new Date(date);
    const diff = due - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function filterAssignments(list) {
    const today = new Date();

    if (currentFilter === "today") {
        return list.filter(a => getDaysLeft(a.deadline) === 0);
    }

    if (currentFilter === "week") {
        return list.filter(a => {
            const d = getDaysLeft(a.deadline);
            return d >= 0 && d <= 7;
        });
    }

    return list;
}

function renderAssignments() {
    const list = document.getElementById("assignmentList");
    list.innerHTML = "";

    let filtered = filterAssignments(assignments);

    filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    filtered.forEach(a => {
        const li = document.createElement("li");
        li.className = a.priority;

        const course = courses.find(c => c.id == a.courseId);
        const days = getDaysLeft(a.deadline);

        let text = `${a.title} (${course ? course.name : "No course"})`;

        if (days === 0) text += " - Due Today ⚠️";
        else if (days > 0) text += ` - ${days} days left`;
        else text += " - Overdue ❌";

        li.textContent = text;
        list.appendChild(li);
    });
}

function setFilter(filter) {
    currentFilter = filter;
    renderAssignments();
}

document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

renderCourses();
renderAssignments();