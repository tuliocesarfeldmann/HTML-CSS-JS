function NewElement(tag, className){
    const element = document.createElement(tag)
    element.className = className

    this.get = () => element
}

function TodoItem(name_todo, pending){
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
        let numberTodos = Array.from(document.getElementsByClassName('todo_item')).length
        pending.innerHTML = `Você possui ${numberTodos}
            tarefas pendentes ${(numberTodos > 0) ?
            '<input class="delete_all" type="button" value="Excluir tudo"></input>'
            : ''}`
    }
}

function todoList(){
    nameTodo = document.querySelectorAll('input')[0]
    buttonInput = document.querySelectorAll('input')[1]
    pending = document.getElementsByClassName('pending')[0]

    buttonInput.onclick = e => {
        if(nameTodo.value){
            TodoItem(nameTodo.value, pending)
            const numberTodos = Array.from(document.getElementsByClassName('todo_item')).length
            pending.innerHTML = `Você possui ${numberTodos}
                tarefas pendentes <input class="delete_all" type="button" value="Excluir tudo">`
            
            document.querySelector('.delete_all').onclick = deleteAll
        }
        nameTodo.value = null
    }

    deleteAll = () => {
        if(confirm('Excluir todas as tarefas?')){
            const allTodos = document.getElementsByClassName('todo_item')
            Array.from(allTodos).forEach(todo => {
                todo.parentNode.removeChild(todo)
            })
            pending.innerHTML = 'Você possui 0 tarefas pendentes'
        }
    }
}

todoList()