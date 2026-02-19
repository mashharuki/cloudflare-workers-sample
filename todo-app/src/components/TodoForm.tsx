import { JSX } from 'hono/jsx'

export const TodoForm = (): JSX.Element => {
  return (
    <form method="POST" action="/todos" className="todo-form">
      <input type="text" name="title" placeholder="やることを入力" required maxLength={100} />
      <button type="submit">追加</button>
    </form>
  )
}
