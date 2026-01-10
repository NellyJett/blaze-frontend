import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Welcome } from '@/screens/Welcome';
import { SelectOrganization } from '@/screens/SelectOrganization';
import { Signup } from '@/screens/Signup';
import { Login } from '@/screens/Login';
import { VerifyOTP } from '@/screens/VerifyOTP';
import { OrganizationDetails } from '@/screens/OrganizationDetails';
import { ComplianceDocuments } from '@/screens/ComplianceDocuments';
import { TeamSetup } from '@/screens/TeamSetup';
import { Dashboard } from '@/screens/Dashboard';
import { Customer360 } from '@/screens/Customer360';
import { Compliance } from '@/screens/Compliance';
import { FraudDetection } from '@/screens/FraudDetection';
import { CreditScoring } from '@/screens/CreditScoring';
import { ApiTester } from '@/screens/ApiTester';
import { DataIntegrations } from '@/screens/DataIntegrations';
import { AuditLogs } from '@/screens/AuditLogs';
import { Settings } from '@/screens/Settings';
import { Usage } from '@/screens/Usage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/select-organization" element={<SelectOrganization />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/organization-details" element={<OrganizationDetails />} />
            <Route path="/compliance-documents" element={<ComplianceDocuments />} />
            <Route path="/team-setup" element={<TeamSetup />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Customer360 />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/compliance"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Compliance />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fraud"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FraudDetection />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/scoring"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreditScoring />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/api-tester"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ApiTester />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/integrations"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DataIntegrations />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit-logs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AuditLogs />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
