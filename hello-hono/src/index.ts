import { Hono } from 'hono'

const app = new Hono()

// プロキシサーバーを実装する
// app.all('*', (c) => fetch(c.req.raw))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
