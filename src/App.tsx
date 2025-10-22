import { useMemo, useState } from 'react'

type Task = {
    id: string
    title: string
    completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

const initialTasks: Task[] = []

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [newTitle, setNewTitle] = useState('')
    const [filter, setFilter] = useState<Filter>('all')

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            if (filter === 'active') return !t.completed
            if (filter === 'completed') return t.completed
            return true
        })
    }, [tasks, filter])

    function addTask() {
        const title = newTitle.trim()
        if (!title) return
        const task: Task = {
            id: crypto.randomUUID(),
            title,
            completed: false,
        }
        setTasks(prev => [task, ...prev])
        setNewTitle('')
    }

    function toggleTask(id: string) {
        setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
    }

    function deleteTask(id: string) {
        setTasks(prev => prev.filter(t => t.id !== id))
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') addTask()
    }

    return (
        <div className="min-h-screen flex items-start justify-center p-4 sm:p-6">
            <div className="w-full max-w-2xl">
                <header className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Task Manager</h1>
                    <p className="text-gray-600 mt-1">Create, filter, and manage tasks in-memory.</p>
                </header>

                <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a new task"
                            className="flex-1 text-indigo-500 bg-transparent rounded-lg border border-gray-300 px-3.5 py-2.5 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            onClick={addTask}
                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Add
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {(['all', 'active', 'completed'] as Filter[]).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${filter === f
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {f[0].toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    <ul className="mt-6 divide-y divide-gray-200">
                        {filteredTasks.length === 0 && (
                            <li className="py-8 text-center text-gray-500">No tasks yet</li>
                        )}
                        {filteredTasks.map(task => (
                            <li key={task.id} className="py-3 flex items-center gap-3">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    aria-label={task.completed ? 'Mark as active' : 'Mark as completed'}
                                    className={`h-5 w-5 rounded border flex items-center justify-center ${task.completed ? 'bg-green-600 border-green-600' : 'border-gray-300'
                                        }`}
                                >
                                    {task.completed && (
                                        <span className="text-white text-xs">✓</span>
                                    )}
                                </button>
                                <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                    {task.title}
                                </span>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    )
}


