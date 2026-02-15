# hello-world-pages

To install dependencies:

```bash
bun install
```

Pagesのデプロイ

```bash
bun run deploy
```

KV namespeceを作成する

```bash
bunx wrangler kv namespace create hello_world_pages_counter
```

ここで発行された`binding`と`id`は`wrangler.jsonc`に記載して下さい。

ローカルでCloudflare pageを検証する

```bash
bun run dev
```