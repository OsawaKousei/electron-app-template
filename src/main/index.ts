/**
 * メインプロセス エントリーポイント
 * アプリケーションのライフサイクル管理とIPC通信を担当
 */

import path from "node:path";
import { BrowserWindow, app, ipcMain } from "electron";
import {
  initializeDatabase,
  getAllMemos,
  getMemoById,
  createMemo,
  updateMemo,
  deleteMemo,
  closeDatabase,
} from "./database";

// 開発環境かどうかを判定
const isDev = process.env.NODE_ENV === "development";

// データベースの初期化
initializeDatabase();

/**
 * アプリケーション起動時の処理
 */
app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("dist/index.html");

  // 開発時のみ開発者ツールを開く
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
});

/**
 * 全てのウィンドウが閉じられた時の処理
 */
app.once("window-all-closed", () => {
  closeDatabase();
  app.quit();
});

/**
 * IPC通信ハンドラー
 * レンダラープロセスからのリクエストを処理
 */

// 全てのメモを取得
ipcMain.handle("db:getAllMemos", async () => {
  return getAllMemos();
});

// IDでメモを取得
ipcMain.handle("db:getMemoById", async (_event, id: number) => {
  return getMemoById(id);
});

// 新規メモを作成
ipcMain.handle("db:createMemo", async (_event, content: string) => {
  return createMemo(content);
});

// メモを更新
ipcMain.handle("db:updateMemo", async (_event, id: number, content: string) => {
  updateMemo(id, content);
});

// メモを削除
ipcMain.handle("db:deleteMemo", async (_event, id: number) => {
  deleteMemo(id);
});
