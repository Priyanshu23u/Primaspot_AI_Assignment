import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const useApi = (queryKey, queryFn, options = {}) => {
  return useQuery({
    queryKey,
    queryFn,
    onError: (error) => {
      const message = error.response?.data?.message || 'Something went wrong'
      toast.error(message)
    },
    ...options,
  })
}

export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (options.successMessage) {
        toast.success(options.successMessage)
      }
      if (options.invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: options.invalidateQueries })
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Operation failed'
      toast.error(message)
    },
    ...options,
  })
}
