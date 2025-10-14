/**
 * レンダラープロセス用のグローバル型定義
 */

import type { DatabaseAPI } from "../shared/types";

declare global {
  interface Window {
    dbAPI: DatabaseAPI;
  }
}

export {};
