import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@/types';
import api, { customerApi } from '@/services/api';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (customerId: string | void) => {
    let response;
    if (customerId) {
      response = await customerApi.getCustomerTransactions(customerId);
    } else {
      response = await api.get('/api/transactions');
    }
    const data = response.data?.data || response.data || [];
    return data.map((tx: any) => ({
      ...tx,
      type: tx.type?.toLowerCase(),
      status: tx.status?.toLowerCase(),
      timestamp: tx.date || tx.createdAt,
    }));
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

export const { setCurrentPage, setPageSize, addTransaction, clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
