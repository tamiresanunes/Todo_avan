// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

/**
 * Cria um novo item na lista de tarefas.
 * 
 * @param {string} text - O texto da tarefa a ser adicionada.
 * @param {number} done - Indica se a tarefa está marcada como concluída (1) ou não (0).
 * @param {number} save - Indica se a tarefa deve ser salva no localStorage (1) ou não (0).
 */
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Adiciona a classe "done" se a tarefa estiver marcada como concluída
  if (done) {
    todo.classList.add("done");
  }

  // Salva a tarefa no localStorage se necessário
  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  // Adiciona a tarefa à lista de tarefas
  todoList.appendChild(todo);

  // Limpa o campo de entrada após salvar a tarefa
  todoInput.value = "";
};

/**
 * Alterna a visibilidade entre o formulário de edição e a lista de tarefas.
 */
const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

/**
 * Atualiza o texto de uma tarefa existente.
 * 
 * @param {string} text - O novo texto da tarefa.
 */
const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    // Substitui o texto antigo pelo novo se encontrar a tarefa correspondente
    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Atualiza o texto da tarefa no localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

/**
 * Filtra as tarefas exibidas com base em uma pesquisa.
 * 
 * @param {string} search - O termo de pesquisa.
 */
const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    // Esconde as tarefas que não correspondem ao termo de pesquisa
    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

/**
 * Filtra as tarefas exibidas com base no status de conclusão.
 * 
 * @param {string} filterValue - O filtro a ser aplicado ("all", "done", "todo").
 */
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    // Atualiza o status de conclusão da tarefa no localStorage
    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    // Remove a tarefa do localStorage
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Local Storage

/**
 * Retorna as tarefas salvas no localStorage.
 * 
 * @returns {Array} - Um array de objetos representando as tarefas.
 */
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
};

/**
 * Carrega as tarefas do localStorage e as adiciona na lista de tarefas.
 */
const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

/**
 * Salva uma nova tarefa no localStorage.
 * 
 * @param {Object} todo - Um objeto representando a tarefa a ser salva.
 */
const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

/**
 * Remove uma tarefa do localStorage com base no seu texto.
 * 
 * @param {string} todoText - O texto da tarefa a ser removida.
 */
const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

/**
 * Atualiza o status de conclusão de uma tarefa no localStorage.
 * 
 * @param {string} todoText - O texto da tarefa cujo status será atualizado.
 */
const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

/**
 * Atualiza o texto de uma tarefa no localStorage.
 * 
 * @param {string} todoOldText - O texto antigo da tarefa.
 * @param {string} todoNewText - O novo texto da tarefa.
 */
const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

// Carrega todas as tarefas salvas ao carregar a página
loadTodos();

