import { EventEmitter } from 'events'

class RPC extends EventEmitter {
  _emit(namespace, cmd, eventString) {
    console.log(eventString)
    try {
      // const payload = JSON.parse(eventString)
      this.emit(namespace, { cmd, payload: eventString })
    } catch (err) {
      console.error('failed to parse payload', err, namespace, cmd, eventString)
    }
  }

  send(namespace, cmd, payload) {
    window.external.invoke(JSON.stringify({ namespace, cmd, payload }))
  }
}

// instantiate global rpc
window.rpc = new RPC()

const TODO_NAMESPACE = 'todo'

class TodoModel extends EventEmitter {
  constructor() {
    super()

    this.todos = []

    window.rpc.on(TODO_NAMESPACE, ({ cmd, payload }) => {
      if (cmd === 'update') {
        this.todos = payload
        this.emit('update')
      }
    })
  }

  init() {
    this._send('init')
  }

  subscribe(cb) {
    this.on('update', cb)
  }

  _send(cmd, payload) {
    window.rpc.send(TODO_NAMESPACE, cmd, payload)
  }

  addTodo(title) {
    this._send('add', {
      title,
      completed: false,
    })
  }

  toggleAll(checked) {
    this._send('toggleAll')
  }

  toggle(todoToToggle) {
    this._send('toggle', {
      id: todoToToggle.id,
    })
  }

  destroy(todo) {
    this._send('destroy', {
      id: todo.id,
    })
  }

  save(todoToSave, title) {
    this._send('save', { id: todoToSave.id, title })
  }

  clearCompleted() {
    this._send('clearCompleted')
  }
}

export default TodoModel
