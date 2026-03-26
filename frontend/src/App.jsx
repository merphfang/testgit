import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = '/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  // ── Fetch all todos on mount ──────────────────────────────────────────────
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Is the backend running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ── Add a new todo ────────────────────────────────────────────────────────
  async function handleAdd(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    setAdding(true);
    setError(null);
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, isCompleted: false }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const created = await res.json();
      setTodos((prev) => [...prev, created]);
      setNewTitle('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error(err);
    } finally {
      setAdding(false);
    }
  }

  // ── Toggle isCompleted ────────────────────────────────────────────────────
  async function handleToggle(todo) {
    const updated = { ...todo, isCompleted: !todo.isCompleted };
    // Optimistic update
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));

    try {
      const res = await fetch(`${API_BASE}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const saved = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
    } catch (err) {
      // Roll back on failure
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
      setError('Failed to update todo. Please try again.');
      console.error(err);
    }
  }

  // ── Delete a todo ─────────────────────────────────────────────────────────
  async function handleDelete(id) {
    // Optimistic update
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
    } catch (err) {
      // Re-fetch to restore correct state on failure
      fetchTodos();
      setError('Failed to delete todo. Please try again.');
      console.error(err);
    }
  }

  // ── Derived stats ─────────────────────────────────────────────────────────
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const totalCount = todos.length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app-container">
      <h1>Todo List</h1>

      {/* Add form */}
      <form className="add-todo-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={adding}
        />
        <button className="btn-add" type="submit" disabled={adding || !newTitle.trim()}>
          {adding ? 'Adding…' : 'Add'}
        </button>
      </form>

      {/* Error message */}
      {error && <div className="message error">{error}</div>}

      {/* Loading */}
      {loading && <div className="message loading">Loading todos…</div>}

      {/* Stats */}
      {!loading && (
        <div className="status-bar">
          <span>{totalCount} {totalCount === 1 ? 'item' : 'items'} total</span>
          <span>{completedCount} completed</span>
        </div>
      )}

      {/* Todo list */}
      {!loading && (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty-state">No todos yet — add one above!</li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className={`todo-item${todo.isCompleted ? ' completed' : ''}`}>
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.isCompleted}
                  onChange={() => handleToggle(todo)}
                />
                <span className="todo-title">{todo.title}</span>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(todo.id)}
                  aria-label={`Delete "${todo.title}"`}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
