import React, { useState } from 'react';
import { useTasks, type TaskDTO } from '../hooks/useTasks';

const TaskList: React.FC = () => {
    const { tasks, isLoading, error, updateTask } = useTasks();
    const [editingTask, setEditingTask] = useState<TaskDTO | null>(null);
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask) return;

        const payload = {
            title: editingTask.title,
            description: editingTask.description,
            statusId: editingTask.status.id,
            priority: editingTask.priority,
            dueDate: editingTask.dueDate.replace('T', ' ').substring(0, 19)
        };

        const result = await updateTask(editingTask.taskId, payload);
        if (result.success) setEditingTask(null);
    };

    const PRIORITY_MAP = {
        LOW: { label: 'Normalne', class: 'bg-slate-800 text-slate-400' },
        MEDIUM: { label: 'Ważne', class: 'bg-amber-500/10 text-amber-500' },
        HIGH: { label: 'Bardzo ważne', class: 'bg-red-500/10 text-red-500' },
    };

    if (isLoading) return <div className="text-slate-400 animate-pulse">Pobieranie zadań...</div>;
    if (error) return <div className="text-red-400 bg-red-500/10 p-4 rounded-xl">{error}</div>;
    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <div
                    key={task.taskId}
                    onClick={() => setEditingTask(task)}
                    className="cursor-pointer bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all shadow-sm"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: task.status.color }}
                                />
                                <h3 className="text-lg font-bold text-white leading-none">
                                    {task.title}
                                </h3>
                            </div>
                            <p className="text-slate-400 text-sm text-left ml-2">
                                {task.description}
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            {/* Priority Badge */}
                            <span className={`px-2 py-1 rounded text-[10px] font-black ${PRIORITY_MAP[task.priority].class}`}>
                                {PRIORITY_MAP[task.priority].label}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                                <span className="opacity-60">Termin:</span>
                                <span className="text-slate-300">
                                    {new Date(task.dueDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        </div>

                        {/* Status style */}
                        <div
                            className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800"
                            style={{ color: task.status.color }}
                        >
                            {task.status.name.toUpperCase()}
                        </div>
                    </div>
                </div>
            ))}
            {/* EDIT Modal */}
            {editingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-left">
                        <h2 className="text-xl font-bold text-white mb-6">Edytuj zadanie</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 ml-1">Tytuł</label>
                                <input
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                                    value={editingTask.title}
                                    onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 ml-1">Opis</label>
                                <textarea
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 h-24"
                                    value={editingTask.description}
                                    onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 ml-1">Priorytet</label>
                                    <select
                                        className={`w-full border border-slate-700 rounded-xl px-4 py-2 outline-none transition-colors ${PRIORITY_MAP[editingTask.priority].class}`}
                                        value={editingTask.priority}
                                        onChange={e => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                                    >
                                        {Object.entries(PRIORITY_MAP).map(([key, value]) => (
                                            <option key={key} value={key} className="bg-slate-900 text-white">
                                                {value.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 ml-1">Termin</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none"
                                        value={editingTask.dueDate.substring(0, 16)}
                                        onChange={e => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={() => setEditingTask(null)} className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all">
                                    Anuluj
                                </button>
                                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all">
                                    Zapisz zmiany
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;