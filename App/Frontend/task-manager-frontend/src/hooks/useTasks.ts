import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface StatusDTO {
  id: number;
  name: string;
  color: string;
}

export interface TaskDTO {
  taskId: number;
  title: string;
  description: string;
  status: StatusDTO;
  priority: Priority;
  createdDate: string;
  dueDate: string;
  updatedDate: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<TaskDTO[]>("/tasks");
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Błąd podczas pobierania zadań");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStatuses();
  }, [fetchTasks]);

  const updateTask = async (id: number, updatedData: any) => {
    try {
      await api.put(`/tasks/${id}`, updatedData);

      await fetchTasks();

      return { success: true };
    } catch (err: any) {
      console.error("Błąd podczas aktualizacji:", err);
      return {
        success: false,
        error:
          err.response?.data?.message || "Nie udało się zaktualizować zadania",
      };
    }
  };

  const [statuses, setStatuses] = useState<StatusDTO[]>([]);

  const fetchStatuses = useCallback(async () => {
    try {
      const response = await api.get<StatusDTO[]>("/status");
      setStatuses(response.data);
    } catch (err) {
      console.error("Błąd pobierania statusów:", err);
    }
  }, []);

  const createTask = async (newTaskData: any) => {
    try {
      await api.post("/tasks", newTaskData);
      await fetchTasks();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Błąd podczas tworzenia zadania",
      };
    }
  };

  return {
    tasks,
    statuses,
    isLoading,
    error,
    refetch: fetchTasks,
    updateTask,
    createTask,
  };
};
