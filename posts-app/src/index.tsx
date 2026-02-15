import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { PostForm } from './components/PostForm';
import { Post, PostList } from './components/PostList';
import { renderer } from './renderer';

// D1用のバインディングを追加
const app = new Hono<{Bindings: { DB: D1Database } }>();

// rendererをミドルウェアとして登録
app.use(renderer)

// スキーマを作成
const createPostSchema = z.object({
  title: z.string(),
  body: z.string(),
});

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

/**
 * 投稿を取得する
 */
app.get('/posts', async (c) => {
  // 投稿文を取得する
  const posts = await c.env.DB.prepare('SELECT * FROM posts').all<Post>();

  return c.render(
    <div>
      <PostForm />
      <PostList posts={posts.results} />
    </div>
  );
});

/**
 * 投稿をPostする
 */
app.post('/posts', zValidator('form', createPostSchema), async (c) => {
  // タイトルと本文を取得
  const { title, body } = c.req.valid('form');

  // SQL
  const sql = 'INSERT INTO posts (title, body) VALUES (?, ?)';
  // SQLを実行
  await c.env.DB.prepare(sql).bind(title, body).run();
  return c.redirect('/posts');
});

export default app
