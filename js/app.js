// ==================== DOM Elements ====================
const greetingEl = document.getElementById("greeting");
const userNameEl = document.getElementById("userName");
const currentTimeEl = document.getElementById("currentTime");
const currentDateEl = document.getElementById("currentDate");
const editNameBtn = document.getElementById("editNameBtn");
const themeToggle = document.getElementById("themeToggle");

// Timer Elements
const timerMinutesEl = document.getElementById("timerMinutes");
const timerSecondsEl = document.getElementById("timerSeconds");
const startTimerBtn = document.getElementById("startTimer");
const stopTimerBtn = document.getElementById("stopTimer");
const resetTimerBtn = document.getElementById("resetTimer");

// Todo Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskListEl = document.getElementById("taskList");
const duplicateWarning = document.getElementById("duplicateWarning");

// Quick Links Elements
const linkNameInput = document.getElementById("linkName");
const linkUrlInput = document.getElementById("linkUrl");
const addLinkBtn = document.getElementById("addLink");
const linksListEl = document.getElementById("linksList");

// Modal Elements
const nameModal = document.getElementById("nameModal");
const nameInput = document.getElementById("nameInput");
const saveNameBtn = document.getElementById("saveName");
const closeModalBtn = document.getElementById("closeModal");

// ==================== State Variables ====================
let timerInterval = null;
let timerSeconds = 25 * 60; // 25 minutes in seconds
let isTimerRunning = false;

// ==================== Local Storage Keys ====================
const STORAGE_KEYS = {
  TASKS: "dashboard_tasks",
  LINKS: "dashboard_links",
  NAME: "dashboard_name",
  THEME: "dashboard_theme",
};

// ==================== Initialize App ====================
function initApp() {
  updateTimeAndDate();
  setInterval(updateTimeAndDate, 1000);

  loadUserName();
  loadTheme();
  loadTasks();
  loadLinks();

  setupEventListeners();
}

// ==================== Time and Date Functions ====================
function updateTimeAndDate() {
  const now = new Date();

  // Update time
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  currentTimeEl.textContent = `${hours}:${minutes}:${seconds}`;

  // Update date
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  currentDateEl.textContent = now.toLocaleDateString("en-US", options);

  // Update greeting
  updateGreeting(now.getHours());
}

function updateGreeting(hours) {
  const name = localStorage.getItem(STORAGE_KEYS.NAME) || "";

  if (hours >= 5 && hours < 12) {
    greetingEl.textContent = "Good Morning";
  } else if (hours >= 12 && hours < 17) {
    greetingEl.textContent = "Good Afternoon";
  } else if (hours >= 17 && hours < 21) {
    greetingEl.textContent = "Good Evening";
  } else {
    greetingEl.textContent = "Good Night";
  }

  userNameEl.textContent = name ? name : "";
}

// ==================== User Name Functions ====================
function loadUserName() {
  const name = localStorage.getItem(STORAGE_KEYS.NAME);
  if (name) {
    userNameEl.textContent = name;
  }
}

function saveUserName(name) {
  localStorage.setItem(STORAGE_KEYS.NAME, name);
  userNameEl.textContent = name;
  updateGreeting(new Date().getHours());
}

// ==================== Theme Functions ====================
function loadTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  if (currentTheme === "dark") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem(STORAGE_KEYS.THEME, "light");
    themeToggle.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem(STORAGE_KEYS.THEME, "dark");
    themeToggle.textContent = "☀️";
  }
}

// ==================== Timer Functions ====================
function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  timerMinutesEl.textContent = String(minutes).padStart(2, "0");
  timerSecondsEl.textContent = String(seconds).padStart(2, "0");
}

function startTimer() {
  if (isTimerRunning) return;

  isTimerRunning = true;
  startTimerBtn.disabled = true;
  startTimerBtn.style.opacity = "0.5";

  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      stopTimer();
      alert("⏰ Time is up! Take a break!");
      resetTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  startTimerBtn.disabled = false;
  startTimerBtn.style.opacity = "1";
}

function resetTimer() {
  stopTimer();
  timerSeconds = 25 * 60;
  updateTimerDisplay();
}

// ==================== To-Do List Functions ====================
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
  tasks.forEach((task) => renderTask(task));
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
}

function checkDuplicate(taskText) {
  const tasks = getTasks();
  const normalizedNew = taskText.toLowerCase().trim();

  return tasks.some((task) => task.text.toLowerCase().trim() === normalizedNew);
}

function showDuplicateWarning() {
  duplicateWarning.style.display = "block";
  setTimeout(() => {
    duplicateWarning.style.display = "none";
  }, 3000);
}

function addTask() {
  const taskText = taskInput.value.trim();

  if (!taskText) {
    alert("⚠️ Please enter a task before adding");
    taskInput.focus();
    return;
  }

  // Check for duplicate
  if (checkDuplicate(taskText)) {
    showDuplicateWarning();
    taskInput.value = "";
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  renderTask(task);
  taskInput.value = "";
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = `task-item ${task.completed ? "completed" : ""}`;
  li.dataset.id = task.id;

  li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
        <span class="task-text">${escapeHtml(task.text)}</span>
        <div class="task-actions">
            <button class="task-btn edit-btn">Edit</button>
            <button class="task-btn delete-btn">Delete</button>
        </div>
    `;

  taskListEl.appendChild(li);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function toggleTask(id) {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);

  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);

    const taskEl = document.querySelector(`.task-item[data-id="${id}"]`);
    if (taskEl) {
      taskEl.classList.toggle("completed");
      taskEl.querySelector(".task-checkbox").checked = task.completed;
    }
  }
}

function deleteTask(id) {
  const tasks = getTasks();
  const filteredTasks = tasks.filter((t) => t.id !== id);
  saveTasks(filteredTasks);

  const taskEl = document.querySelector(`.task-item[data-id="${id}"]`);
  if (taskEl) {
    taskEl.remove();
  }
}

function editTask(id) {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);

  if (task) {
    const newText = prompt("Edit task:", task.text);

    if (newText !== null && newText.trim() !== "") {
      // Check for duplicate (excluding current task)
      const normalizedNew = newText.toLowerCase().trim();
      const isDuplicate = tasks.some((t) => t.id !== id && t.text.toLowerCase().trim() === normalizedNew);

      if (isDuplicate) {
        alert("⚠️ A task with this name already exists!");
        return;
      }

      task.text = newText.trim();
      saveTasks(tasks);

      const taskEl = document.querySelector(`.task-item[data-id="${id}"]`);
      if (taskEl) {
        taskEl.querySelector(".task-text").textContent = task.text;
      }
    }
  }
}

// ==================== Quick Links Functions ====================
function loadLinks() {
  const links = JSON.parse(localStorage.getItem(STORAGE_KEYS.LINKS)) || [];

  // Add default links if empty
  if (links.length === 0) {
    const defaultLinks = [
      { id: 1, name: "Google", url: "https://www.google.com", icon: "🔍" },
      { id: 2, name: "YouTube", url: "https://www.youtube.com", icon: "📺" },
      { id: 3, name: "GitHub", url: "https://www.github.com", icon: "💻" },
    ];
    saveLinks(defaultLinks);
    defaultLinks.forEach((link) => renderLink(link));
  } else {
    links.forEach((link) => renderLink(link));
  }
}

function saveLinks(links) {
  localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
}

function getLinks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.LINKS)) || [];
}

function addLink() {
  const name = linkNameInput.value.trim();
  let url = linkUrlInput.value.trim();

  if (!name || !url) {
    alert("⚠️ Please fill in both name and URL");
    return;
  }

  // Add protocol if missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const link = {
    id: Date.now(),
    name: name,
    url: url,
    icon: getLinkIcon(url),
  };

  const links = getLinks();
  links.push(link);
  saveLinks(links);

  renderLink(link);

  linkNameInput.value = "";
  linkUrlInput.value = "";
}

function getLinkIcon(url) {
  const icons = {
    google: "🔍",
    youtube: "📺",
    github: "💻",
    facebook: "📘",
    twitter: "🐦",
    instagram: "📷",
    linkedin: "💼",
    reddit: "🔴",
    netflix: "🎬",
    spotify: "🎵",
    amazon: "📦",
    stackoverflow: "❓",
  };

  const domain = url.toLowerCase();
  for (const [key, icon] of Object.entries(icons)) {
    if (domain.includes(key)) {
      return icon;
    }
  }

  return "🔗";
}

function renderLink(link) {
  const a = document.createElement("a");
  a.className = "link-item";
  a.href = link.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.dataset.id = link.id;

  a.innerHTML = `
        <span class="link-icon">${link.icon}</span>
        <span class="link-name">${escapeHtml(link.name)}</span>
        <button class="delete-link" title="Delete">×</button>
    `;

  linksListEl.appendChild(a);
}

function deleteLink(id) {
  const links = getLinks();
  const filteredLinks = links.filter((l) => l.id !== id);
  saveLinks(filteredLinks);

  const linkEl = document.querySelector(`.link-item[data-id="${id}"]`);
  if (linkEl) {
    linkEl.remove();
  }
}

// ==================== Event Listeners ====================
function setupEventListeners() {
  // Theme Toggle
  themeToggle.addEventListener("click", toggleTheme);

  // Name Modal
  editNameBtn.addEventListener("click", () => {
    nameModal.classList.add("active");
    nameInput.value = localStorage.getItem(STORAGE_KEYS.NAME) || "";
    nameInput.focus();
  });

  saveNameBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (name) {
      saveUserName(name);
      nameModal.classList.remove("active");
    }
  });

  closeModalBtn.addEventListener("click", () => {
    nameModal.classList.remove("active");
  });

  nameModal.addEventListener("click", (e) => {
    if (e.target === nameModal) {
      nameModal.classList.remove("active");
    }
  });

  nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveNameBtn.click();
    }
  });

  // Timer Controls
  startTimerBtn.addEventListener("click", startTimer);
  stopTimerBtn.addEventListener("click", stopTimer);
  resetTimerBtn.addEventListener("click", resetTimer);

  // To-Do List
  addTaskBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  taskListEl.addEventListener("click", (e) => {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;

    const id = parseInt(taskItem.dataset.id);

    if (e.target.classList.contains("task-checkbox")) {
      toggleTask(id);
    } else if (e.target.classList.contains("edit-btn")) {
      editTask(id);
    } else if (e.target.classList.contains("delete-btn")) {
      deleteTask(id);
    }
  });

  // Quick Links
  addLinkBtn.addEventListener("click", addLink);

  linkUrlInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addLink();
    }
  });

  linkNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      linkUrlInput.focus();
    }
  });

  linksListEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-link")) {
      e.preventDefault();
      e.stopPropagation();
      const linkItem = e.target.closest(".link-item");
      if (linkItem) {
        const id = parseInt(linkItem.dataset.id);
        deleteLink(id);
      }
    }
  });
}

// ==================== Start Application ====================
document.addEventListener("DOMContentLoaded", initApp);
