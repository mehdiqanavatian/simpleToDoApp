let currentEdit = null;

class ToDo {
    title = "";
    subject = "";

    constructor(title, subject) {
        this.title = title;
        this.subject = subject;
    }

}

class storageHelper {

    static getToDo() {
        let allToDoItems;
        if (localStorage.getItem('ToDo') != null) {
            allToDoItems = JSON.parse(localStorage.getItem('ToDo'));
        } else {
            allToDoItems = [];
        }
        return allToDoItems;
    }
    static setToDo(allToDoItems) {
        localStorage.setItem('ToDo', JSON.stringify(allToDoItems));
    }
}

class UI {
    static getToDo() {
        const storedToDoItems = [{ title: 'Mehdi', subject: 'I will fuck you again' }, { title: 'Niloofar', subject: "I'm your whore forever" }, { title: 'the other woman', subject: "and im here for a threesome" }];
        const allToDoItems = storageHelper.getToDo();

        allToDoItems.forEach((todo) => UI.addTodoItem(todo));
    }
    static addTodoItem(toDo) {
        let toDoCard = document.createElement('div');
        let toDoCardTitle = document.createElement('div');
        let toDoCardSubject = document.createElement('div');
        let toDoCardDelete = document.createElement('div');
        let toDoCardEdit = document.createElement('div');
        toDoCard.classList.add('todo-card');
        toDoCardTitle.classList.add('todo-card-title');
        toDoCardSubject.classList.add('todo-card-subject');
        toDoCardDelete.classList.add('todo-card-delete');
        toDoCardEdit.classList.add('todo-card-edit');
        toDoCardTitle.innerHTML = toDo.title;
        toDoCardSubject.innerHTML = toDo.subject;
        toDoCardDelete.innerHTML = 'X';
        toDoCardEdit.innerHTML = '+';

        toDoCardDelete.addEventListener('click', function (e) {
            hideAllMenus();
            this.parentElement.parentElement.removeChild(this.parentElement);
            UI.setToDo();
        });
        toDoCardEdit.addEventListener('click', function (e) {
            hideAllMenus();
            document.querySelector('#editTitle').value = toDoCardEdit.parentElement.querySelector('.todo-card-title').innerHTML;
            document.querySelector('#editContent').value = toDoCardEdit.parentElement.querySelector('.todo-card-subject').innerHTML;
            document.querySelector('.editMenu').classList.add('active');
            currentEdit = toDoCardEdit;
        });

        toDoCard.appendChild(toDoCardTitle);
        toDoCard.appendChild(toDoCardSubject);
        toDoCard.appendChild(toDoCardDelete);
        toDoCard.appendChild(toDoCardEdit);

        document.querySelector('.main').appendChild(toDoCard);
    }

    static setToDo() {
        const cards = document.querySelectorAll('.todo-card');
        const final = [];
        cards.forEach((card) => {
            let todo = new ToDo(card.querySelector('.todo-card-title').innerHTML, card.querySelector('.todo-card-subject').innerHTML);
            final.push(todo);
        });
        storageHelper.setToDo(final);
    }
}

function toggleMenu() {
    let menu = document.querySelector('.addTodoMenu');
    let addtodo = document.querySelector('.addTodo');


    if (!menu.classList.contains('active')) {
        menu.classList.add('active');
    }
}

function hideAllMenus() {
    let addMenu = document.querySelector('.addTodoMenu');
    let editMenu = document.querySelector('.editMenu');


    if (addMenu.classList.contains('active')) {
        addMenu.classList.remove('active');
    }
    if (editMenu.classList.contains('active')) {
        editMenu.classList.remove('active');
    }

    document.querySelector('#ToDoTitle').value = '';
    document.querySelector('#ToDoContent').value = '';
    document.querySelector('#editTitle').value = '';
    document.querySelector('#editContent').value = '';
    currentEdit = null;
}

document.querySelector('.addTodo').addEventListener('click', toggleMenu);

document.body.addEventListener('click', (e) => {
    if (e.target == document.querySelector('.main')) {
        hideAllMenus();
    }
});

document.querySelector('#ToDoEdit').addEventListener('click', function (e) {
    e.preventDefault();
    if (currentEdit != null && (document.querySelector('#editTitle').value !='')) {
        currentEdit.parentElement.querySelector('.todo-card-title').innerHTML = document.querySelector('#editTitle').value;
        currentEdit.parentElement.querySelector('.todo-card-subject').innerHTML = document.querySelector('#editContent').value;
        sendAlert(document.querySelector('.main'), 'green', "Item was added successfully.", 3000);
        UI.setToDo();
        hideAllMenus();
        currentEdit = null;
    }else{
        sendAlert(document.querySelector('.editMenu'), 'red', "Title can not be empty.", 3000);
    }
});

document.querySelector('#ToDoAdd').addEventListener('click', function (e) {
    e.preventDefault();
    let title = document.querySelector('#ToDoTitle');
    let subject = document.querySelector('#ToDoContent');
    let alert = document.querySelector('.addTodoMenu');
    if (title.value.length > 0) {

        let todo = { title: title.value, subject: subject.value };
        UI.addTodoItem(todo);
        sendAlert(document.querySelector('.main'), 'green', "Item was added successfully.", 3000);

        UI.setToDo();
        hideAllMenus();

    } else {
        sendAlert(alert, 'red', "Title is required.", 3000);
    }
});

document.querySelector('#ToDoCancelAdd').addEventListener('click', function (e) {
    e.preventDefault();
    hideAllMenus();
});

document.querySelector('#ToDoCancelEdit').addEventListener('click', function (e) {
    e.preventDefault();
    hideAllMenus();
});

function sendAlert(parent, color, message, timeout) {
    let element = document.createElement('p');
    element.classList.add('txtMessage');
    element.classList.add(color);
    element.innerHTML = message;
    parent.appendChild(element);

    setTimeout(() => {
        element.classList.remove(color);
    }, timeout);
    setTimeout(() => {
        element.parentElement.removeChild(element);
    }, (timeout + 1000));

}

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('todo-card-title')) {
        let subject = e.target.nextElementSibling;
        if (subject) {
            if (!subject.classList.contains('open')) {
                subject.classList.add('open');
            } else {
                subject.classList.remove('open');
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', UI.getToDo);