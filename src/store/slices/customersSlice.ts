import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '@/types';
import { customerApi } from '@/services/api';

interface CustomersState {
  customers: Customer[];
  selectedCustomerId: string | null;
  selectedCustomer: Customer | null;
  creditScore: any | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  hasMore: boolean;
}

const initialState: CustomersState = {
  customers: [],
  selectedCustomerId: null,
  selectedCustomer: null,
  creditScore: null,
  loading: false,
  loadingMore: false,
  error: null,
  searchQuery: '',
  pagination: null,
  hasMore: true,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (params: { page?: number; limit?: number; search?: string } | void) => {
    const page = params?.page || 1;
    const response = await customerApi.getCustomers({
      page,
      limit: params?.limit || 10,
      search: params?.search,
    });
    const mappedData = response.data.map((customer: any) => ({
      ...customer,
      kycStatus: (customer.kycStatus || 'NOT_STARTED').toLowerCase(),
      employmentStatus: customer.employmentStatus?.toLowerCase(),
    }));
    return {
      data: mappedData,
      pagination: response.pagination,
      page,
    };
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchById',
  async (id: string) => {
    const response = await customerApi.getCustomerById(id);
    const customer = response.data || response;
    return {
      ...customer,
      kycStatus: (customer.kycStatus || 'NOT_STARTED').toLowerCase(),
      employmentStatus: customer.employmentStatus?.toLowerCase(),
    };
  }
);

export const fetchCreditScore = createAsyncThunk(
  'customers/fetchCreditScore',
  async (customerId: string) => {
    const response = await customerApi.getCreditScore(customerId);
    return response.data || response;
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    selectCustomer: (state, action: PayloadAction<string | null>) => {
      state.selectedCustomerId = action.payload;
      state.selectedCustomer = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state, action) => {
        const page = action.meta.arg?.page || 1;
        if (page === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        if (action.payload.page > 1) {
          state.customers = [...state.customers, ...action.payload.data];
        } else {
          state.customers = action.payload.data;
        }
        state.pagination = action.payload.pagination;
        state.hasMore = action.payload.pagination.page < action.payload.pagination.pages;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.error.message || 'Failed to fetch customers';
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch customer';
      })
      .addCase(fetchCreditScore.fulfilled, (state, action) => {
        state.creditScore = action.payload;
      });
  },
});

export const { setSearchQuery, selectCustomer, clearError } = customersSlice.actions;
export default customersSlice.reducer;
