function renderTodo(todo, index) {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex align-items-center justify-content-between`;

    if (todo.checked) {
        li.classList.add('completed-task');
    }

    li.innerHTML = `
                    <div class="d-flex align-items-center">
                        <input type="checkbox" class="form-check-input me-2" ${todo.checked ? 'checked' : ''} onclick="toggleTodoChecked(${index})">
                        <div>
                            <strong>${todo.name}</strong>
                            <p class="mb-1">${todo.description}</p>
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-warning btn-sm" onclick="editTodo(${index})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTodo(${index})">Delete</button>
                    </div>   
                `;
    return li;
}

function renderNoTasksMessage() {
    const li = document.createElement('li');
    li.className = 'list-group-item text-center text-muted';
    li.textContent = 'No tasks found. Add a new task!';
    return li;
}

function renderTodos (todos) {
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

function updateModalForModifyToto (name) {
    document.getElementById('addTaskModalLabel').textContent = `Modify Task: ${name}`;

    const submitButton = document.querySelector('#add-task-form button[type="submit"]');
    submitButton.textContent = 'Modify Task';
}

function updateModalForAddTodo () {
    document.getElementById('addTaskModalLabel').textContent = `Add a New Task`;

    const submitButton = document.querySelector('#add-task-form button[type="submit"]');
    submitButton.textContent = 'Add Task';
}

function showModal () {
    const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    modal.show();
}

function closeModal () {
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
    modal.hide();
}

document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('add-task-form');

    const todos = JSON.parse(localStorage.getItem('todos')) || [];

    let editIndex = null;

    // waiting for backend

    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('task-name').value.trim();
        const description = document.getElementById('task-description').value.trim();

        if (name) {
            if (editIndex === null) {
                todos.push({ name, description, checked: false });
            } else {
                todos[editIndex] = { ...todos[editIndex], name, description };
                editIndex = null;
            }

            updateModalForAddTodo();

            saveTodos();
            renderTodos(todos);

            addTaskForm.reset();
            closeModal();
        }
    });

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    window.deleteTodo = (index) => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos(todos);
    };

    window.editTodo = (index) => {
        const todo = todos[index];

        if (!todo) {
            return;
        }

        document.getElementById('task-name').value = todo.name;
        document.getElementById('task-description').value = todo.description;

        editIndex = index;

        updateModalForModifyToto(todo.name);

        showModal();
    };

    window.toggleTodoChecked = (index) => {
        todos[index].checked = !todos[index].checked;
        saveTodos();
        renderTodos(todos);
    };

    renderTodos(todos);
});