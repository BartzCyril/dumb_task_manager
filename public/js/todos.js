import {api} from './api.js';

export function renderTodo(todo, index) {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex align-items-center justify-content-between`;

    if (todo.completed) {
        li.classList.add('completed-task');
    }

    li.innerHTML = `
    <div class="d-flex align-items-center">
        <input type="checkbox" class="form-check-input me-2" ${todo.completed ? 'checked' : ''} onclick="toggleTodoCompleted(${index})">
        <div>
            <strong class="${todo.completed ? 'text-decoration-line-through' : ''}">${todo.title}</strong>
            <p class="mb-1 ${todo.completed ? 'text-decoration-line-through' : ''}">${todo.description}</p>
        </div>
    </div>
    <div>
        <button class="btn btn-warning btn-sm" onclick="editTodo(${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTodo(${index})">Delete</button>
    </div>
    `;
    return li;
}

export function renderNoTasksMessage() {
    const li = document.createElement('li');
    li.className = 'list-group-item text-center text-muted';
    li.textContent = 'No tasks found. Add a new task!';
    return li;
}

export function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    if (todos.length === 0) {
        todoList.appendChild(renderNoTasksMessage());
    } else {
        todos.forEach((todo, index) => {
            todoList.appendChild(renderTodo(todo, index));
        });
    }
}

export function updateModalForModifyToto(name) {
    document.getElementById('addTaskModalLabel').textContent = `Modify Task: ${name}`;

    const submitButton = document.querySelector('#add-task-form button[type="submit"]');
    submitButton.textContent = 'Modify Task';
}

export function updateModalForAddTodo() {
    document.getElementById('addTaskModalLabel').textContent = `Add a New Task`;

    const submitButton = document.querySelector('#add-task-form button[type="submit"]');
    submitButton.textContent = 'Add Task';
}

export function showModal() {
    const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    modal.show();
}

export function closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
    modal.hide();
}

export function saveTodosLocally(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

export function getTodosLocally() {
    const todos = localStorage.getItem('todos');
    if (!todos || todos === 'undefined') {
        localStorage.setItem('todos', JSON.stringify([]));
        return [];
    }
    return JSON.parse(localStorage.getItem('todos')) || [];
}

export function deleteTodoFromServer(id) {
    api('DELETE', `/`, {}, id)
        .then(() => {
            window.location.reload();
        }).catch((error) => {
        window.alert(error.message);
    });
}

export function saveTodoToServer(todo) {
    api('POST', '/', todo)
        .then(() => {
            window.location.reload();
        }).catch((error) => {
        window.alert(error.message);
    });
}

export function updateTodoOnServer(todo) {
    api('PUT', `/`, todo)
        .then(() => {
            window.location.reload();
        }).catch((error) => {
        window.alert(error.message);
    });
}

export function editTodo(editIndex, index, todos) {
    const todo = todos[index];
    if (todo) {
        document.getElementById('task-title').value = todo.title;
        document.getElementById('task-description').value = todo.description;
        editIndex = index;
        updateModalForModifyToto(todo.title);
        showModal();
    }
    return editIndex;
}