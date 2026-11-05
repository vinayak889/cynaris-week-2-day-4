
/* =========================================
   DOM Manipulation — Week 2 Day 4
   Dynamic To-Do List with localStorage
   ========================================= */

// 1. Select HTML elements using querySelector()
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const taskCount = document.querySelector("#task-count");

const STORAGE_KEY = "cynaris-todo-tasks";


// 2. Load saved tasks from localStorage
const loadTasks = () => {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch (error) {
    console.error("Could not load saved tasks:", error);
    return [];
  }
};

let tasks = loadTasks();


// 3. Save tasks to localStorage
const saveTasks = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
    alert("Unable to save tasks in this browser.");
  }
};


// 4. Update task count and empty message
const updateTaskInfo = () => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  taskCount.textContent =
    `${totalTasks} tasks | ${completedTasks} completed`;

  emptyMessage.hidden = totalTasks !== 0;
};


// 5. Create a task element using createElement()
const createTaskElement = (task) => {
  const listItem = document.createElement("li");
  listItem.classList.add("task-item");

  if (task.completed) {
    listItem.classList.add("completed");
  }

  listItem.dataset.id = task.id;

  const taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.textContent = task.text;

  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.classList.add("complete-btn");
  completeButton.dataset.action = "complete";
  completeButton.textContent = task.completed ? "Undo" : "Complete";
  completeButton.setAttribute(
    "aria-label",
    task.completed ? "Mark task as incomplete" : "Mark task as complete"
  );

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("delete-btn");
  deleteButton.dataset.action = "delete";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", "Delete task");

  actions.appendChild(completeButton);
  actions.appendChild(deleteButton);

  listItem.appendChild(taskText);
  listItem.appendChild(actions);

  return listItem;
};


// 6. Display all tasks
const renderTasks = () => {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });

  updateTaskInfo();
};


// 7. Add a new task
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (!taskText) {
    alert("Please enter a task.");
    return;
  }

  const newTask = {
    id: crypto.randomUUID(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();

  const taskElement = createTaskElement(newTask);
  taskList.appendChild(taskElement);

  updateTaskInfo();

  taskInput.value = "";
  taskInput.focus();
});


// 8. Event delegation for complete and delete actions
taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button || !taskList.contains(button)) {
    return;
  }

  const listItem = button.closest(".task-item");
  const taskId = listItem.dataset.id;
  const action = button.dataset.action;

  if (action === "complete") {
    const task = tasks.find(task => task.id === taskId);

    if (!task) return;

    task.completed = !task.completed;

    listItem.classList.toggle("completed", task.completed);

    button.textContent = task.completed ? "Undo" : "Complete";
    button.setAttribute(
      "aria-label",
      task.completed ? "Mark task as incomplete" : "Mark task as complete"
    );

    saveTasks();
    updateTaskInfo();
  }

  if (action === "delete") {
    // Remove the task element using removeChild()
    taskList.removeChild(listItem);

    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();
    updateTaskInfo();
  }
});


// 9. Restore saved tasks when the page loads
renderTasks();

console.log("To-Do App initialized successfully!");
