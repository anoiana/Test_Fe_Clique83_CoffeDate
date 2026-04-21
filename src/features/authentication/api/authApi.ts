import { apiClient } from '../../../infrastructure/apiClient';
import { User } from '../../../shared/types/models';

export interface SignupCredentials {
  email: string;
  fullName: string;
  password?: string;
}

export interface SignupResponse {
  userId: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  secretKey?: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface VerifyOtpResponse {
  accessToken: string;
}

/**
 * Infrastructure Layer: Authentication API Service
 * Handles communication with the backend through the shared apiClient.
 */
export const authApi = {
  /**
   * Register a new user
   */
  signup: (credentials: SignupCredentials): Promise<SignupResponse> => {
    return apiClient.post<SignupResponse>('/auth/signup', credentials);
  },

  /**
   * Verify registration OTP
   */
  verifyOtp: (userId: string, otp: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/verify-otp', { userId, otp });
  },

  /**
   * Login with email and password (and optional secretKey)
   */
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Login/Register with Google idToken
   */
  googleLogin: (idToken: string, rememberMe: boolean = false): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/google', { idToken, rememberMe });
  },

  /**
   * Refresh access token
   * Note: refreshToken is mostly handled internally by apiClient,
   * but providing it here for explicit calls if needed.
   */
  refresh: (): Promise<{ accessToken: string }> => {
    return apiClient.post<{ accessToken: string }>('/auth/refresh', {});
  },

  /**
   * Logout user
   * Clears session in DB and removes cookies.
   */
  logout: (): Promise<void> => {
    return apiClient.post('/auth/logout', {});
  },

  /**
   * Update user profile data (e.g. isInMatchingPool)
   */
  updateProfile: (userId: string, data: Partial<User>): Promise<User> => {
    return apiClient.patch<User>(`/users/${userId}`, data);
  },

  /**
   * Get user profile by ID
   */
  getUser: (userId: string): Promise<User> => {
    return apiClient.get<User>(`/users/${userId}`);
  },
  
  /**
   * Request password reset via email
   */
  forgotPassword: (email: string): Promise<{ message: string }> => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password using OTP token
   */
  resetPassword: (email: string, token: string, password: string): Promise<{ message: string }> => {
    return apiClient.post('/auth/reset-password', { email, token, password });
  },
};
