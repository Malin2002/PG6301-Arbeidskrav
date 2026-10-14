import React from "react";
import type { TaskItem } from "../taskItem.js";

interface TaskListProps {
  tasks: TaskItem[];
  loading: boolean;
  loadingError: string | undefined;
  updating: boolean;
  onUpdate: (id: number, delta: Partial<TaskItem>) => Promise<void>;
  onRetry: () => Promise<void>;
}

export default function TaskList({
  tasks,
  loading,
  loadingError,
  updating,
  onUpdate,
  onRetry,
}: TaskListProps) {
  return (
    <>
      <h2>My tasks</h2>

      {loading && <div className="progress" />}

      {loadingError && (
        <div className="error">
          {loadingError}
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      {!loading && !loadingError && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  disabled={updating}
                  checked={task.completed}
                  onChange={(event) =>
                    onUpdate(task.id, {
                      completed: event.target.checked,
                    })
                  }
                />
                {task.description}
              </label>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
