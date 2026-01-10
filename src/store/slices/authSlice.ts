import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrganizationType = 
  | 'fintech_lending'
  | 'microfinance_bank'
  | 'digital_lender'
  | 'investment_trading'
  | 'credit_bureau'
  | 'insurance'
  | 'pfi'
  | 'bnpl_provider';

export type UserRole =
  | 'org_admin'
  | 'compliance_officer'
  | 'fraud_analyst'
  | 'risk_manager'
  | 'operations_admin'
  | 'developer_technical'
  | 'executive';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string; 
  organizationType: OrganizationType; 
  role: UserRole;
}

export interface PendingUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string; 
  organizationType: OrganizationType; 
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  selectedOrganizationType: OrganizationType | null;
  pendingUser: PendingUser | null;
}

// Check localStorage for existing session
const storedUser = localStorage.getItem('blazetech_user');
const storedPendingUser = sessionStorage.getItem('blazetech_pending_user');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
  selectedOrganizationType: null,
  pendingUser: storedPendingUser ? JSON.parse(storedPendingUser) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOrganizationType: (state, action: PayloadAction<OrganizationType>) => {
      state.selectedOrganizationType = action.payload;
    },
    setPendingUser: (state, action: PayloadAction<PendingUser>) => {
      state.pendingUser = action.payload;
      // Store pendingUser in sessionStorage to survive page refresh
      sessionStorage.setItem('blazetech_pending_user', JSON.stringify(action.payload));
    },
    clearPendingUser: (state) => {
      state.pendingUser = null;
      // Clear from sessionStorage when done
      sessionStorage.removeItem('blazetech_pending_user');
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.pendingUser = null;
      localStorage.setItem('blazetech_user', JSON.stringify(action.payload));
      // Clear pendingUser session when login is complete
      sessionStorage.removeItem('blazetech_pending_user');
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.selectedOrganizationType = null;
      state.pendingUser = null;
      localStorage.removeItem('blazetech_user');
      localStorage.removeItem('blazetech_token');
      // Clear sessionStorage on logout
      sessionStorage.removeItem('blazetech_pending_user');
    },
  },
});

export const { setOrganizationType, setPendingUser, clearPendingUser, login, logout } = authSlice.actions;
export default authSlice.reducer;