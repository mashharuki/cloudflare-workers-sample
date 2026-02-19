import { JSX } from 'hono/jsx'
import { Todo } from '../db/schema'

type Props = {
  todos: Todo[]
}

export const TodoList = ({ todos }: Props): JSX.Element => {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={todo.done ? 'todo-item done' : 'todo-item'}>
          <form method="POST" action={`/todos/${todo.id}/toggle`}>
            <button type="submit" className="toggle-button">
              {todo.done ? '完了' : '未完了'}
            </button>
          </form>
          <span className="todo-title">{todo.title}</span>
          <form method="POST" action={`/todos/${todo.id}/delete`}>
            <button type="submit" className="delete-button">
              削除
            </button>
          </form>
        </li>
      ))}
    </ul>
  )
}
