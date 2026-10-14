import React, { useEffect, useState } from "react";
import type { TaskItem } from "./taskItem.js";
import CreateTask from "./components/CreateTask.js";
import TaskList from "./components/TaskList.js";

export default function Application() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string>();
  const [updating, setUpdating] = useState(false);

  async function loadTasks() {
    setLoading(true);
    setLoadingError(undefined);

    try {
      const res = await fetch("/api/tasks");

      if (!res.ok) {
        throw new Error(`Error on load ${res.status} ${res.statusText}`);
      }

      const data: TaskItem[] = await res.json();
      setTasks(data);
    } catch (error) {
      setLoadingError(
        error instanceof Error ? error.message : "Could not load tasks",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function createTask(description: string) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    if (!res.ok) {
      let message = `Error pm create ${res.status}`;

      try {
        const data: { error?: string } = await res.json();
        message = data.error || message;
      } catch {
        //Keep the HTTP error message
      }

      throw new Error(message);
    }
    await loadTasks();
  }

  async function updateTask(id: number, delta: Partial<TaskItem>) {
    setUpdating(true);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(delta),
      });

      if (!res.ok) {
        throw new Error(`Error on update ${res.status}`);
      }

      await loadTasks();
    } catch (error) {
      setLoadingError(
        error instanceof Error ? error.message : "Could not update task",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <>
      <h1>Task manager</h1>

      <CreateTask onCreate={createTask} />

      <TaskList
        tasks={tasks}
        loading={loading}
        loadingError={loadingError}
        updating={updating}
        onUpdate={updateTask}
        onRetry={loadTasks}
      />
    </>
  );
}
