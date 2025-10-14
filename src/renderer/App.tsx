/**
 * ルートコンポーネント
 * アプリケーション全体のレイアウトと状態管理を担当
 */

import { useState, useEffect } from "react";
import type { Memo } from "../shared/types";
import { MemoList } from "./components/MemoList";
import { MemoEditor } from "./components/MemoEditor";
import "./App.css";

export function App() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // 初回レンダリング時に全てのメモを取得
  useEffect(() => {
    loadMemos();
  }, []);

  // メモ一覧を読み込む
  const loadMemos = async () => {
    const allMemos = await window.dbAPI.getAllMemos();
    setMemos(allMemos);
  };

  // メモを選択
  const handleSelectMemo = async (id: number) => {
    setIsCreatingNew(false);
    const memo = await window.dbAPI.getMemoById(id);
    if (memo) {
      setSelectedMemo(memo);
    }
  };

  // 新規メモ作成モード
  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedMemo(null);
  };

  // メモを保存（新規作成または更新）
  const handleSaveMemo = async (id: number | null, content: string) => {
    if (id === null) {
      // 新規作成
      const newMemo = await window.dbAPI.createMemo(content);
      await loadMemos();
      setSelectedMemo(newMemo);
      setIsCreatingNew(false);
    } else {
      // 更新
      await window.dbAPI.updateMemo(id, content);
      await loadMemos();
      const updatedMemo = await window.dbAPI.getMemoById(id);
      if (updatedMemo) {
        setSelectedMemo(updatedMemo);
      }
    }
  };

  // メモを削除
  const handleDeleteMemo = async (id: number) => {
    await window.dbAPI.deleteMemo(id);
    await loadMemos();
    if (selectedMemo?.id === id) {
      setSelectedMemo(null);
    }
  };

  return (
    <div className="app-container">
      <MemoList
        memos={memos}
        selectedMemoId={selectedMemo?.id ?? null}
        onSelectMemo={handleSelectMemo}
        onDeleteMemo={handleDeleteMemo}
        onCreateNew={handleCreateNew}
      />
      <MemoEditor
        memo={isCreatingNew ? null : selectedMemo}
        onSave={handleSaveMemo}
      />
    </div>
  );
}
