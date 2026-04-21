import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoading } from '../context/LoadingContext';
import { useError } from '../context/ErrorContext';
import { useNotification } from '../context/NotificationContext';

export interface AsyncActionOptions {
  loadingMessage?: string;
  successMessage?: string;
  showToastOnSuccess?: boolean;
  showToastOnError?: boolean;
  autoHideLoader?: boolean;
}

/**
 * Super Hook for automated async operations in Clique 83.
 * Handles:
 * 1. Global Cinematic Loading (with custom message)
 * 2. Global Error Toasts
 * 3. Global Success Toasts
 * 4. Safe UI cleanup (finally -> hideLoader if autoHideLoader is true)
 */
export const useAsyncAction = () => {
  const { t } = useTranslation();
  const { showLoader, hideLoader } = useLoading();
  const { showError } = useError();
  const { showSuccess } = useNotification();

  /**
   * Executes an async function with automated state management.
   * @param {Function} asyncFunc - The API call or async logic to run
   * @param {AsyncActionOptions} options - Configuration for local messages
   */
  const execute = useCallback(async <T>(
    asyncFunc: () => Promise<T>,
    options: AsyncActionOptions = {}
  ): Promise<T> => {
    const {
      loadingMessage = t('common.processing'),
      successMessage = t('common.success_operation'),
      showToastOnSuccess = true,
      showToastOnError = true,
      autoHideLoader = true
    } = options;

    try {
      showLoader(loadingMessage);
      const result = await asyncFunc();

      if (showToastOnSuccess && successMessage) {
        showSuccess(successMessage);
      }

      return result;
    } catch (err: unknown) {
      const error = err as Error;
      const errorMsg = error.message || 'Something went wrong';

      if (showToastOnError) {
        showError(errorMsg);
      }

      throw err;
    } finally {
      if (autoHideLoader) {
        hideLoader();
      }
    }
  }, [showLoader, hideLoader, showError, showSuccess]);

  return { execute };
};
