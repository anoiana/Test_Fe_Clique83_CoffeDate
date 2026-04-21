import { apiClient } from '../../../infrastructure/apiClient';
import type { MeetingFeedbackSubmission } from '../../../shared/types/models';

/**
 * Feedback API — Phase 33
 * Handles meeting completion and structured feedback submission.
 */
export const feedbackApi = {

  /**
   * API 1: Complete a meeting (manual confirmation)
   * POST /meetings/:id/complete-meeting
   * - Sets meeting status to 'completed'
   * - Resets currentMatchId for both users → ready for new match
   * - Triggers feedback notification
   */
  completeMeeting: async (meetingId: string): Promise<{ success: boolean; message?: string }> => {
    return apiClient.post(`/meetings/${meetingId}/complete-meeting`, {});
  },

  /**
   * API 2: Submit structured feedback
   * POST /meetings/:id/structured-feedback
   * - Sends 10-question feedback form data
   * Error codes:
   *   409 → already submitted
   *   400 → meeting not yet completed
   */
  submitFeedback: async (
    meetingId: string,
    data: MeetingFeedbackSubmission
  ): Promise<{ success: boolean; message?: string }> => {
    return apiClient.post(`/meetings/${meetingId}/structured-feedback`, data);
  },
};