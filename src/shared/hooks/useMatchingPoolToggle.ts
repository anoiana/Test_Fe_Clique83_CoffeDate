/**
 * useMatchingPoolToggle — Shared hook for toggling matching pool status.
 *
 * Purpose: Eliminates duplicate toggle logic between AppLayout and SettingsDrawer.
 * Both components were copy-pasting the same API call + state update pattern.
 *
 * FSD Layer: shared/hooks
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authApi } from '../../features/authentication/api/authApi';

export const useMatchingPoolToggle = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthContext();
  const { showSuccess, showError } = useNotification();
  const [isUpdating, setIsUpdating] = useState(false);

  const toggle = async () => {
    const userId = user?.id || user?.userId;
    if (!userId || isUpdating) return;

    const currentStatus = user?.isInMatchingPool !== false;
    const newStatus = !currentStatus;
    setIsUpdating(true);

    try {
      await authApi.updateProfile(userId, { isInMatchingPool: newStatus });
      updateUser({ isInMatchingPool: newStatus });
      showSuccess(newStatus ? t('settings.matching_service.pool_active') : t('settings.matching_service.pool_inactive'));
    } catch (err: unknown) {
      showError((err as Error).message || t('settings.matching_service.update_error'));
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isInPool: user?.isInMatchingPool !== false, // Default to true if undefined or null
    isUpdating,
    toggle,
  };
};
