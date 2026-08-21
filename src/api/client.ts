import { getAcceptLanguage } from '@/config/language';
import router from '@/router';
import { useErrorStore } from '@/stores/errorStore';

const BASE_URL = import.meta.env.VITE_URL_API || 'http://localhost:8700/api';

function handleUnauthorized(status: number) {
  if (status === 401) {
    localStorage.removeItem('token');
    const path =
      router.currentRoute.value?.path || window.location.pathname || '';
    const isRegisterPage = path.includes('register') || path.includes('signup');
    const isLoginPage = path.includes('login') || path.includes('signin');
    if (!(isRegisterPage || isLoginPage)) {
      router.push('/auth/login');
    }
  }
}

async function parseErrorResponse(response: Response): Promise<string> {
  let errorMsg = response.statusText;
  try {
    const errJson = await response.json();
    errorMsg = errJson.message || errJson.error || errorMsg;
  } catch {
    // Ignore json parse error
  }
  return errorMsg;
}

async function request(
  url: string,
  method: string,
  data?: unknown,
  config?: {
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
  },
) {
  const token = localStorage.getItem('token');
  const isFormData = data instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    'Accept-Language': getAcceptLanguage(),
    ...(config?.headers ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Handle absolute vs relative URL
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  const options: RequestInit = {
    method,
    headers,
  };

  if (data && method !== 'GET' && method !== 'HEAD') {
    options.body = isFormData ? data : JSON.stringify(data);
  }

  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    handleUnauthorized(response.status);
    const errorMsg = await parseErrorResponse(response);
    const fallback = `Request failed with status ${response.status}`;
    const message = errorMsg || fallback;
    // Surface backend errors to the user on every page via the global toasts
    if (response.status !== 401) {
      useErrorStore().showError(message);
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await response.json();
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const apiClient = {
  get(url: string, config?: any) {
    let fullUrl = url;
    if (config?.params) {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(config.params)) {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      }
      const queryString = query.toString();
      if (queryString) {
        fullUrl += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return request(fullUrl, 'GET', undefined, config);
  },
  post(url: string, data?: any, config?: any) {
    return request(url, 'POST', data, config);
  },
  put(url: string, data?: any, config?: any) {
    return request(url, 'PUT', data, config);
  },
  patch(url: string, data?: any, config?: any) {
    return request(url, 'PATCH', data, config);
  },
  delete(
    url: string,
    data?: unknown,
    config?: {
      headers?: Record<string, string>;
      params?: Record<string, unknown>;
    },
  ) {
    return request(url, 'DELETE', data, config);
  },
};
