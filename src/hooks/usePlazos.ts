import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../infrastructure/api/apiClient';
import type { Plazo } from '../types';

export function usePlazos() {
  const queryClient = useQueryClient();

  const plazosQuery = useQuery<Plazo[]>({
    queryKey: ['plazos'],
    queryFn: () => apiFetch<Plazo[]>('/plazos'),
  });

  const addPlazoMutation = useMutation({
    mutationFn: (newPlazo: Omit<Plazo, 'id'>) =>
      apiFetch<Plazo>('/plazos', {
        method: 'POST',
        body: JSON.stringify(newPlazo),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plazos'] });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch<Plazo>(`/plazos/${id}/toggle`, {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plazos'] });
    },
  });

  return {
    plazos: plazosQuery.data || [],
    isLoading: plazosQuery.isLoading,
    isError: plazosQuery.isError,
    addPlazo: addPlazoMutation.mutateAsync,
    toggleComplete: toggleCompleteMutation.mutateAsync,
  };
}
