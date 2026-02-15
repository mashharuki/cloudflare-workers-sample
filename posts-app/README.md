```txt
bun install
bun run dev
```

D1城にデータベーススキーマを適用させる

```bash
bun run db:migrate
```

以下のようになればOK!

```bash
✅ Successfully created DB 'posts-app' in region APAC
Created your new D1 database.
```

```txt
bun run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
bun run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
