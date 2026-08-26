"use client";

import { useEffect, useState } from "react";
import styles from "./ScheduleDetailsModal.module.css";

export default function ScheduleDetailsModal({
  open,
  schedule,
  technicians,
  onClose,
  onStartProve,
  onEdit,
  onDelete,
}) {
    const [editing, setEditing] = useState(false);

const [editedSchedule, setEditedSchedule] = useState(schedule);

useEffect(() => {
  setEditedSchedule(schedule);
  setEditing(false);
}, [schedule]);
function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
  if (!open || !schedule) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <h2>Schedule Details</h2>

        <div className={styles.grid}>

          <div>
            <strong>Meter</strong>
            <span>{schedule.meterTag}</span>
          </div>

          <div>
            <strong>Location</strong>
            <span>{schedule.location}</span>
          </div>

         <div>
  <strong>Technician</strong>

  {editing ? (
    <select
      value={editedSchedule.technician_id || ""}
      onChange={(e) =>
        setEditedSchedule({
          ...editedSchedule,
          technician_id: e.target.value,
        })
      }
    >
      <option value="">Select Technician</option>

      {technicians.map((tech) => (
        <option key={tech.id} value={tech.id}>
          {tech.name}
        </option>
      ))}
    </select>
  ) : (
    <span>{schedule.technician || "Unassigned"}</span>
  )}
</div>

          <div>
  <strong>Date</strong>

  {editing ? (
    <input
      type="date"
      value={editedSchedule.scheduled_date || ""}
      onChange={(e) =>
        setEditedSchedule({
          ...editedSchedule,
          scheduled_date: e.target.value,
        })
      }
    />
  ) : (
    <span>{formatDate(schedule.scheduled_date)}</span>
  )}
</div>

          <div>
  <strong>Time</strong>

  {editing ? (
    <input
      type="time"
      value={editedSchedule.scheduled_time || ""}
      onChange={(e) =>
        setEditedSchedule({
          ...editedSchedule,
          scheduled_time: e.target.value,
        })
      }
    />
  ) : (
    <span>{formatTime(schedule.scheduled_time)}</span>
  )}
</div>

 <div>
  <strong>Status</strong>

  <span
    style={{
      display: "inline-block",
      marginTop: "6px",
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "700",
      background:
        schedule.status === "Completed"
          ? "#dcfce7"
          : schedule.status === "Cancelled"
          ? "#fee2e2"
          : schedule.status === "In Progress"
          ? "#fef3c7"
          : "#dbeafe",
      color:
        schedule.status === "Completed"
          ? "#166534"
          : schedule.status === "Cancelled"
          ? "#991b1b"
          : schedule.status === "In Progress"
          ? "#92400e"
          : "#1e40af",
    }}
  >
    {schedule.status}
  </span>
</div>

        </div>

        <div className={styles.notes}>

          <strong>Dispatcher Notes</strong>

{editing ? (
  <textarea
    rows={4}
    value={editedSchedule.notes || ""}
    onChange={(e) =>
      setEditedSchedule({
        ...editedSchedule,
        notes: e.target.value,
      })
    }
  />
) : (
  <p>
    {schedule.notes || "No notes entered."}
  </p>
)}

        </div>

        <div className={styles.buttons}>

          {schedule.status === "Completed" ? (
  <div
    style={{
      padding: "10px 16px",
      borderRadius: "8px",
      background: "#dcfce7",
      color: "#166534",
      fontWeight: "700",
    }}
  >
    ✓ Prove Completed
  </div>
) : (
  <button
    className={styles.primary}
    onClick={onStartProve}
  >
    ▶ Start Prove
  </button>
)}

  {editing ? (
  <>
    <button
      className={styles.primary}
      onClick={() => onEdit(editedSchedule)}
    >
      💾 Save Changes
    </button>

    <button
      className={styles.cancel}
      onClick={() => {
        setEditedSchedule(schedule);
        setEditing(false);
      }}
    >
      Cancel
    </button>
  </>
) : (
  <button
    className={styles.secondary}
    onClick={() => setEditing(true)}
  >
    ✏ Edit
  </button>
)}

          <button
            className={styles.danger}
            onClick={onDelete}
          >
            🗑 Delete
          </button>

          <button
            className={styles.cancel}
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}