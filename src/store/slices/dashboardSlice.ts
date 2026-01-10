import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardMetrics, ChartData } from '@/types';
import api from '@/services/api';

interface DashboardState {
  metrics: DashboardMetrics | null;
  chartData: ChartData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  chartData: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async () => {
    const response = await api.get('/api/dashboard/metrics');
    return response.data;
  }
);

export const fetchChartData = createAsyncThunk(
  'dashboard/fetchChartData',
  async () => {
    const response = await api.get('/api/dashboard/charts');
    return response.data;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch metrics';
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chartData = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
