import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../infrastructure/api/apiClient';
import type { Convenio } from '../types';

export function useConvenios() {
  const queryClient = useQueryClient();

  const conveniosQuery = useQuery<Convenio[]>({
    queryKey: ['convenios'],
    queryFn: () => apiFetch<Convenio[]>('/convenios'),
  });

  const addConvenioMutation = useMutation({
    mutationFn: (newConvenio: Omit<Convenio, 'id'>) =>
      apiFetch<Convenio>('/convenios', {
        method: 'POST',
        body: JSON.stringify(newConvenio),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convenios'] });
    },
  });

  const updateResultadoMutation = useMutation({
    mutationFn: ({ id, resultado }: { id: string; resultado: 'ACEPTADO' | 'EN TRÁMITE' }) =>
      apiFetch<Convenio>(`/convenios/${id}/resultado`, {
        method: 'PATCH',
        body: JSON.stringify({ resultado }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convenios'] });
    },
  });

  return {
    convenios: conveniosQuery.data || [],
    isLoading: conveniosQuery.isLoading,
    isError: conveniosQuery.isError,
    addConvenio: addConvenioMutation.mutateAsync,
    updateResultado: (id: string, resultado: 'ACEPTADO' | 'EN TRÁMITE') => updateResultadoMutation.mutateAsync({ id, resultado }),
  };
}
