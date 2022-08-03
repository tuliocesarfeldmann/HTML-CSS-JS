function newElement(className){
    const element = document.createElement('div')
    element.className = className

    return element
}

function TodoItem(name_todo, dateTime, pending){
    this.element = newElement('todo_item')
    this.element.innerHTML = name_todo

    const iconDelete = document.createElement('i')
    iconDelete.className = 'fa fa-trash'

    const buttonDelete = document.createElement('button')
    buttonDelete.className = 'fa fa-trash'

    this.element.appendChild(buttonDelete)
    this.element.appendChild(dateTime)
    
    const todoList = document.getElementsByClassName('todo_list')[0]
    todoList.appendChild(this.element)
    
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
    const nameTodo = document.querySelectorAll('input')[0]
    const buttonInput = document.querySelectorAll('input')[1]
    const pending = document.getElementsByClassName('pending')[0]

    buttonInput.onclick = _ => {
        const date = new Date();
        const formatDate = ((date.getDate() )) + "/" + ((date.getMonth() + 1)) + "/" + date.getFullYear();
        let hours = date.getHours()
        let minutes = date.getMinutes()
        hours = (hours < 10 ? '0'.concat(hours) : hours)
        minutes = (minutes < 10 ? '0'.concat(minutes) : minutes)

        const dateTime = newElement('date_time')
        dateTime.style.fontWeight = '400'
        dateTime.innerHTML = formatDate + ' - ' + hours + ':' + minutes

        if(nameTodo.value){
            TodoItem(nameTodo.value, dateTime, pending)
            const numberTodos = Array.from(document.getElementsByClassName('todo_item')).length
            pending.innerHTML = `Você possui ${numberTodos}
                tarefas pendentes <input class="delete_all" type="button" value="Excluir tudo">`
        }

        document.getElementsByClassName('delete_all')[0].onclick = deleteAll
        nameTodo.value = null
    }

    function deleteAll(){
        if(confirm('Excluir todas as tarefas?')){
            const allTodos = document.getElementsByClassName('todo_item')
            Array.from(allTodos).forEach(todo => {
                todo.parentNode.removeChild(todo)
            })
            pending.innerHTML = 'Você possui 0 tarefas pendentes'
        }
    }
}

new todoList