/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/utils/axios";
import { useCallback, useState } from "react";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

interface MutationCallbacks<TData = any> {
  onError?: (error: AxiosError, variables: any) => void;
  onMutate?: (variables: any) => void;
  onSuccess?: (data: TData, variables: any) => void;
  onSettled?: (variables: any) => void;
}

export function useMutation<TData = any>({
  mutationFn,
  onError,
  onMutate,
  onSuccess,
  onSettled,
}: MutationCallbacks<TData> & {
  mutationFn: (variables: any) => AxiosRequestConfig;
}) {
  const [state, setState] = useState<{
    data: TData | null;
    isMutating: boolean;
    isError: boolean;
    error: AxiosError | null;
  }>({
    data: null,
    isMutating: false,
    isError: false,
    error: null,
  });

  const mutate = useCallback(
    async (data?: any) => {
      onMutate?.(data);

      setState((prev) => ({ ...prev, isMutating: true, isError: false }));

      try {
        const response: AxiosResponse<TData> = await api.request(
          mutationFn(data)
        );

        setState({
          data: response.data,
          isMutating: false,
          isError: false,
          error: null,
        });

        onSuccess?.(response.data, data);

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;

        setState({
          data: null,
          isMutating: false,
          isError: true,
          error: axiosError,
        });

        onError?.(axiosError, data);

        throw error;
      } finally {
        onSettled?.(data);
      }
    },
    [mutationFn, onError, onMutate, onSuccess, onSettled]
  );

  return { ...state, mutate };
}
