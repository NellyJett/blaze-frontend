import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuditLog } from '@/types';
import api, { customerApi } from '@/services/api';

interface AuditLogsState {
  logs: AuditLog[];
  loading: boolean;
  error: string | null;
}

const initialState: AuditLogsState = {
  logs: [],
  loading: false,
  error: null,
};

export const fetchAuditLogs = createAsyncThunk(
  'auditLogs/fetchAll',
  async (customerId: string | void) => {
    let response;
    if (customerId) {
      response = await customerApi.getCustomerAuditLogs(customerId);
    } else {
      response = await api.get('/api/audit-logs');
    }
    const data = response.data?.data || response.data || [];
    return data.map((log: any) => ({
      ...log,
      result: (log.result === 'SUCCESS' || log.result === 'pass') ? 'pass' : 
              (log.result === 'FAILED' || log.result === 'fail') ? 'fail' : 'flag',
      ruleName: log.ruleName || log.action?.replace(/_/g, ' '),
      timestamp: log.timestamp || log.createdAt,
    }));
  }
);

const auditLogsSlice = createSlice({
  name: 'auditLogs',
  initialState,
  reducers: {
    addAuditLog: (state, action: PayloadAction<AuditLog>) => {
      state.logs.unshift(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch audit logs';
      });
  },
});

export const { addAuditLog, clearError } = auditLogsSlice.actions;
export default auditLogsSlice.reducer;
