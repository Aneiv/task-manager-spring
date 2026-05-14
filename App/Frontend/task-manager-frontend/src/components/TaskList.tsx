import React, { useState } from 'react';
import { useTasks, type TaskDTO, type Priority } from '../hooks/useTasks';

const TaskList: React.FC = () => {
    const { tasks, statuses, isLoading, error, updateTask, createTask } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null as number | null,
        title: '',
        description: '',
        statusId: 1,
        priority: 'LOW' as Priority,
        dueDate: ''
    });

    const openAddModal = () => {
        setFormData({ id: null, title: '', description: '', statusId: 1, priority: 'LOW', dueDate: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (task: TaskDTO) => {
        setFormData({
            id: task.taskId,
            title: task.title,
            description: task.description,
            statusId: task.status.id,
            priority: task.priority,
            dueDate: task.dueDate.replace(' ', 'T').substring(0, 16)
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let datePart = formData.dueDate.replace('T', ' ');
        if (datePart.length === 16) datePart += ":00";

        const payload = { ...formData, dueDate: datePart };

        const result = formData.id
            ? await updateTask(formData.id, payload)
            : await createTask(payload);

        if (result.success) setIsModalOpen(false);
    };
    const PRIORITY_MAP = {
        LOW: { label: 'Normalne', class: 'bg-slate-800 text-slate-400', textColor: 'text-slate-400' },
        MEDIUM: { label: 'Ważne', class: 'bg-amber-500/10 text-amber-500', textColor: 'text-amber-500' },
        HIGH: { label: 'Bardzo ważne', class: 'bg-red-500/10 text-red-500', textColor: 'text-red-500' },
    };

    const handleStatusChange = (statusId: string) => {
        setFormData({
            ...formData,
            statusId: parseInt(statusId)
        });
    };

    if (isLoading) return <div className="text-slate-400 animate-pulse">Pobieranie zadań...</div>;
    if (error) return <div className="text-red-400 bg-red-500/10 p-4 rounded-xl">{error}</div>;

    return (
        <div className="flex flex-col gap-10"> {/* Main container */}

            {/* Header and add task button */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Moje Zadania</h1>
                <button
                    onClick={openAddModal}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                >
                    <span className="text-xl leading-none">+</span> Nowe zadanie
                </button>
            </div>

            {/* Grouping */}
            {statuses.map((status) => {
                const tasksInStatus = tasks.filter(t => t.status.id === status.id);

                return (
                    <div key={status.id} className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
                            <div
                                className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                style={{ backgroundColor: status.color }}
                            />
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                                {status.name}
                                <span className="ml-2 text-slate-600 font-bold">({tasksInStatus.length})</span>
                            </h2>
                        </div>

                        {/* Task grid */}
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {tasksInStatus.length > 0 ? (
                                tasksInStatus.map((task) => (
                                    <div
                                        key={task.taskId}
                                        onClick={() => openEditModal(task)}
                                        className="cursor-pointer bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between"
                                    >
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                                                {task.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm line-clamp-2">
                                                {task.description}
                                            </p>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${PRIORITY_MAP[task.priority].class}`}>
                                                {PRIORITY_MAP[task.priority].label}
                                            </span>
                                            <div className="text-[10px] text-slate-500 font-medium">
                                                {new Date(task.dueDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-600 text-xs italic py-2 ml-1">
                                    Brak zadań w tej kategorii
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            {/* EDIT / ADD Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-left">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {formData.id ? 'Edytuj zadanie' : 'Nowe zadanie'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="text-xs text-slate-400 ml-1">Tytuł</label>
                                <input
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs text-slate-400 ml-1">Opis</label>
                                <textarea
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 h-24 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Priority */}
                                <div>
                                    <label className="text-xs text-slate-400 ml-1">Priorytet</label>
                                    <select
                                        className={`w-full border border-slate-700 rounded-xl px-4 py-2 outline-none bg-slate-800 transition-colors font-bold ${PRIORITY_MAP[formData.priority].textColor}`}
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
                                    >
                                        {Object.entries(PRIORITY_MAP).map(([key, value]) => (
                                            <option key={key} value={key} className="bg-slate-900 text-white">
                                                {value.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="text-xs text-slate-400 ml-1">Status zadania</label>
                                    <select
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                                        style={{ borderLeft: `6px solid ${statuses.find(s => s.id === formData.statusId)?.color || '#1e293b'}` }}
                                        value={formData.statusId}
                                        onChange={e => setFormData({ ...formData, statusId: parseInt(e.target.value) })}
                                    >
                                        {statuses.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="text-xs text-slate-400 ml-1">Termin</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all"
                                >
                                    {formData.id ? 'Zapisz zmiany' : 'Utwórz zadanie'}
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