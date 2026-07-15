import router from '@/router';

const BASE_URL = import.meta.env.VITE_URL_API || 'http://localhost:8700/api';

async function request(url: string, method: string, data?: any, config?: any) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config?.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle absolute vs relative URL
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  const options: RequestInit = {
    method,
    headers,
  };

  if (data && method !== 'GET' && method !== 'HEAD') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      const path =
        router.currentRoute.value?.path || window.location.pathname || '';
      const isRegisterPage =
        path.includes('register') || path.includes('signup');
      const isLoginPage = path.includes('login') || path.includes('signin');
      if (!(isRegisterPage || isLoginPage)) {
        router.push('/auth/login');
      }
    }

    let errorMsg = response.statusText;
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errJson.error || errorMsg;
    } catch (_) {}
    throw new Error(
      errorMsg || `Request failed with status ${response.status}`,
    );
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (_) {
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
  delete(url: string, config?: any) {
    return request(url, 'DELETE', undefined, config);
  },
};
