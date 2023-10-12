// ToDo-app (PROJEKT 2)
console.log("todo.js init");


const server_host = "128.214.253.222";
const server_port = "8312"; // Change according to used API
const api_key = `?api_key=${localStorage.todo_key}`
const server_socket = `http://${server_host}:${server_port}`;

// Output elements
const todoListOutput = document.querySelector('#todo-list');
const categoryListOutput = document.querySelector('#todo-sel-category');

let todoListReq;
let todoList;

let categoryListReq;
let categoryList;



// Fetch todo JSON
async function getTodo() {
    // Todo list
    todoListOutput.innerHTML = "";

    todoListReq = await fetch(`${server_socket}/todos${api_key}`);
    todoList = await todoListReq.json();

    // Category list
    categoryListReq = await fetch(`${server_socket}/categories${api_key}`)
    categoryList = await categoryListReq.json();



    for (let i = 0; i < todoList.todos.length; i++) {
        let todo = todoList.todos[i];

        // Parse date
        const date = new Date(todo.due_date);
        const formatDate = date.toISOString().slice(0, 10);
        console.log(formatDate);

        todoListOutput.innerHTML += `<li id='todo-id-${todo.id}' class='todo-item'><input type='text' id='todo-title-id-${todo.id}' value='${todo.title}'><select id='todo-item-category-${todo.id}' class='todo-category'></select><input type="date" name="" value="${formatDate}" id="todo-due-id-${todo.id}" value="${todo.done.value}"><button id="btn-done-todo-${todo.id}"></button><button class='btn-todo-update' id="btn-put-todo-${todo.id}">Update</button><button class='btn-todo-delete' id="btn-del-todo-${todo.id}">Delete</button></li>`;
        let todoCatElem = document.querySelector('#todo-item-category-' + todo.id);
        categoryOutput(todoCatElem);
        todoCatElem.value = todo.category_id;
        /*let todoDoneElem = document.querySelector('#todo-done-' + todo.id);
        doneOutput(todoDoneElem);
        todoDoneElem.value = todo.done;*/
        toggleDone(todo);
        let todoTitleInput = document.querySelector('#todo-title-id-' + todo.id);

    }


    categoryOutput(categoryListOutput);
}

function addEventListeners() {
    for (let i = 0; i < todoList.todos.length; i++) {
        let todo = todoList.todos[i];

        let todoDelBtn = document.querySelector('#btn-del-todo-' + todo.id);
        let todoUpdBtn = document.querySelector('#btn-put-todo-' + todo.id);
        let todoDoneBtn = document.querySelector('#btn-done-todo-' + todo.id);
        console.log(todoDelBtn);
        console.log(todoUpdBtn);
        console.log(todoDoneBtn);

        todoDoneBtn.addEventListener('click', (todo) => {
            toggleDone(todo);
        });
        console.log("Event listener added to " + todoDoneBtn.id);
        todoDelBtn.addEventListener('click', () => {
            deleteData(todo.id);
        });
        console.log("Event listener added to " + todoDelBtn.id);

        todoUpdBtn.addEventListener('click', () => {

            var putData = {
                category_id: document.querySelector(`#todo-item-category-${todo.id}`).value,
                title: document.querySelector(`#todo-title-id-${todo.id}`).value,
                due_date: document.querySelector(`#todo-due-id-${todo.id}`).value,
                done: document.querySelector(`#btn-done-todo-${todo.id}`).value
            }

            updateData(putData, todo.id);
        });

        console.log("Event listener added to " + todoUpdBtn.id);

    }
}

// Wait for the DOM to be fully loaded
getTodo().then(() => {
    addEventListeners(); // Call the function after the elements have been added
});

function toggleDone(todo) {
    todo.done = !todo.done; // toggle the value of todo.done
    var doneState = {
        true: '&#x2713;',
        false: '&#10006;'
    }
    document.querySelector('#btn-done-todo-' + todo.id).innerHTML = doneState[todo.done];
    document.querySelector('#btn-done-todo-' + todo.id).value = todo.done;
    console.log(todo.done);

}


function categoryOutput(elem) {
    for (let i = 0; i < categoryList.category.length; i++) {
        let category = categoryList.category[i];
        elem.innerHTML += `<option value='${category.id}'>${category.category_name}</option>`;
    }
}

async function postData(data) {

    const resp = await fetch(`${server_socket}/todos${api_key}`, {
        method: "POST",
        body: JSON.stringify(

            data
        ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"

        }
    });
    const ans = await resp.json();

    console.log(ans);
    getTodo().then(() => {
        addEventListeners();
    });
}

document.querySelector('#btn-todo-save').addEventListener('click', () => {

    var postdata = {
        category_id: document.querySelector('#todo-sel-category').value,
        title: sanitizeInput(document.querySelector('#input-todo').value),
        due_date: document.querySelector('#todo-due-date').value,
        done: false
    }

    postData(postdata);

});

async function updateData(putData, id) {

    const resp = await fetch(`${server_socket}/todos/${id}${api_key}`, {
        method: "PUT",
        body: JSON.stringify(

            putData
        ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"

        }
    });
    const ans = await resp.json();

    console.log(ans);
    getTodo().then(() => {
        addEventListeners();
    });
}



async function deleteData(id) {
    const resp = await fetch(`${server_socket}/todos/${id}${api_key}`, {
        method: 'DELETE',
    });
    const data = await resp.json();
    console.log(data);
    getTodo().then(() => {
        addEventListeners();
    });
}


