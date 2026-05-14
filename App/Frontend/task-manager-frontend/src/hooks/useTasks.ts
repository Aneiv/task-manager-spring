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
  }, [fetchTasks]);

  return { tasks, isLoading, error, refetch: fetchTasks };
};
