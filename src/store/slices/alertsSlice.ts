import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Alert, AlertSeverity } from '@/types';
import { customerApi } from '@/services/api';
import { fraudApi, FraudMetrics } from '@/services/api/fraudApi';

interface AlertsState {
  alerts: Alert[];
  metrics: FraudMetrics | null;
  amlMetrics: any | null;
  ampMetrics: any | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  selectedAlert: Alert | null;
  loading: boolean;
  error: string | null;
  severityFilter: AlertSeverity | 'all';
  statusFilter: Alert['status'] | 'all';
}

const initialState: AlertsState = {
  alerts: [],
  metrics: null,
  amlMetrics: null,
  ampMetrics: null,
  pagination: null,
  selectedAlert: null,
  loading: false,
  error: null,
  severityFilter: 'all',
  statusFilter: 'all',
};

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAll',
  async (params: { 
    page?: number; 
    limit?: number; 
    severity?: AlertSeverity | 'all'; 
    status?: Alert['status'] | 'all'; 
    customerId?: string;
    type?: string;
  } | undefined = undefined) => {
    if (params?.customerId) {
      const { customerId } = params;
      // Compliance Engine needs ALL alerts (PASSED, OPEN, etc) for the customer
      const response = await customerApi.getCustomerAlerts(customerId);
      const alerts = response.data?.data || response.data || [];
      const mappedData = alerts.map((alert: any) => ({
        ...alert,
        timestamp: alert.createdAt,
        severity: (alert.level || 'low').toLowerCase(),
        status: (alert.status || 'open').toLowerCase(),
      }));
      return { data: mappedData, pagination: null };
    } else {
      const response = await fraudApi.getFraudAlerts({
        page: params?.page,
        limit: params?.limit,
        status: params?.status === 'all' ? undefined : params?.status?.toUpperCase(),
        severity: params?.severity === 'all' ? undefined : params?.severity?.toUpperCase(),
        type: params?.type?.toUpperCase(),
      });
      // Map backend createdAt to frontend timestamp
      const mappedData = response.data.map((alert: any) => ({
        ...alert,
        timestamp: alert.createdAt,
        severity: alert.level.toLowerCase(),
        status: alert.status.toLowerCase(),
      }));
      return { data: mappedData, pagination: response.pagination };
    }
  }
);

export const fetchFraudMetrics = createAsyncThunk(
  'alerts/fetchMetrics',
  async () => {
    const response = await fraudApi.getFraudMetrics();
    return response.data;
  }
);

export const fetchAmlMetrics = createAsyncThunk(
  'alerts/fetchAmlMetrics',
  async () => {
    const response = await fraudApi.getAmlMetrics();
    return response.data;
  }
);

export const fetchAmpMetrics = createAsyncThunk(
  'alerts/fetchAmpMetrics',
  async () => {
    const response = await fraudApi.getAmpMetrics();
    return response.data;
  }
);

export const fetchAlertById = createAsyncThunk(
  'alerts/fetchById',
  async (id: string) => {
    const response = await fraudApi.getFraudAlertById(id);
    const alert = response.data as any;
    return {
      ...alert,
      timestamp: alert.createdAt,
      severity: alert.level.toLowerCase(),
      status: alert.status.toLowerCase(),
    };
  }
);

export const updateAlertStatus = createAsyncThunk(
  'alerts/updateStatus',
  async ({ id, status }: { id: string; status: Alert['status'] }) => {
    const response = await fraudApi.resolveAlert(id, status.toUpperCase());
    const alert = response.data as any;
    return {
      ...alert,
      timestamp: alert.createdAt,
      severity: alert.level.toLowerCase(),
      status: alert.status.toLowerCase(),
    };
  }
);

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setSeverityFilter: (state, action: PayloadAction<AlertSeverity | 'all'>) => {
      state.severityFilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<Alert['status'] | 'all'>) => {
      state.statusFilter = action.payload;
    },
    setSelectedAlert: (state, action: PayloadAction<Alert | null>) => {
      state.selectedAlert = action.payload;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch alerts';
      })
      .addCase(fetchFraudMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
      })
      .addCase(fetchAmlMetrics.fulfilled, (state, action) => {
        state.amlMetrics = action.payload;
      })
      .addCase(fetchAmpMetrics.fulfilled, (state, action) => {
        state.ampMetrics = action.payload;
      })
      .addCase(fetchAlertById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlertById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAlert = action.payload;
      })
      .addCase(fetchAlertById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch alert details';
      })
      .addCase(updateAlertStatus.fulfilled, (state, action) => {
        const index = state.alerts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.alerts[index] = action.payload;
        }
        if (state.selectedAlert?.id === action.payload.id) {
          state.selectedAlert = action.payload;
        }
      });
  },
});

export const {
  setSeverityFilter,
  setStatusFilter,
  setSelectedAlert,
  addAlert,
  clearError,
} = alertsSlice.actions;
export default alertsSlice.reducer;
