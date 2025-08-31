import React, { useEffect, useState, useMemo } from 'react'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchTasks() {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/tasks`)
      if (!res.ok) throw new Error('Failed to fetch tasks')
      const data = await res.json()
      setTasks(data)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  async function addTask(title) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (!res.ok) return alert('Failed to add task')
    const created = await res.json()
    setTasks(prev => [created, ...prev])
  }

  async function deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) return alert('Failed to delete task')
    setTasks(prev => prev.filter(t => t._id !== id))
  }

  async function toggleTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'PATCH' })
    if (!res.ok) return alert('Failed to update task')
    const updated = await res.json()
    setTasks(prev => prev.map(t => (t._id === id ? updated : t)))
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    return { total, completed, pending: total - completed }
  }, [tasks])

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">TaskFlow Manager</h1>
          <p className="text-sm text-gray-600">Manage your daily tasks with a clean, responsive UI.</p>
        </header>

        <section className="mb-6 grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl shadow bg-white">
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </div>
          <div className="p-4 rounded-2xl shadow bg-white">
            <div className="text-xs text-gray-500">Completed</div>
            <div className="text-2xl font-semibold">{stats.completed}</div>
          </div>
          <div className="p-4 rounded-2xl shadow bg-white">
            <div className="text-xs text-gray-500">Pending</div>
            <div className="text-2xl font-semibold">{stats.pending}</div>
          </div>
        </section>

        <TaskForm onAdd={addTask} />

        <main className="mt-6">
          {loading ? (
            <div className="text-gray-600">Loading tasks…</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <TaskList tasks={tasks} onDelete={deleteTask} onToggle={toggleTask} />
          )}
        </main>
      </div>
    </div>
  )
}