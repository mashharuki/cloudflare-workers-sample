use axum::{response::IntoResponse, routing::get, Router};
use tower_service::Service;
use worker::*;

// ルートハンドラー
fn router() -> Router {
    Router::new().route("/", get(root))
}

// エントリーポイントとなるメイン関数
#[event(fetch)]
async fn fetch(
    _req: HttpRequest,
    _env: Env,
    _ctx: Context,
) -> Result<axum::http::Response<axum::body::Body>> {
   Ok(router().call(_req).await?)
}


#[worker::send]
pub async fn root() -> impl IntoResponse {
    "Hello, World!"
}