import { zValidator } from '@hono/zod-validator'
import { desc, eq } from 'drizzle-orm'
import { Context, Hono } from 'hono'
import { z } from 'zod'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { createDb } from './db'
import { todosTable } from './db/schema'
import { renderer } from './renderer'

type Bindings = {
  DATABASE_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()
type AppContext = Context<{ Bindings: Bindings }>

app.use(renderer)

const resolveDatabaseUrl = (c: AppContext): string | null => {
  const databaseUrl = c.env.DATABASE_URL
  if (!databaseUrl) {
    return null
  }
  return databaseUrl
}

// ToDo用のデータスキーマ
const createTodoSchema = z.object({
  title: z.string().min(1).max(100)
})

/**
 * ルートハンドラーは、GETリクエストを処理し、ToDoリストを表示します。
 */
app.get('/', async (c: AppContext): Promise<Response> => {
  const databaseUrl = resolveDatabaseUrl(c)
  if (!databaseUrl) {
    return c.text('DATABASE_URL is not set', 500)
  }
  const db = createDb(databaseUrl)
  const todos = await db.select().from(todosTable).orderBy(desc(todosTable.id))
  return c.render(
    <div>
      <h1>Todo App</h1>
      <TodoForm />
      <TodoList todos={todos} />
    </div>
  )
})

/**
 * POST /todos ハンドラーは、ToDoを作成します。
 */
app.post('/todos', zValidator('form', createTodoSchema), async (c: AppContext): Promise<Response> => {
  // フォームからタイトルを取得
  const { title } = c.req.valid('form')
  //データベース接続
  const databaseUrl = resolveDatabaseUrl(c)
  if (!databaseUrl) {
    return c.text('DATABASE_URL is not set', 500)
  }
  const db = createDb(databaseUrl)
  // データ挿入
  await db.insert(todosTable).values({ title, done: false })
  return c.redirect('/')
})

app.post('/todos/:id/toggle', async (c: AppContext): Promise<Response> => {
  const id = Number(c.req.param('id'))
  if (Number.isNaN(id)) {
    return c.text('Invalid id', 400)
  }
  const databaseUrl = resolveDatabaseUrl(c)
  if (!databaseUrl) {
    return c.text('DATABASE_URL is not set', 500)
  }
  const db = createDb(databaseUrl)
  // SELECT クエリを実行し、指定されたIDのToDoを取得
  const [current] = await db.select().from(todosTable).where(eq(todosTable.id, id)).limit(1)
  if (current) {
    // 取得したToDoのdoneフィールドを反転させて更新
    await db.update(todosTable).set({ done: !current.done }).where(eq(todosTable.id, id))
  }
  return c.redirect('/')
})

/**
 * POST /todos/:id/delete ハンドラーは、ToDoを削除します。
 */ 
app.post('/todos/:id/delete', async (c: AppContext): Promise<Response> => {
  const id = Number(c.req.param('id'))
  if (Number.isNaN(id)) {
    return c.text('Invalid id', 400)
  }
  // データベースに接続
  const databaseUrl = resolveDatabaseUrl(c)
  if (!databaseUrl) {
    return c.text('DATABASE_URL is not set', 500)
  }
  const db = createDb(databaseUrl)
  // DELETE クエリを実行し、指定されたIDのToDoを削除
  await db.delete(todosTable).where(eq(todosTable.id, id))
  return c.redirect('/')
})

export default app
