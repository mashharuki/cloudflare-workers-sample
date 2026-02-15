```txt
bun install
bun run dev
```

```txt
bun run deploy
```

デプロイ後にcurlコマンドを試す

```bash
curl -XGET "https://hello-hono.<固有値>.workers.dev/"
```

```bash
Hello Hono!
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

delete

```bash
bun run delete
```