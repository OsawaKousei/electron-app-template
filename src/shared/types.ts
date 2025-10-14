/**
 * 共有型定義
 * メインプロセスとレンダラープロセスの両方で使用される型を定義
 */

/**
 * メモオブジェクトの型定義
 */
export interface Memo {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 新規メモ作成時の型定義（IDなし）
 */
export interface NewMemo {
  content: string;
}

/**
 * プリロードスクリプトが公開するAPIのインターフェース
 */
export interface DatabaseAPI {
  getAllMemos: () => Promise<Memo[]>;
  getMemoById: (id: number) => Promise<Memo | undefined>;
  createMemo: (content: string) => Promise<Memo>;
  updateMemo: (id: number, content: string) => Promise<void>;
  deleteMemo: (id: number) => Promise<void>;
}
