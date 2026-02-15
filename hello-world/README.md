# Hello Worldプロジェクト動かし方

## 依存関係インストール

```bash
bun install
```

## ローカルで起動

```bash
bun run start
```

## Cloudflareにデプロイ

```bash
bun run deploy
```

以下のようになればOK!

```bash
Total Upload: 18.23 KiB / gzip: 4.58 KiB
Worker Startup Time: 17 ms
Uploaded hello-world (2.54 sec)
Deployed hello-world triggers (1.57 sec)
  https://hello-world.<固有値>.workers.dev
```

## Cloudflareから削除

```bash
bun run delete
```
