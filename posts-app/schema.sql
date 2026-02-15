-- 短文投稿アプリ用のデータベーススキーマ
DROP TABLE IF EXISTS posts;
-- 短文投稿テーブル作成
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    body TEXT
);