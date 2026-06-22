"use client";

export default function CalendarPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">
        Scheduling Calendar
      </h1>

      <div className="calendar-card">
        <h2>This Week</h2>

        <div className="calendar-item">
          <strong>Monday</strong>
          <p>Meter 75012.1 — Andrews County</p>
        </div>

        <div className="calendar-item">
          <strong>Tuesday</strong>
          <p>Meter 78022.1 — Lea County</p>
        </div>

        <div className="calendar-item">
          <strong>Wednesday</strong>
          <p>Meter 123456 — Eddy County</p>
        </div>
      </div>
    </div>
  );
}