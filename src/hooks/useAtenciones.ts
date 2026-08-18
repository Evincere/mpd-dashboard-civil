import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../infrastructure/api/apiClient';
import type { AtencionPublico } from '../types';

export function useAtenciones() {
  const queryClient = useQueryClient();

  const atencionesQuery = useQuery<AtencionPublico[]>({
    queryKey: ['atenciones'],
    queryFn: () => apiFetch<AtencionPublico[]>('/atencion'),
  });

  const addAtencionMutation = useMutation({
    mutationFn: (newAtencion: Omit<AtencionPublico, 'id'>) =>
      apiFetch<AtencionPublico>('/atencion', {
        method: 'POST',
        body: JSON.stringify(newAtencion),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atenciones'] });
    },
  });

  return {
    atenciones: atencionesQuery.data || [],
    isLoading: atencionesQuery.isLoading,
    isError: atencionesQuery.isError,
    addAtencion: addAtencionMutation.mutateAsync,
  };
}
