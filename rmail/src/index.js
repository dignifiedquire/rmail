import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app'
import TodoModel from './model'

const model = new TodoModel()
model.subscribe(render)

function render() {
  ReactDOM.render(<App model={model} />, document.getElementById('root'))
}

render()
model.init()
