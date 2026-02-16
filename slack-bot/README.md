# Slackbot を作る · Cloudflare Workers ドキュメント

このチュートリアルでは、**Cloudflare Workers** を使って **Slack ボット（Slackbot）** を作ります。

作るボットは次のことができます：

* GitHub の Webhook を使って、**Issue が作成・更新されたら Slack に通知**
* Slack から `/issue` コマンドを使って、**GitHub Issue を検索**

最終的には、Slack チャンネル内で GitHub の Issue 情報を表示できるボットが完成します。

---

## このチュートリアルの対象者

次のような人におすすめです：

* Webアプリ開発の経験がある人
* TypeScript を使ったことがある人
* Node や Express を使ったことがある人（かなり似ています）

Webアプリ初心者でも大丈夫です。
Cloudflare Workers を使えば、面倒なサーバー設定を気にせず、コードを書くことに集中できます。

完成版のコードは GitHub に公開されています。
Slack API キーを設定すれば、自分の Slack 環境で試すこともできます。

---

# 始める前に

事前に以下を済ませておいてください：

* Cloudflare Workers アカウントの作成
* C3（create-cloudflare）
* Wrangler のインストール

---

# Slack の設定

Slack アカウントと、Slack アプリを作成できる権限が必要です。

---

## 1. Slack アプリを作成

Cloudflare Worker から Slack に投稿するために、Slack アプリを作ります。

1. [https://api.slack.com/apps](https://api.slack.com/apps) にアクセス
2. **Create New App** を選択

このアプリで使う機能は2つです：

* Incoming Webhooks
* Slash Commands

---

## 2. Incoming Webhook の設定

Incoming Webhook は、Slack にメッセージを送るための URL です。

### 手順

1. Slack の管理画面で **Incoming Webhooks** を選択
2. **Add New Webhook to Workspace** をクリック
3. 投稿先チャンネルを選択（例：#general）
4. 承認する

Webhook URL が発行されます。
これは後で Workers に設定します。

⚠️ この URL は秘密にしてください。

---

## 3. Slash Command の設定

Slash Command とは、Slack 内で `/コマンド` と入力すると、指定した URL にリクエストが送られる仕組みです。

例：

```
/weather 10001
```

→ サーバーに `10001` が送られる

このチュートリアルでは：

```
/issue owner/repo#1
```

を作ります。

### 手順

1. Slack 管理画面で **Slash Commands**
2. 新しいコマンドを作成
3. コマンド名を `/issue`
4. Request URL を以下に設定

```
https://あなたのWorkerURL/lookup
```

---

# GitHub Webhook の設定

GitHub からもイベントを受け取れるようにします。

Issue が作成・更新されたら Workers に通知されます。

### 手順

1. GitHub リポジトリ → Settings → Webhooks
2. **Add webhook**
3. Payload URL に設定：

```
https://あなたのWorkerURL/webhook
```

4. Content type を `application/json`
5. イベントは **Issues** を選択
6. Add webhook

---

# プロジェクト初期化

C3 を使ってプロジェクトを作ります。

```
npm create cloudflare@latest -- slack-bot
```

選択：

* Framework Starter
* Hono
* Deploy は No

作成後：

```
cd slack-bot
```

---

# Hono の基本コード

`src/index.ts` には最低限のアプリが入っています。

```
GET / にアクセスすると
Hello Hono!
```

が表示されます。

ローカル起動：

```
npm run dev
```

[http://localhost:8787](http://localhost:8787) にアクセスしてください。

---

# アプリの構成

Slackbot には 2 つのルートがあります：

### 1️⃣ `/lookup`

Slack の `/issue` コマンドから呼ばれる

### 2️⃣ `/webhook`

GitHub Webhook から呼ばれる

---

# TypeScript の型定義

`src/types.ts`

* `Bindings` → 環境変数
* `Issue` → GitHub Issue
* `User` → GitHub ユーザー

---

# lookup ルートの実装

## Slack からのデータ形式

Slack は `application/x-www-form-urlencoded` 形式で POST してきます。

例：

```
/issue cloudflare/wrangler#1
```

→ `text` に `cloudflare/wrangler#1` が入る

---

## 1. 文字列を分解

```
owner/repo#issue_number
```

を正規表現で分解します。

---

## 2. GitHub API を呼び出す

```
https://api.github.com/repos/{owner}/{repo}/issues/{number}
```

に fetch します。

---

## 3. Slack メッセージを作る

Slack の Block Kit を使います。

表示内容：

* Issue タイトル（リンク付き）
* Issue 本文
* ステータス
* 作成者（リンク付き）
* 作成日
* プロフィール画像

---

## Slack に返す

```
return c.json({
  blocks,
  response_type: "in_channel"
});
```

`in_channel` を指定すると、チャンネル全員に表示されます。

指定しない場合は、その人だけに表示されます（ephemeral）。

---

# webhook ルートの実装

GitHub から送られる JSON を受け取り、

```
An issue was opened:
```

のようなプレフィックスを付けて Slack に投稿します。

---

## Slack へ送信

```
fetch(c.env.SLACK_WEBHOOK_URL, {
  method: "POST",
  body: JSON.stringify({ blocks })
})
```

---

## 環境変数の設定

Slack Webhook URL を登録：

```
npx wrangler secret put SLACK_WEBHOOK_URL
```

⚠️ 絶対に公開しないでください

---

# デプロイ

```
npm run deploy
```

デプロイ完了後：

* GitHub で Issue を作成
* Slack に通知が表示される

# デプロイ

```bash
pnpm run destroy
```

---

# 完成！

このチュートリアルで作ったもの：

✅ Slack から GitHub Issue を検索
✅ GitHub の Issue 更新を Slack に通知
✅ Cloudflare Workers でサーバーレス運用
