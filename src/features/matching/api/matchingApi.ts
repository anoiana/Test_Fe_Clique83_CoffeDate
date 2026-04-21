import { apiClient } from '../../../infrastructure/apiClient';

/**
 * Infrastructure Layer: Matching API Service
 * Handles evaluation submissions and match results.
 */
export const matchingApi = {
  /**
   * Submit Round 1 Evaluation (Intake Survey)
   * @param {Object} evaluationData 
   */
  submitEvaluation: (evaluationData) => {
    return apiClient.post('/evaluations', evaluationData);
  },

  /**
   * Submit Round 2 Evaluation (Matching Survey)
   * @param {Object} surveyData 
   */
  submitRound2: (surveyData: any) => {
    return apiClient.post('/round2/submit', { data: surveyData });
  },

  /**
   * Upsert Round 3 partial data (Auto-save)
   * @param {Object} surveyData 
   */
  upsertRound3: (surveyData: any) => {
    return apiClient.post('/round3/upsert', { data: surveyData });
  },

  /**
   * Submit Round 3 Evaluation (Full Submit)
   * @param {Object} surveyData 
   */
  submitRound3: (surveyData: any) => {
    return apiClient.post('/round3/submit', { data: surveyData });
  },

  /**
   * Get Current User's Round 1 Evaluation
   */
  getEvaluationMe: () => {
    return apiClient.get('/evaluations/me');
  },

  /**
   * Update Current User's Evaluation (PATCH)
   * @param {Object} evaluationData 
   */
  updateEvaluation: (evaluationData) => {
    return apiClient.patch('/evaluations', evaluationData);
  },

  /**
   * Upload User Photo Gallery
   * @param {FormData} formData 
   */
  uploadGallery: (formData: FormData) => {
    return apiClient.postForm('/uploads/photos', formData);
  },

  /**
   * Get Current User's Photo Uploads
   */
  getMyPhotos: () => {
    return apiClient.get('/uploads/my-photos');
  },

  /**
   * Delete User Photo
   * @param {string} photoId Photo ID to delete
   */
  deletePhoto: (photoId: string) => {
    return apiClient.delete(`/uploads/photos/${photoId}`);
  }
};
