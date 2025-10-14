/**
 * メモ編集コンポーネント
 * メモの内容を編集し、保存する
 */

import { useState, useEffect } from "react";
import type { Memo } from "../../shared/types";

interface MemoEditorProps {
  memo: Memo | null;
  onSave: (id: number | null, content: string) => void;
}

export function MemoEditor({ memo, onSave }: MemoEditorProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(memo?.content ?? "");
  }, [memo]);

  const handleSave = () => {
    if (content.trim()) {
      onSave(memo?.id ?? null, content);
    }
  };

  return (
    <div className="memo-editor">
      <div className="editor-header">
        <h2>{memo ? "メモを編集" : "新規メモ"}</h2>
        <button className="btn-save" onClick={handleSave}>
          保存
        </button>
      </div>
      <textarea
        className="editor-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="メモを入力してください..."
      />
    </div>
  );
}
