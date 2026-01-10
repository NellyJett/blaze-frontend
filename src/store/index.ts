import { configureStore } from '@reduxjs/toolkit';
import customersReducer from './slices/customersSlice';
import transactionsReducer from './slices/transactionsSlice';
import alertsReducer from './slices/alertsSlice';
import dashboardReducer from './slices/dashboardSlice';
import auditLogsReducer from './slices/auditLogsSlice';
import authReducer from './slices/authSlice';
import onboardingReducer from './slices/onboardingSlice';

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    transactions: transactionsReducer,
    alerts: alertsReducer,
    dashboard: dashboardReducer,
    auditLogs: auditLogsReducer,
    auth: authReducer,
    onboarding: onboardingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
