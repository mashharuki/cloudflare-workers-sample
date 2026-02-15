/**
 * アクセスカウンター用のサンプルfunctions
 */
export async function onRequest(context) {
  // KVの"counter"キーにアクセス
  const value = await context.env.hello_world_pages_counter.get("counter");
  // 取得した値を数値に変換する
  const currentCount = Number.isNaN(Number(value)) ? 0 : Number(value);
  // カウントを１増やす
  const count = currentCount + 1;
  // KVの"counter"キーに新しいカウントを保存する
  await context.env.hello_world_pages_counter.put("counter", String(count));
  // カウントをレスポンスとして返す
  return Response.json({ count: count });
};