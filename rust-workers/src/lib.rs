use worker::*;

// ルートハンドラー
fn root_handler(
    _req: worker::Request, 
    _ctx: RouteContext<()>
) -> worker::Result<worker::Response> {
    // "Hello World!" を返す
    Response::ok("Hello World!")
}

// エントリーポイントとなるメイン関数
#[event(fetch)]
async fn main(_req: Request, _env: Env, _ctx: Context) -> Result<Response> {
    // ルーターの設定
    let router = Router::new();

    // ルーティングの設定
    router.get("/", root_handler).run(_req, _env).await
}
