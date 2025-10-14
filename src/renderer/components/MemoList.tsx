/**
 * メモ一覧コンポーネント
 * メモのリストを表示し、選択・削除のイベントを処理
 */

import type { Memo } from "../../shared/types";

interface MemoListProps {
  memos: Memo[];
  selectedMemoId: number | null;
  onSelectMemo: (id: number) => void;
  onDeleteMemo: (id: number) => void;
  onCreateNew: () => void;
}

export function MemoList({
  memos,
  selectedMemoId,
  onSelectMemo,
  onDeleteMemo,
  onCreateNew,
}: MemoListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="memo-list">
      <div className="memo-list-header">
        <h2>メモ一覧</h2>
        <button className="btn-new" onClick={onCreateNew}>
          + 新規メモ
        </button>
      </div>
      <div className="memo-items">
        {memos.length === 0 ? (
          <p className="empty-message">メモがありません</p>
        ) : (
          memos.map((memo) => (
            <div
              key={memo.id}
              className={`memo-item ${
                selectedMemoId === memo.id ? "selected" : ""
              }`}
              onClick={() => onSelectMemo(memo.id)}
            >
              <div className="memo-preview">
                {memo.content.substring(0, 50)}
                {memo.content.length > 50 ? "..." : ""}
              </div>
              <div className="memo-meta">
                <span className="memo-date">{formatDate(memo.updatedAt)}</span>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("このメモを削除しますか?")) {
                      onDeleteMemo(memo.id);
                    }
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
