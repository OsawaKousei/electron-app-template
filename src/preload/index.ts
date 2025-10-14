/**
 * プロセス間通信のブリッジ
 * レンダラープロセスに安全なAPIを公開
 */

import { contextBridge, ipcRenderer } from "electron";
import type { DatabaseAPI } from "../shared/types";

/**
 * レンダラープロセスのwindowオブジェクトに安全なAPIを公開
 */
const dbAPI: DatabaseAPI = {
  getAllMemos: () => ipcRenderer.invoke("db:getAllMemos"),
  getMemoById: (id: number) => ipcRenderer.invoke("db:getMemoById", id),
  createMemo: (content: string) => ipcRenderer.invoke("db:createMemo", content),
  updateMemo: (id: number, content: string) =>
    ipcRenderer.invoke("db:updateMemo", id, content),
  deleteMemo: (id: number) => ipcRenderer.invoke("db:deleteMemo", id),
};

contextBridge.exposeInMainWorld("dbAPI", dbAPI);
