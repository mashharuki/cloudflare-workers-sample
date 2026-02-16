# Cloudflare Edge Chat デモ

[Cloudflare Workers](https://workers.cloudflare.com/) と [Durable Objects](https://blog.cloudflare.com/introducing-workers-durable-objects) を活用して、チャット履歴の保存機能付きリアルタイムチャットを実現するデモアプリです。すべての処理が Cloudflare のエッジ上で完結しています。

デモはこちら: https://edge-chat-demo.cloudflareworkers.com

このデモが注目に値する理由は、「状態（ステート）」を扱っている点にあります。

Durable Objects が登場する以前、Workers はステートレス（状態を持たない）であり、状態の管理は外部に頼るしかありませんでした。

ここでいう「状態」とは、単なるデータの保存だけでなく、ユーザー間の「連携・調整」も意味します。たとえばチャットルームでは、あるユーザーがメッセージを送ると、他のユーザーがすでに開いている接続を通じてそのメッセージを届ける必要があります。この接続そのものが「状態」であり、ステートレスな仕組みの中でこれを調整するのは非常に困難、あるいは不可能でした。

## どのように動作するのか

このチャットアプリでは、各チャットルームの制御に Durable Object を使用しています。ユーザーは WebSocket を通じてオブジェクトに接続し、あるユーザーからのメッセージは他のすべてのユーザーにブロードキャストされます。チャット履歴も永続ストレージに保存されますが、あくまで履歴の閲覧用です。リアルタイムのメッセージはストレージを経由せず、ユーザー間で直接中継されます。

さらに、このデモでは Durable Objects をもうひとつの用途にも活用しています。それは、特定の IP アドレスからのメッセージにレートリミット（送信頻度の制限）を適用することです。各 IP アドレスにはそれぞれ Durable Object が割り当てられ、直近のリクエスト頻度を追跡します。これにより、メッセージを送りすぎたユーザーは、複数のチャットルームにまたがっても一時的にブロックされます。興味深いのは、これらのオブジェクトは永続的な状態を一切保存しないという点です。ごく最近の履歴だけを扱うため、レートリミッターがたまにリセットされても大きな問題にはなりません。つまり、これはストレージを持たない純粋な「調整用オブジェクト」の好例です。

このチャットアプリのコードはわずか数百行、デプロイの設定もほんの数行です。それでいて、Cloudflare のリソースが許す限り、チャットルームの数に関係なくシームレスにスケールします。もちろん、各オブジェクトはシングルスレッドで動作するため、個々のチャットルームにはスケーラビリティの上限があります。ただし、その上限は人間の参加者が追いつけるレベルをはるかに超えています。

詳しくはコードをご覧ください！丁寧にコメントが書かれています。

## 更新履歴

このサンプルはもともと [WebSocket API](https://developers.cloudflare.com/workers/runtime-apis/websockets/) を使って作られていましたが、その後 Durable Objects 専用の [WebSocket Hibernation API](https://developers.cloudflare.com/durable-objects/api/websockets/#websocket-hibernation) を使うように[変更](https://github.com/cloudflare/workers-chat-demo/pull/32)されました。

Hibernation API に切り替える前は、チャットルームに接続している WebSocket がアイドル状態であっても、Durable Object がメモリ上に保持され続けていました。そのため、WebSocket 接続が開いている間ずっと、実行時間に対する課金が発生していました。WebSocket Hibernation API に切り替えることで、Workers ランタイムは非アクティブな Durable Object インスタンスをメモリから退避させつつ、すべての WebSocket 接続は維持するようになりました。WebSocket が再びアクティブになると、ランタイムが Durable Object を再生成し、適切な WebSocket イベントハンドラにイベントを配信します。

WebSocket Hibernation API への切り替えにより、課金対象が「WebSocket 接続の存続期間全体」から「JavaScript が実際に実行されている時間」のみに短縮されます。

## もっと詳しく知る

* [Durable Objects 紹介ブログ記事](https://blog.cloudflare.com/introducing-workers-durable-objects)
* [Durable Objects ドキュメント](https://developers.cloudflare.com/workers/learning/using-durable-objects)
* [Durable Object WebSocket ドキュメント](https://developers.cloudflare.com/durable-objects/reference/websockets/)

## 自分でデプロイする

まだの場合は、[Cloudflare ダッシュボード](https://dash.cloudflare.com/)にアクセスし、「Workers」→「Durable Objects」の順に進んで Durable Objects を有効化してください。

次に、Workers 公式 CLI の [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update) がインストールされていることを確認してください。このサンプルの実行にはバージョン 3.30.1 以上を推奨します。

インストール後、`wrangler login` を実行して [Cloudflare アカウントに接続](https://developers.cloudflare.com/workers/cli-wrangler/authentication)してください。

アカウントで Durable Objects を有効化し、Wrangler のインストールと認証が完了したら、以下のコマンドで初回デプロイができます:

    wrangler deploy

「Cannot create binding for class [...] because it is not currently configured to implement durable objects」というエラーが出た場合は、Wrangler のバージョンを更新してください。

このコマンドにより、`edge-chat-demo` という名前でアカウントにデプロイされます。

## 依存関係について

このデモコードには外部依存はありません。必要なのは、サーバーサイドの Cloudflare Workers（`chat.mjs`）と、クライアントサイドのモダンブラウザ（`chat.html`）だけです。デプロイには Wrangler が必要です。

## アンインストール方法

wrangler.toml を編集して durable_objects のバインディングを削除し、deleted_classes のマイグレーションを追加してください。wrangler.toml の末尾は以下のようにします:

```
[durable_objects]
bindings = [
]

# ChatRoom と RateLimiter クラスを Durable Objects として呼び出せるようにする設定
[[migrations]]
tag = "v1" # エントリごとに一意である必要があります
new_classes = ["ChatRoom", "RateLimiter"]

[[migrations]]
tag = "v2"
deleted_classes = ["ChatRoom", "RateLimiter"]
```

その後 `wrangler deploy` を実行すると、Durable Objects とそのデータがすべて削除されます。Worker 自体を削除するには、[dash.cloudflare.com](dash.cloudflare.com) にアクセスし、Workers → Overview → edge-chat-demo → Manage Service → Delete（ページ下部）の順に進んでください。
