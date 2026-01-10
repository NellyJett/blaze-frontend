import api from '../api';
import { Alert } from '../../types';

export interface FraudMetrics {
  open: number;
  investigating: number;
  resolved: number;
  critical: number;
}

export interface FraudAlertsResponse {
  success: boolean;
  data: Alert[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const fraudApi = {
  getFraudMetrics: async () => {
    const response = await api.get<{ success: boolean; data: FraudMetrics }>('/api/dashboard/fraud-metrics');
    return response.data;
  },

  getAmlMetrics: async () => {
    const response = await api.get<{ success: boolean; data: any }>('/api/dashboard/aml-metrics');
    return response.data;
  },

  getAmpMetrics: async () => {
    const response = await api.get<{ success: boolean; data: any }>('/api/dashboard/amp-metrics');
    return response.data;
  },

  getFraudAlerts: async (params: { page?: number; limit?: number; status?: string; severity?: string; type?: string }) => {
    const response = await api.get<FraudAlertsResponse>('/api/fraud/alerts', { params });
    return response.data;
  },

  getFraudAlertById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Alert }>(`/api/fraud/alerts/${id}`);
    return response.data;
  },

  resolveAlert: async (id: string, status: string) => {
    const response = await api.post<{ success: boolean; data: Alert }>(`/api/fraud/resolve/${id}`, { status });
    return response.data;
  },
};
