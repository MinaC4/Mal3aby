import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'malaby_admin_token';
const USER_KEY = 'malaby_admin_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUsername(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function setStoredUsername(username: string): void {
  localStorage.setItem(USER_KEY, username);
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...(extra || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function onUnauthorized(): void {
  clearToken();
  window.dispatchEvent(new Event('malaby:unauthorized'));
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 401 || response.status === 403) {
    onUnauthorized();
    throw new Error('Unauthorized');
  }
  const result = await response.json().catch(() => ({} as Record<string, unknown>));
  if (!response.ok) {
    throw new Error((result as { message?: string }).message || `HTTP error: ${response.status}`);
  }
  if ((result as { success?: boolean }).success === false) {
    throw new Error((result as { message?: string }).message || 'Something went wrong');
  }
  return (result as { data: T }).data;
}

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
      const response = await fetch(`${API_BASE_URL}${url}`, { headers: authHeaders() });
      const result = await parseResponse<T>(response);
      setData(result);
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

export async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, { headers: authHeaders() });
  return parseResponse<T>(response);
}

export async function apiPost<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });
  return parseResponse<T>(response);
}

export async function apiPut<T>(url: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: body ? JSON.stringify(body) : undefined
  });
  return parseResponse<T>(response);
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return parseResponse<T>(response);
}

// Login does not use the stored token — it obtains one.
export async function apiLogin(username: string, password: string): Promise<{ token: string; username: string; expiresIn: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const result = await response.json().catch(() => ({} as Record<string, unknown>));
  if (!response.ok || (result as { success?: boolean }).success === false) {
    throw new Error((result as { message?: string }).message || 'Login failed');
  }
  return (result as { data: { token: string; username: string; expiresIn: string } }).data;
}
