/**
 * データベース操作層
 * SQLiteデータベースへの接続とCRUD操作を提供
 */

import Database from "better-sqlite3";
import path from "node:path";
import { app } from "electron";
import type { Memo } from "../shared/types";

// データベースファイルのパス（アプリのユーザーデータディレクトリに配置）
const dbPath = path.join(app.getPath("userData"), "memo.db");

// データベース接続を初期化
const db = new Database(dbPath);

/**
 * データベースの初期化
 * テーブルが存在しない場合は作成する
 */
export function initializeDatabase(): void {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `;
  db.exec(createTableSQL);
}

/**
 * 全てのメモを取得
 */
export function getAllMemos(): Memo[] {
  const stmt = db.prepare("SELECT * FROM memos ORDER BY updatedAt DESC");
  return stmt.all() as Memo[];
}

/**
 * IDでメモを取得
 */
export function getMemoById(id: number): Memo | undefined {
  const stmt = db.prepare("SELECT * FROM memos WHERE id = ?");
  return stmt.get(id) as Memo | undefined;
}

/**
 * 新規メモを作成
 */
export function createMemo(content: string): Memo {
  const now = new Date().toISOString();
  const stmt = db.prepare(
    "INSERT INTO memos (content, createdAt, updatedAt) VALUES (?, ?, ?)"
  );
  const result = stmt.run(content, now, now);
  return {
    id: result.lastInsertRowid as number,
    content,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * メモを更新
 */
export function updateMemo(id: number, content: string): void {
  const now = new Date().toISOString();
  const stmt = db.prepare(
    "UPDATE memos SET content = ?, updatedAt = ? WHERE id = ?"
  );
  stmt.run(content, now, id);
}

/**
 * メモを削除
 */
export function deleteMemo(id: number): void {
  const stmt = db.prepare("DELETE FROM memos WHERE id = ?");
  stmt.run(id);
}

/**
 * データベース接続を閉じる
 */
export function closeDatabase(): void {
  db.close();
}
