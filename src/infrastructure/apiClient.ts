import { API_CONFIG } from './apiConfig';

/**
 * Shared API Client
 * This is a lightweight class wrapper around the standard 'fetch' for common JSON-based requests.
 * Simplifies repetitive tasks like setting headers and parsing responses.
 * Now supports automatic token refreshing and cookie-based authentication.
 */
class ApiClient {
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  /**
   * Generic request method
   * @param {string} endpoint - The path relative to the base URL (e.g., '/auth/login')
   * @param {RequestInit} [options] - Standard fetch options
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      ...(localStorage.getItem('accessToken') ? {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      } : {}),
      ...(options.headers as Record<string, string>),
    };

    let body = options.body;

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Centered Mocking logic: Inject useMock if enabled in environment
    if (API_CONFIG.USE_MOCK && 
        options.method !== 'GET' && 
        options.method !== 'DELETE' && 
        !(options.body instanceof FormData)) {
      
      try {
        let bodyObj: any = {};
        if (typeof options.body === 'string') {
          bodyObj = JSON.parse(options.body);
        } else if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
          bodyObj = (options.body as unknown) as Record<string, unknown>;
        }

        if (typeof bodyObj === 'object' && bodyObj !== null) {
          bodyObj.useMock = true;
          body = JSON.stringify(bodyObj);
        }
      } catch (e) {
        console.warn('Failed to inject useMock into request body', e);
      }
    }

    const response = await fetch(url, {
      credentials: 'include', // Bắt buộc để gửi/nhận HTTP-only Cookie
      ...options,
      body,
      headers,
    });

    // Check if the response is a JSON or something else (like Vercel Challenge HTML)
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      const isAuthPath = endpoint.includes('/auth/login') || 
                         endpoint.includes('/auth/google') || 
                         endpoint.includes('/auth/logout') || 
                         endpoint.includes('/auth/refresh');

      // 401 UNAUTHORIZED -> Try to refresh token if it's not an auth attempt
      if (response.status === 401 && !isAuthPath) {
        const newAccessToken = await this.refreshToken();
        if (newAccessToken) {
          // Retry the original request with the new token
          return this.request<T>(endpoint, options);
        }
      }

      // If it is an auth path, or if refreshToken above failed, handle logout
      // ONLY for 401. For 403 (Forbidden), we just throw the error without logging out.
      if (response.status === 401 && !isAuthPath) {
        this.logout('session_expired');
        return null as unknown as T;
      }

      // SAFELY parse error data
      let errorMessage = `Request failed with status ${response.status}`;
      
      if (response.status === 413) {
        errorMessage = "FILE_TOO_LARGE: The uploaded file is too large for the server.";
      }

      if (isJson) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Fallback if JSON parsing fails despite the header
        }
      } else {
        // Handle Vercel Security Challenge or other HTML errors
        const text = await response.text().catch(() => '');
        if (text.includes('Challenge') || text.includes('security') || text.includes('checking your browser')) {
          errorMessage = "SECURITY_CHALLENGE_REQUIRED: Please refresh the page and complete the verification.";
        }
      }
      
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null as unknown as T;
    
    // Ensure we only try to parse JSON if the response claims to be JSON
    if (isJson) {
      return response.json();
    } else {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        // If it's not JSON but was successful (200 OK), return as is or as object
        return text as unknown as T;
      }
    }
  }

  /**
   * Refreshes the access token using the refresh token stored in httpOnly cookie
   */
  private async refreshToken(): Promise<string | null> {
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const url = `${API_CONFIG.BASE_URL}/auth/refresh`;
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            return data.accessToken;
          }
        }
        
        // If refresh fails (401 from /auth/refresh or other error)
        this.logout('session_expired');
        return null;
      } catch (error) {
        this.logout('session_expired');
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Clears auth data and redirects to landing page
   */
  public logout(reason?: string): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    if (reason) {
      localStorage.setItem('clique_logout_reason', reason);
    }
    // Dispatch event to notify AuthProvider
    window.dispatchEvent(new CustomEvent('clique:logout', { detail: { reason } }));
  }

  get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  put<T>(endpoint: string, body: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  patch<T>(endpoint: string, body: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  postForm<T>(endpoint: string, formData: FormData, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData
    });
  }
}

export const apiClient = new ApiClient();
