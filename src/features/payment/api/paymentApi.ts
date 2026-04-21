import { apiClient } from '../../../infrastructure/apiClient';

export interface MatchingFeePaymentRequest {
  // useMock is now handled globally in apiClient
}

export interface PayOSInfoResponse {
  qrCode: string;
  paymentUrl: string;
  txnRef: string;
  amount: number;
  success?: boolean;
  message?: string;
}

export interface MatchingFeePaymentResponse extends PayOSInfoResponse {
  success: boolean;
  message: string;
}

export interface PayOSStatusResponse {
  status: string;
  orderCode: string;
  amount: number;
}

export const paymentApi = {
  createMatchingFeePayment: (userId: string, data: MatchingFeePaymentRequest): Promise<MatchingFeePaymentResponse> => 
    apiClient.post(`/matching-fee/pay/${userId}`, data),

  checkPayOSStatus: (orderCode: string): Promise<PayOSStatusResponse> =>
    apiClient.get(`/payos/status?orderCode=${orderCode}`),
};

