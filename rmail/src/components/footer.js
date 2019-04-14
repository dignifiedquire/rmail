import React, { Component } from 'react'
import classNames from 'classnames'

import * as utils from '../utils'

export default class Footer extends Component {
  render() {
    var activeTodoWord = utils.pluralize(this.props.count, 'item')
    var clearButton = null

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.props.onClearCompleted}
        >
          Clear completed
        </button>
      )
    }

    var nowShowing = this.props.nowShowing
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a
              href="#/"
              className={classNames({
                selected: nowShowing === utils.ALL_TODOS,
              })}
            >
              All
            </a>
          </li>{' '}
          <li>
            <a
              href="#/active"
              className={classNames({
                selected: nowShowing === utils.ACTIVE_TODOS,
              })}
            >
              Active
            </a>
          </li>{' '}
          <li>
            <a
              href="#/completed"
              className={classNames({
                selected: nowShowing === utils.COMPLETED_TODOS,
              })}
            >
              Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    )
  }
}
