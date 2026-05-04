import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(url: string, options: UseApiOptions = { immediate: true }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.immediate ?? true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}${url}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Something went wrong');
      }
      
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, [fetchData, options.immediate]);

  return { data, loading, error, refetch: fetchData };
}

export async function apiPost<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Something went wrong');
  }
  
  return result.data;
}

export async function apiPut<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Something went wrong');
  }
  
  return result.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'DELETE'
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Something went wrong');
  }
  
  return result.data;
}
