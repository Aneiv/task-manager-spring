import React from 'react';
import { useTasks } from '../hooks/useTasks';

const TaskList: React.FC = () => {
  const { tasks, isLoading, error } = useTasks();

  if (isLoading) return <div className="text-slate-400 animate-pulse">Pobieranie zadań...</div>;
  if (error) return <div className="text-red-400 bg-red-500/10 p-4 rounded-xl">{error}</div>;
    return (
    <div className="space-y-4">
        {tasks.map((task) => (
        <div 
            key={task.taskId} 
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all shadow-sm"
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
                {/* Pririty Badge */}
                <span className={`px-2 py-1 rounded text-[10px] font-black ${
                task.priority === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-400'
                }`}>
                {task.priority}
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
    </div>
    );
};

export default TaskList;