import { apiClient } from '../../../infrastructure/apiClient';

export interface MeetingPaymentRequest {
  amount: number;
}

export interface MeetingPaymentResponse {
  paymentUrl: string;
  txnRef?: string;
  message?: string;
}

export interface Meeting {
  id: string;
  status: string;
  userAId: string;
  userBId: string;
  userAPaid: boolean;
  userBPaid: boolean;
  paymentDeadline: string;
  agreedSlot?: string;
  agreedLocationId?: string;
  userAAvailability?: { day: string; slots: string[] }[];
  userBAvailability?: { day: string; slots: string[] }[];
  userALocationPreferences?: string[];
  userBLocationPreferences?: string[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  imageUrl?: string;
  description?: string;
}

export const meetingApi = {
  pay: async (meetingId: string): Promise<MeetingPaymentResponse> => {
    return apiClient.post<MeetingPaymentResponse>(`/meetings/${meetingId}/pay`, { 
      amount: 50000 // 50,000 VND reservation fee
    });
  },

  getMyMeetings: async (): Promise<Meeting[]> => {
    return apiClient.get<Meeting[]>('/meetings/me');
  },

  submitAvailability: async (meetingId: string, slots: { day: string; slots: string[] }[]): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`/meetings/${meetingId}/availability`, { slots });
  },

  getLocations: async (city?: string): Promise<Location[]> => {
    const url = city ? `/meetings/locations?city=${encodeURIComponent(city)}` : '/meetings/locations';
    return apiClient.get<Location[]>(url);
  },

  submitLocationPreferences: async (meetingId: string, locationIds: string[]): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`/meetings/${meetingId}/location-preferences`, { locationIds });
  },

  completeMeeting: async (meetingId: string): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`/meetings/${meetingId}/complete`, {});
  },
};
