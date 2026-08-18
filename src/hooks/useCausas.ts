import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../infrastructure/api/apiClient';
import type { CausaIngreso } from '../types';

export function useCausas() {
  const queryClient = useQueryClient();

  const causasQuery = useQuery<CausaIngreso[]>({
    queryKey: ['causas'],
    queryFn: () => apiFetch<CausaIngreso[]>('/causas'),
  });

  const addCausaMutation = useMutation({
    mutationFn: (newCausa: Omit<CausaIngreso, 'id'>) =>
      apiFetch<CausaIngreso>('/causas', {
        method: 'POST',
        body: JSON.stringify(newCausa),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['causas'] });
    },
  });

  return {
    causas: causasQuery.data || [],
    isLoading: causasQuery.isLoading,
    isError: causasQuery.isError,
    addCausa: addCausaMutation.mutateAsync,
  };
}
