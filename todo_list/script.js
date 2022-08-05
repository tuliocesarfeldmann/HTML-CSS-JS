function NewElement(tag, className){
    const element = document.createElement(tag)
    element.className = className

    this.get = () => element
}

function TodoItem(name_todo, numberTodos){
    this.item = new NewElement('div', 'todo_item').get()
    this.item.innerHTML = name_todo

    const buttonDelete = new NewElement('button', 'fa fa-trash').get()
    this.item.appendChild(buttonDelete)

    getDateTime = () => {
        const date = new Date()

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        day = day < 10 ? '0'.concat(day) : day
        month = month < 10 ? '0'.concat(month) : month

        const formatDate = day + "/" + month + "/" + year;

        let hours = date.getHours()
        let minutes = date.getMinutes()

        hours = (hours < 10 ? '0'.concat(hours) : hours)
        minutes = (minutes < 10 ? '0'.concat(minutes) : minutes)

        const dateTime = new NewElement('div', 'date_time').get()
        dateTime.style.fontWeight = '400'
        dateTime.innerHTML = formatDate + ' - ' + hours + ':' + minutes

        return dateTime
    }
    
    dateTime = getDateTime()
    this.item.appendChild(dateTime)

    const todoList = document.getElementsByClassName('todo_list')[0]
    todoList.appendChild(this.item)

    buttonDelete.onclick = e => {
        todoList.removeChild(e.target.parentNode)
        let todos = Array.from(document.getElementsByClassName('todo_item')).length
        numberTodos.innerHTML = `Você possui ${todos}
            tarefas pendentes`
        todos == 0 ? buttonDeleteAll.style.visibility = 'hidden' : null
    }
}

function todoList(){
    nameTodo = document.querySelectorAll('input')[0]
    buttonInput = document.querySelectorAll('input')[1]
    numberTodos = document.querySelector('.number_todos')
    buttonDeleteAll = document.querySelector('.delete_all')

    buttonDeleteAll.style.visibility = 'hidden'

    addNewTodo = () => {
        if(nameTodo.value){
            TodoItem(nameTodo.value, numberTodos)
            const todos = Array.from(document.getElementsByClassName('todo_item')).length
            numberTodos.innerHTML = `Você possui ${todos} tarefas pendentes`

            buttonDeleteAll.style.visibility = 'visible'
        }
        nameTodo.value = null
    }

    deleteAll = () => {
        if(confirm('Excluir todas as tarefas?')){
            const allTodos = document.getElementsByClassName('todo_item')
            Array.from(allTodos).forEach(todo => {
                todo.parentNode.removeChild(todo)
            })
            numberTodos.innerHTML = 'Você possui 0 tarefas pendentes'
            buttonDeleteAll.style.visibility = 'hidden'
        }
    }

    buttonDeleteAll.onclick = deleteAll
    buttonInput.onclick = addNewTodo
    window.addEventListener("keypress", (e) => e.key == "Enter" ? addNewTodo() : null)
}

todoList()