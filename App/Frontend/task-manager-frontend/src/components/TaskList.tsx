import React, { useState } from 'react';
import { useTasks, type TaskDTO, type Priority } from '../hooks/useTasks';

const TaskList: React.FC = () => {
    const { tasks, statuses, categories, isLoading, error, updateTask, createTask, deleteTask, createCategory, deleteCategory } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        id: null as number | null,
        title: '',
        description: '',
        statusId: 1,
        categoryId: 1,
        priority: 'LOW' as Priority,
        dueDate: '',
        createdDate: '',
        updatedDate: '',
    });
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const openAddModal = () => {
        setFormData({
            id: null, title: '', description: '',
            statusId: 1, categoryId: '' as any, priority: 'LOW', dueDate: '',
            createdDate: '',
            updatedDate: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (task: TaskDTO) => {
        setFormData({
            id: task.taskId,
            title: task.title,
            description: task.description,
            statusId: task.status.id,
            categoryId: task.category?.id ?? '' as any,
            priority: task.priority,
            dueDate: task.dueDate.replace(' ', 'T').substring(0, 16),
            createdDate: task.createdDate,
            updatedDate: task.updatedDate,
        });
        setIsModalOpen(true);
    };

    const formatFullDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim() || !createCategory) return;

        const result = await createCategory({ name: newCategoryName.trim() });

        if (result.success) {
            setNewCategoryName('');
        }
    };

    const handleDeleteCategory = async (categoryId: number) => {
        if (!deleteCategory) return;
        if (window.confirm('Czy na pewno chcesz usunąć tę kategorię?')) {
            await deleteCategory(categoryId);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let datePart = formData.dueDate.replace('T', ' ');
        if (datePart.length === 16) datePart += ":00";

        const payload = {
            title: formData.title,
            description: formData.description,
            statusId: formData.statusId,
            priority: formData.priority,
            dueDate: datePart,
            categoryId: (formData.categoryId === 0 || !formData.categoryId) ? null : Number(formData.categoryId)
        };

        const result = formData.id
            ? await updateTask(formData.id, payload)
            : await createTask(payload);

        if (result.success) setIsModalOpen(false);
    };

    const handleDeleteTaskFromModal = async () => {
        if (!formData.id || !deleteTask) return;

        if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
            const result = await deleteTask(formData.id);
            setIsModalOpen(false);
        }
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
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-all border border-slate-700 flex items-center gap-2"
                    >
                        Kategorie
                    </button>
                    <button
                        onClick={openAddModal}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                    >
                        <span className="text-xl leading-none">+</span> Nowe zadanie
                    </button>
                </div>
            </div>
            {/* Manage categories modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-left">

                        {/* Close button */}
                        <button
                            onClick={() => { setIsCategoryModalOpen(false); setNewCategoryName(''); }}
                            className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-sm font-bold"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-white mb-4">Zarządzaj kategoriami</h2>

                        {/* Categories list */}
                        <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-1 custom-scrollbar">
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <div key={cat.id} className="flex justify-between items-center bg-slate-800/50 border border-slate-800 rounded-xl px-4 py-2.5">
                                        <span className="text-sm font-medium text-slate-200">{cat.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                                            title="Usuń kategorię"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm italic text-slate-500 text-center py-2">Brak utworzonych kategorii</p>
                            )}
                        </div>

                        {/* Add new category at bottom */}
                        <form onSubmit={handleCreateCategory} className="border-t border-slate-800 pt-4 flex gap-2">
                            <input
                                type="text"
                                required
                                placeholder="Nazwa nowej kategorii..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors whitespace-nowrap flex items-center justify-center"
                            >
                                +
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Grouping */}
            {statuses.map((status) => {
                const tasksInStatus = tasks.filter(t => t.status.id === status.id);

                return (
                    <div key={status.id} className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-center gap-3 pb-2 border-b"
                            style={{ borderColor: status.color }}
                        >
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
                                            <div className="flex gap-2 items-center">
                                                {/* Priority */}
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${PRIORITY_MAP[task.priority].class}`}>
                                                    {PRIORITY_MAP[task.priority].label}
                                                </span>

                                                {/* Category */}
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                                                    {task.category?.name ?? "Brak kategorii"}
                                                </span>
                                            </div>

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
                    <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-left">
                        {/* Delete task button */}
                        {formData.id && (
                            <button
                                type="button"
                                onClick={handleDeleteTaskFromModal}
                                className="absolute top-8 right-8 p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                                title="Usuń zadanie"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        )}

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
                            <div>
                                <label className="text-xs text-slate-400 ml-1">Kategoria</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                                    value={formData.categoryId || ''}
                                    onChange={e => setFormData({
                                        ...formData,
                                        categoryId: e.target.value === '' ? null as any : parseInt(e.target.value) // set null if no category
                                    })}
                                >
                                    {/* No category */}
                                    <option value="">-- Brak kategorii --</option>

                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
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
                            {/* Created and modified date */}
                            {formData.id && (
                                <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-[11px] text-slate-500">
                                    <div>
                                        <span className="block font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Utworzono:</span>
                                        <span className="font-mono">{formatFullDate(formData.createdDate)}</span>
                                    </div>
                                    <div>
                                        <span className="block font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Ostatnia modyfikacja:</span>
                                        <span className="font-mono">{formatFullDate(formData.updatedDate)}</span>
                                    </div>
                                </div>
                            )}

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