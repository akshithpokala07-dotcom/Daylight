
import { useEffect, useState } from "react";
import "./App.css";

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function App() {
  const [activeTab, setActiveTab] = useState("tasks");

  // TASKS
  const [tasks, setTasks] = useState(() =>
    readStorage("daylight-tasks")
  );
  const [taskInput, setTaskInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("daylight-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();
    const title = taskInput.trim();
    if (!title) return;

    if (editingTaskId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTaskId ? { ...task, title } : task
        )
      );
      setEditingTaskId(null);
    } else {
      setTasks((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          title,
          completed: false,
          createdAt: new Date().toLocaleDateString(),
        },
      ]);
    }

    setTaskInput("");
  }

  function editTask(task) {
    setTaskInput(task.title);
    setEditingTaskId(task.id);
  }

  function deleteTask(id) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
    if (editingTaskId === id) {
      setEditingTaskId(null);
      setTaskInput("");
    }
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;

  // NOTES
  const [notes, setNotes] = useState(() =>
    readStorage("daylight-notes")
  );
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteCategory, setNoteCategory] = useState("Personal");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("daylight-notes", JSON.stringify(notes));
  }, [notes]);

  function resetNoteForm() {
    setNoteTitle("");
    setNoteBody("");
    setNoteCategory("Personal");
    setEditingNoteId(null);
  }

  function saveNote(event) {
    event.preventDefault();

    const title = noteTitle.trim();
    const body = noteBody.trim();

    if (!title || !body) return;

    const now = new Date().toISOString();

    if (editingNoteId !== null) {
      setNotes((previous) =>
        previous.map((note) =>
          note.id === editingNoteId
            ? {
                ...note,
                title,
                body,
                category: noteCategory,
                updatedAt: now,
              }
            : note
        )
      );
    } else {
      setNotes((previous) => [
        {
          id: crypto.randomUUID(),
          title,
          body,
          category: noteCategory,
          createdAt: now,
          updatedAt: now,
        },
        ...previous,
      ]);
    }

    resetNoteForm();
  }

  function editNote(note) {
    setNoteTitle(note.title);
    setNoteBody(note.body);
    setNoteCategory(note.category);
    setEditingNoteId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNote(id) {
    setNotes((previous) => previous.filter((note) => note.id !== id));

    if (editingNoteId === id) {
      resetNoteForm();
    }
  }

  const categories = [
    "All",
    "Personal",
    "Study",
    "Work",
    "Ideas",
  ];

  const visibleNotes = notes.filter((note) => {
    const query = search.toLowerCase();

    const matchesSearch =
      note.title.toLowerCase().includes(query) ||
      note.body.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "All" || note.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  function formatDate(date) {
    return new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="app">
      <header className="header">
        <p className="eyebrow">YOUR PERSONAL SPACE</p>
        <h1>Daylight<span>.</span></h1>
        <p className="subtitle">
          A little more organized, one day at a time.
        </p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === "tasks" ? "tab active" : "tab"}
          onClick={() => setActiveTab("tasks")}
        >
          ✓ Tasks
        </button>

        <button
          className={activeTab === "notes" ? "tab active" : "tab"}
          onClick={() => setActiveTab("notes")}
        >
          ✎ Notes
        </button>
      </nav>

      <section className="content">
        {activeTab === "tasks" ? (
          <>
            <div className="section-heading">
              <div>
                <h2>Your tasks</h2>
                <p>
                  {completedCount} of {tasks.length} completed
                </p>
              </div>
              <span className="task-count">{tasks.length} total</span>
            </div>

            <form className="task-form" onSubmit={addTask}>
              <input
                value={taskInput}
                onChange={(event) => setTaskInput(event.target.value)}
                placeholder="What needs to get done?"
                aria-label="Task title"
                required
              />

              <button className="primary-button" type="submit">
                {editingTaskId !== null ? "Save task" : "+ Add task"}
              </button>

              {editingTaskId !== null && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setEditingTaskId(null);
                    setTaskInput("");
                  }}
                >
                  Cancel
                </button>
              )}
            </form>

            <div className="filters">
              {["all", "pending", "completed"].map((option) => (
                <button
                  key={option}
                  className={
                    filter === option ? "filter active-filter" : "filter"
                  }
                  onClick={() => setFilter(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>

            <div className="task-list">
              {visibleTasks.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">✧</span>
                  <h3>{tasks.length === 0 ? "A fresh start" : "Nothing here yet"}</h3>
                  <p>Add a task or try another filter.</p>
                </div>
              ) : (
                visibleTasks.map((task) => (
                  <article className="task-item" key={task.id}>
                    <button
                      className={
                        task.completed ? "task-check checked" : "task-check"
                      }
                      onClick={() => toggleTask(task.id)}
                      aria-label="Toggle task completion"
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div className="task-details">
                      <p
                        className={
                          task.completed ? "task-title completed" : "task-title"
                        }
                      >
                        {task.title}
                      </p>
                      <span className="task-date">
                        Added {task.createdAt} ·{" "}
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </div>

                    <div className="task-actions">
                      <button onClick={() => editTask(task)}>Edit</button>
                      <button
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="section-heading">
              <div>
                <h2>Your notes</h2>
                <p>Little thoughts, saved for later.</p>
              </div>
              <span className="task-count">{notes.length} notes</span>
            </div>

            <form className="note-form" onSubmit={saveNote}>
              <label htmlFor="note-title">Title</label>
              <input
                id="note-title"
                value={noteTitle}
                onChange={(event) => setNoteTitle(event.target.value)}
                placeholder="Give your note a title..."
                maxLength={100}
                required
              />

              <label htmlFor="note-body">Your note</label>
              <textarea
                id="note-body"
                value={noteBody}
                onChange={(event) => setNoteBody(event.target.value)}
                placeholder="Write down what's on your mind..."
                rows={5}
                required
              />

              <label htmlFor="note-category">Category</label>
              <select
                id="note-category"
                value={noteCategory}
                onChange={(event) => setNoteCategory(event.target.value)}
              >
                {categories
                  .filter((category) => category !== "All")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              <div className="note-form-actions">
                <button className="primary-button" type="submit">
                  {editingNoteId !== null ? "Save changes" : "+ Save note"}
                </button>

                {editingNoteId !== null && (
                  <button
                    className="cancel-button"
                    type="button"
                    onClick={resetNoteForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="notes-toolbar">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your notes..."
                aria-label="Search notes"
              />

              <div className="filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={
                      categoryFilter === category
                        ? "filter active-filter"
                        : "filter"
                    }
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="notes-grid">
              {visibleNotes.length === 0 ? (
                <div className="empty-state notes-empty">
                  <span className="empty-icon">✎</span>
                  <h3>{notes.length === 0 ? "Your page is waiting" : "No matching notes"}</h3>
                  <p>
                    {notes.length === 0
                      ? "Create your first note above."
                      : "Try a different search or category."}
                  </p>
                </div>
              ) : (
                visibleNotes.map((note) => (
                  <article className="note-card" key={note.id}>
                    <div className="note-card-top">
                      <span className="note-category">{note.category}</span>
                      <div className="note-card-actions">
                        <button
                          onClick={() => editNote(note)}
                          aria-label={`Edit ${note.title}`}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteNote(note.id)}
                          aria-label={`Delete ${note.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <h3>{note.title}</h3>
                    <p className="note-card-body">{note.body}</p>

                    <div className="note-timestamp">
                      <span>Created {formatDate(note.createdAt)}</span>
                      {note.updatedAt !== note.createdAt && (
                        <span>Edited {formatDate(note.updatedAt)}</span>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </>
        )}
      </section>

      <footer className="footer">
        Made for a calmer, more organized day.
      </footer>
    </main>
  );
}

export default App;
