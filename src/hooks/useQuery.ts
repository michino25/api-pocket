/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/utils/axios";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useState, useEffect, useCallback } from "react";

interface QueryState<TData = any> {
  data: TData | null;
  isLoading: boolean;
  isError: boolean;
  error: AxiosError | null;
}

interface UseQueryParams {
  url: string;
  config?: AxiosRequestConfig;
  enabled?: boolean;
  queryKey?: any[];
}

export function useQuery<TData = any>({
  url,
  config,
  enabled = true,
  queryKey = [],
}: UseQueryParams) {
  const [state, setState] = useState<QueryState<TData>>({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, isError: false }));
    try {
      const response: AxiosResponse<TData> = await api.get(url, config);
      setState({
        data: response.data,
        isLoading: false,
        isError: false,
        error: null,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      setState({
        data: null,
        isLoading: false,
        isError: true,
        error: axiosError,
      });
    }
  }, [url, config]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...queryKey]);

  const refetch = () => fetchData();

  return { ...state, refetch };
}
