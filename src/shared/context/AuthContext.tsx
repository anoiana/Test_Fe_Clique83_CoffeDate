import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  authApi,
  LoginCredentials,
  SignupCredentials,
  SignupResponse,
  AuthResponse,
} from '../../features/authentication/api/authApi';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { User } from '../types/models';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  signupResult: SignupResponse | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  loginWithGoogle: (idToken: string, rememberMe?: boolean) => Promise<AuthResponse>;
  signup: (credentials: SignupCredentials) => Promise<SignupResponse>;
  verifyOtp: (userId: string, otp: string) => Promise<AuthResponse>;
  refreshUser: () => Promise<User>;
  updateUser: (data: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (email: string, token: string, password: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [signupResult, setSignupResult] = useState<SignupResponse | null>(null);
  const [isAuthError, setIsAuthError] = useState<string | null>(null);
  const { execute } = useAsyncAction();

  // Use React Query to manage user state
  const {
    data: user,
    isLoading: isUserLoading,
    isFetched: isInitialized,
    refetch: refetchUserQuery
  } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const savedUserStr = localStorage.getItem('user');

      if (!token || !savedUserStr) return null;

      try {
        const savedUser = JSON.parse(savedUserStr);
        const userId = savedUser.id || savedUser.userId;

        if (!userId) return null;

        // Try to get fresh data from server
        const freshUser = await authApi.getUser(userId);
        localStorage.setItem('user', JSON.stringify(freshUser));
        return freshUser;
      } catch (err) {
        console.error('Failed to fetch fresh user, using cached data if available', err);
        try {
          return JSON.parse(savedUserStr);
        } catch (e) {
          return null;
        }
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });

  const refreshUser = async (): Promise<User> => {
    const result = await refetchUserQuery();
    if (result.data) return result.data;
    throw new Error('No user session found');
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsAuthError(null);
    try {
      const response = await execute(
        async () => await authApi.login(credentials),
        {
          loadingMessage: t('auth.login.authenticating'),
          successMessage: t('auth.login.welcome_back_clique'),
          showToastOnSuccess: true,
          showToastOnError: true
        }
      );

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      queryClient.setQueryData(['user'], response.user);

      return response;
    } catch (err: unknown) {
      setIsAuthError((err as Error).message || t('auth.login.login_failed'));
      throw err;
    }
  };

  const loginWithGoogle = async (idToken: string, rememberMe: boolean = false): Promise<AuthResponse> => {
    setIsAuthError(null);
    try {
      const response = await execute(
        async () => await authApi.googleLogin(idToken, rememberMe),
        {
          loadingMessage: t('auth.login.connecting_google'),
          successMessage: t('auth.login.successfully_connected'),
          showToastOnSuccess: true,
          showToastOnError: true
        }
      );

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      queryClient.setQueryData(['user'], response.user);

      return response;
    } catch (err: unknown) {
      setIsAuthError((err as Error).message || t('auth.login.google_login_failed'));
      throw err;
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<SignupResponse> => {
    setIsAuthError(null);
    try {
      const response = await execute(
        async () => await authApi.signup(credentials),
        {
          loadingMessage: t('auth.register.creating_profile'),
          successMessage: t('auth.register.account_created'),
          showToastOnError: true
        }
      );
      setSignupResult(response);
      return response;
    } catch (err: unknown) {
      setIsAuthError((err as Error).message || t('auth.register.registration_failed'));
      throw err;
    }
  };

  const verifyOtp = async (userId: string, otp: string): Promise<AuthResponse> => {
    setIsAuthError(null);
    try {
      const response = await execute(
        async () => {
          const otpResp = await authApi.verifyOtp(userId, otp);
          localStorage.setItem('accessToken', otpResp.accessToken);
          return otpResp;
        },
        {
          loadingMessage: t('auth.otp.verifying_code'),
          successMessage: t('auth.otp.verification_successful'),
          showToastOnError: true
        }
      );

      localStorage.setItem('user', JSON.stringify(response.user));
      queryClient.setQueryData(['user'], response.user);

      return response;
    } catch (err: unknown) {
      setIsAuthError((err as Error).message || t('auth.otp.otp_verification_failed'));
      localStorage.removeItem('accessToken');
      throw err;
    }
  };

  const updateUser = React.useCallback((data: Partial<User>) => {
    queryClient.setQueryData(['user'], (prev: User | null) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, [queryClient]);

  const logout = React.useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('clique_intake_step');
      localStorage.removeItem('clique_intake_data');
      localStorage.removeItem('clique_survey_r2_step');
      localStorage.removeItem('clique_survey_r2_data');

      queryClient.setQueryData(['user'], null);
      queryClient.clear();
      setSignupResult(null);
    }
  }, [queryClient]);

  // Listen for global logout events (from apiClient)
  React.useEffect(() => {
    const handleGlobalLogout = () => {
      logout();
    };
    window.addEventListener('clique:logout', handleGlobalLogout);
    return () => window.removeEventListener('clique:logout', handleGlobalLogout);
  }, [logout]);

  const forgotPassword = async (email: string): Promise<{ message: string }> => {
    setIsAuthError(null);
    try {
      const response = await execute(
        async () => await authApi.forgotPassword(email),
        {
          loadingMessage: t('auth.forgot_password.sending_reset_code'),
          successMessage: t('auth.forgot_password.check_email_otp'),
          showToastOnSuccess: true,
          showToastOnError: true
        }
      );
      return response;
    } catch (err: unknown) {
      setIsAuthError((err as Error).message || t('auth.forgot_password.failed_send_otp'));
      throw err;
    }
  };

  const resetPassword = async (email: string, token: string, password: string): Promise<{ message: string }> => {
    setIsAuthError(null);
    try {
      const response = await execute(
        async () => await authApi.resetPassword(email, token, password),
        {
          loadingMessage: t('auth.reset_password.resetting_password'),
          successMessage: t('auth.reset_password.password_updated'),
          showToastOnSuccess: true,
          showToastOnError: true
        }
      );
      return response;
    } catch (err: unknown) {
      setIsAuthError((err as Error).message || t('auth.reset_password.failed_reset_password'));
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: isUserLoading,
        isInitialized,
        error: isAuthError,
        signupResult,
        login,
        loginWithGoogle,
        signup,
        verifyOtp,
        refreshUser,
        updateUser,
        forgotPassword,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
