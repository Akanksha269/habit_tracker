import { useState, useEffect } from "react";

const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

export default function Planner() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [habits, setHabits] = useState(
    JSON.parse(localStorage.getItem("planner")) || []
  );
  const [text, setText] = useState("");

  const days = daysInMonth(currentYear, currentMonth);
  const isCurrentMonth =
    currentYear === today.getFullYear() && currentMonth === today.getMonth();
  const currentDay = isCurrentMonth ? today.getDate() : null;

  useEffect(() => {
    localStorage.setItem("planner", JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!text) return;
    setHabits([...habits, { name: text, data: {} }]);
    setText("");
  };

  // Toggle only for today
  const toggle = (hi, d) => {
    if (!currentDay || d !== currentDay) return; // Only allow today
    const key = `${currentYear}-${currentMonth + 1}-${d}`;
    if (habits[hi].data[key]) return; // Already marked, cannot unmark
    habits[hi].data[key] = true;
    setHabits([...habits]);
  };

  const deleteHabit = (hi) => {
    const updated = habits.filter((_, index) => index !== hi);
    setHabits(updated);
  };

  const habitCompletionPercent = (h) => {
    const totalDays = days;
    let completed = 0;
    for (let d = 1; d <= totalDays; d++) {
      const key = `${currentYear}-${currentMonth + 1}-${d}`;
      if (h.data[key]) completed++;
    }
    return totalDays ? Math.round((completed / totalDays) * 100) : 0;
  };

  const dailyCompletionPercent = (d) => {
    if (habits.length === 0) return 0;
    let completedCount = 0;
    habits.forEach((h) => {
      const key = `${currentYear}-${currentMonth + 1}-${d}`;
      if (h.data[key]) completedCount++;
    });
    return Math.round((completedCount / habits.length) * 100);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="planner">
      {/* Month Switch */}
      <div className="month-switch">
        <button onClick={prevMonth}>&larr;</button>
        <h1>
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </h1>
        <button onClick={nextMonth}>&rarr;</button>
      </div>

      {/* Total Daily Progress Bar */}
      {currentDay && (
        <>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${dailyCompletionPercent(currentDay)}%` }}
            ></div>
          </div>
          <p className="progress-text">
            Today Progress: {dailyCompletionPercent(currentDay)}%
          </p>
        </>
      )}

      {/* Add Habit */}
      <div className="add">
        <input
          placeholder="New habit"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addHabit}>Add</button>
      </div>

      {/* Habit Grid */}
      <div className="grid">
        <div className="header-cell">Habit</div>
        {[...Array(days)].map((_, d) => (
          <div
            key={d}
            className={`day ${currentDay === d + 1 ? "today" : ""}`}
          >
            {d + 1}
          </div>
        ))}

        {habits.map((h, hi) => (
          <div key={hi} className="habit-row">
            <div className="habit-name">
              {h.name} ({habitCompletionPercent(h)}%)
              <button
                className="delete-btn"
                onClick={() => deleteHabit(hi)}
              >
                🗑
              </button>
            </div>
            {[...Array(days)].map((_, d) => {
              const key = `${currentYear}-${currentMonth + 1}-${d + 1}`;
              return (
                <div
                  key={d}
                  className={`cell ${h.data[key] ? "done" : ""} ${
                    currentDay === d + 1 ? "today-cell" : ""
                  }`}
                  onClick={() => toggle(hi, d + 1)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
