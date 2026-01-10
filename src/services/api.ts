import axios, { AxiosError } from 'axios';
import { Customer } from '../types';
import { OrganizationDetails } from '../types/onboarding';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    const token = localStorage.getItem('blazetech_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling with detailed logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      isNetworkError: !error.response,
    });

    // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - check if backend is running');
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - check CORS and backend connection');
      console.log('Backend URL should be:', API_BASE_URL);
    }

    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('blazetech_token');
      localStorage.removeItem('blazetech_user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 404) {
      console.error('Endpoint not found - check backend routes');
    }

    return Promise.reject(error);
  }
);

// Types
export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  acceptTerms: boolean; 
  role: string;
  organizationType: string;
  organizationName: string; 
  country?: string; 
  address?: string; 
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UploadDocumentData {
  documentType: string;
  file: File;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string; 
  email: string;
  phone: string;
  organizationName: string; 
  organizationType: string; 
  role: string;
  isEmailVerified?: boolean;
  active?: boolean;
  organizationId?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface Document {
  id: string;
  type: string;
  fileName: string;
  storedFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  status: string;
  userId: string;
}

// Test function to check backend connection
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection to:', API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    console.log('Backend health check successful:', response.data);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Backend health check failed:', error.message);
    } else {
      console.error('Backend health check failed:', error);
    }
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};

// Maps human-readable or frontend enum values → backend enum values
const ORG_TYPE_MAP: Record<string, string> = {
  "fintech_lending": "FINTECH_LENDING",
  "microfinance_bank": "MICROFINANCE_BANK",
  "digital_lender": "DIGITAL_LENDER",
  "investment_trading": "INVESTMENT_TRADING",
  "credit_bureau": "CREDIT_BUREAU",
  "insurance": "INSURANCE",
  "pfi": "PFI",
  "bnpl_provider": "BNPL_PROVIDER",
};

const ROLE_MAP: Record<string, string> = {
  "compliance_officer": "COMPLIANCE_OFFICER",
  "fraud_analyst": "FRAUD_ANALYST",
  "risk_manager": "RISK_MANAGER",
  "operations_admin": "OPERATIONS_ADMIN",
  "developer_technical": "DEVELOPER_TECHNICAL",
  "executive": "EXECUTIVE",
};


// API functions
export const userApi = {
  register: async (data: RegisterUserData) => {
    try {
      console.log('Registration data being sent:', data);
      
      // Transform data to match backend schema strictly
      const backendData = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        password: data.password,
        acceptTerms: data.acceptTerms,
        role: ROLE_MAP[data.role] || data.role.toUpperCase(),
        organizationType: ORG_TYPE_MAP[data.organizationType] || data.organizationType.toUpperCase(),
        organizationName: data.organizationName,
        country: data.country || 'Nigeria',
        address: data.address || '',
      };
      
      console.log('Transformed backend data:', backendData);
      
      const response = await api.post('/api/auth/signup', backendData);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      
      // Provide helpful error message
      if (!(error as import('axios').AxiosError).response) {
        throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Make sure backend is running and CORS is enabled.`);
      }
      
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (data: VerifyOTPData) => {
    try {
      const response = await api.post('/api/auth/otp/verify', data);
      // Backend returns { success, message, data: { user, token } }
      return response.data;
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (email: string) => {
    try {
      const response = await api.post('/api/auth/otp/send', { email });
      return response.data;
    } catch (error) {
      console.error('Resend OTP failed:', error);
      throw error;
    }
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/auth/login', data);
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('blazetech_token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('blazetech_user', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Save organization details - COMMENTED OUT until route exists
  saveOrganizationDetails: async (data: OrganizationDetails) => {
    try {
      // Get organization type from authenticated user data
      // const userStr = localStorage.getItem('blazetech_user');
      // const user = userStr ? JSON.parse(userStr) : null;
      
      // if (!user) {
      //   throw new Error('User not authenticated');
      // }
      
      // Get organization type from user object
      // const organizationType = user.organizationType;
      
      // if (!organizationType) {
      //   console.warn('Organization type not found in user data, using default');
      // }
      ///////////////////////////////////
      const userStr = localStorage.getItem('blazetech_user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user) {
        throw new Error('User not authenticated');
      }

      // ✅ SAFELY derive organization type
      const organizationType =
        user.organizationType ||
        (data as any).organizationType ||
        'MICROFINANCE_BANK';

      ///////////////////////////////////
  
      // Transform frontend field names to backend schema names
      const transformedData = {
        name: data.registeredBusinessName,
        // countriesOfOperation: data.countriesOfOperation || [],
        ///////////////////////////
        countriesOfOperation: Array.isArray(data.countriesOfOperation) && data.countriesOfOperation.length > 0
        ? data.countriesOfOperation
        : ['Nigeria'],

        ///////////////////////////
        address: data.headquarterAddress,
        customerSize: data.estimatedCustomerSize,
        website: data.websiteUrl,
        rcNumber: data.rcLicenseNumber,
        tin: data.taxIdentificationNumber,
        yearIncorporated: data.yearIncorporated ? parseInt(data.yearIncorporated) : undefined,
        country: 'Nigeria', // Default
        // type: organizationType || 'MICROFINANCE_BANK',
        type: ORG_TYPE_MAP[organizationType] || organizationType,

      };
  
      console.log('Saving organization with data:', transformedData);
      console.log('Organization type from auth:', organizationType);
      
      try {
        const idempotencyKey = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
          ? (globalThis.crypto as Crypto).randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const response = await api.post('/api/organizations', transformedData, {
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        });
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const status = axiosError?.response?.status;
        const data = axiosError?.response?.data;
        let message = 'Failed to save organization details';
        if (status === 400) {
          message = data?.error || 'Invalid organization data. Check RC format (e.g., RC123456), TIN (9-12 digits), and year (1900-current).';
        } else if (status === 401) {
          message = 'Your session has expired. Please login again.';
        } else if (status === 403) {
          message = 'You are not allowed to perform this action.';
        } else if (status === 404) {
          message = 'Organization service unavailable. Please try again later.';
        } else if (status === 409) {
          message = data?.error || 'Duplicate request detected. Please wait or refresh.';
        } else if (status >= 500) {
          message = 'A server error occurred while saving your organization. Please try again.';
        } else if (axiosError?.message) {
          message = axiosError.message;
        }
        console.error('Save organization failed:', { status, data });
        throw new Error(message);
      }
    } catch (error) {
      console.error('Save organization failed:', error);
      throw error;
    }
  },

  // Get organization details - COMMENTED OUT until route exists
  getOrganizationDetails: async () => {
    console.warn('getOrganizationDetails endpoint /api/organization may not exist yet');
    try {
      const response = await api.get('/api/organizations');
      return response.data;
    } catch (error) {
      console.error('Get organization failed:', error);
      throw error;
    }
  },

  // Upload document
  uploadDocument: async (data: UploadDocumentData): Promise<{ message: string; document: Document }> => {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('type', data.documentType);

      const response = await api.post('/api/compliance/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload document failed:', error);
      throw error;
    }
  },

  // Get documents
  getDocuments: async (): Promise<{ documents: Document[] }> => {
    try {
      const response = await api.get('/api/compliance/documents');
      return response.data;
    } catch (error) {
      console.error('Get documents failed:', error);
      throw error;
    }
  },

  // Monetization & Usage
  getPricingConfig: async () => {
    const response = await api.get('/api/internal/pricing-config');
    return response.data;
  },

  getUsageSummary: async (orgId?: string) => {
    const url = orgId ? `/api/organizations/${orgId}/usage-summary` : '/api/organizations/usage-summary';
    const response = await api.get(url);
    return response.data;
  },

  getOrganizationSettings: async () => {
    const response = await api.get('/api/organizations/settings');
    return response.data;
  },

  // Team management
  inviteTeamMember: async (data: { email: string; role: string; permissions?: string[] }) => {
    try {
      const response = await api.post('/api/teams/invite', data);
      return response.data;
    } catch (error) {
      console.error('Invite team member failed:', error);
      throw error;
    }
  },

  getTeamMembers: async () => {
    try {
      const response = await api.get('/api/organizations/users');
      return response.data;
    } catch (error) {
      console.error('Get team members failed:', error);
      throw error;
    }
  },

  removeTeamMember: async (teamMemberId: string) => {
    try {
      const response = await api.delete(`/api/teams/${teamMemberId}`);
      return response.data;
    } catch (error) {
      console.error('Remove team member failed:', error);
      throw error;
    }
  },
};

export const customerApi = {
  getCustomers: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/api/customers', { params });
    return response.data;
  },
  getCustomerById: async (id: string) => {
    const response = await api.get(`/api/customers/${id}`);
    return response.data;
  },
  getCustomerAlerts: async (id: string) => {
    const response = await api.get(`/api/customers/${id}/alerts`);
    return response.data;
  },
  getCustomerTransactions: async (id: string) => {
    const response = await api.get(`/api/customers/${id}/transactions`);
    return response.data;
  },
  getCustomerAuditLogs: async (id: string) => {
    const response = await api.get(`/api/customers/${id}/audit-logs`);
    return response.data;
  },
  getCreditScore: async (customerId: string) => {
    const response = await api.get(`/api/scoring/${customerId}`);
    return response.data;
  },
};

export const ingestApi = {
  ingestCustomers: async (customers: Partial<Customer>[], source: string = 'CSV') => {
    const response = await api.post('/api/ingest/customers', { customers, source });
    return response.data;
  },
};

export const integrationApi = {
  getIntegrations: async () => {
    const response = await api.get('/api/integrations');
    return response.data;
  },
  configure: async (provider: string, config: Record<string, unknown>) => {
    const response = await api.post('/api/integrations/configure', { provider, config });
    return response.data;
  },
  sync: async (provider: string) => {
    const response = await api.post(`/api/integrations/sync/${provider}`);
    return response.data;
  },
};

export default api;