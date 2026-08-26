"use client";

import styles from "./DeleteConfirmModal.module.css";

export default function DeleteConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.icon}>
          🗑
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className={styles.buttons}>

          <button
            className={styles.cancel}
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className={styles.delete}
            onClick={onConfirm}
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}