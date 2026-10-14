import React, { useState, type FormEvent } from "react";

interface CreateTaskProps {
  onCreate: (description: string) => Promise<void>;
}

export default function CreateTask({ onCreate }: CreateTaskProps) {
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [createError, setCreateError] = useState<string>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setCreateError(undefined);

    try {
      await onCreate(description);
      setDescription("");
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Could not create task",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <h2>Create new task</h2>

      <div
        className={editing || creating ? "create-form editing" : "create-form"}
      >
        <div className="overlay" />

        <form
          onSubmit={handleSubmit}
          onFocus={() => setEditing(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setEditing(false);
            }
          }}
        >
          <div className="input-with-spinner">
            <input
              required
              value={description}
              disabled={creating}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter a task..."
            />

            {creating && <span className="progress" />}
          </div>

          {createError && <div className="error">{createError}</div>}

          <button type="submit" disabled={creating}>
            Add task
          </button>
        </form>
      </div>
    </>
  );
}

/*
async function submitTask() {
    setCreating(true);
    var res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ description, completed: false }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    setCreating(false);
    if (res.ok) {
        (document.activeElement as HTMLElement)?.blur();
        await loadTasks();
    } else if (res.status >= 400 && res.status < 500) {
        setCreateError(await res.json());
    } else {
        setCreateError(`Error on create ${res.status} ${res.statusText}`);
    }
}

async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    await submitTask();
}*/
