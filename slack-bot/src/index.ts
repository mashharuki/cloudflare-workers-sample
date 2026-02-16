import { Hono } from "hono";
import lookup from "./routes/lookup";
import webhook from "./routes/webhook";

// Honoアプリケーションの作成
const app = new Hono();

// ルートを追加
app.route("/lookup", lookup);
app.route("/webhook", webhook);

export default app;