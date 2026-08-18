import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../infrastructure/api/apiClient';
import type { TareaDiaria, EstadoTarea } from '../types';

export function useTareas() {
  const queryClient = useQueryClient();

  const tareasQuery = useQuery<TareaDiaria[]>({
    queryKey: ['tareas'],
    queryFn: () => apiFetch<TareaDiaria[]>('/tareas'),
  });

  const addTaskMutation = useMutation({
    mutationFn: (newTask: Omit<TareaDiaria, 'id'>) =>
      apiFetch<TareaDiaria>('/tareas', {
        method: 'POST',
        body: JSON.stringify(newTask),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoTarea }) =>
      apiFetch<TareaDiaria>(`/tareas/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });

  return {
    tareas: tareasQuery.data || [],
    isLoading: tareasQuery.isLoading,
    isError: tareasQuery.isError,
    addTask: addTaskMutation.mutateAsync,
    updateStatus: (id: string, estado: EstadoTarea) => updateStatusMutation.mutateAsync({ id, estado }),
  };
}
