import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchAlerts, fetchFraudMetrics, fetchAmlMetrics, fetchAmpMetrics } from '@/store/slices/alertsSlice';
import { fetchCustomers } from '@/store/slices/customersSlice';
import { fetchTransactions } from '@/store/slices/transactionsSlice';
import { AlertList } from '@/components/alerts/AlertList';
import { AlertDetails } from '@/components/alerts/AlertDetails';
import { MetricCard } from '@/components/ui/MetricCard';
import { AlertTriangle, Shield, CheckCircle, Clock, ShieldCheck, ShieldAlert, Tabs, TabsContent, TabsList, TabsTrigger } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export function FraudDetection() {
  const dispatch = useAppDispatch();
  const { metrics, amlMetrics, ampMetrics, severityFilter, statusFilter } = useAppSelector((state) => state.alerts);
  const [activeTab, setActiveTab] = useState('fraud');

  useEffect(() => {
    dispatch(fetchFraudMetrics());
    dispatch(fetchAmlMetrics());
    dispatch(fetchAmpMetrics());
    dispatch(fetchCustomers());
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    let type = 'FRAUD';
    if (activeTab === 'aml') type = 'AML';
    if (activeTab === 'amp') type = 'COMPLIANCE';

    dispatch(fetchAlerts({ 
      severity: severityFilter, 
      status: statusFilter,
      page: 1,
      limit: 20,
      type
    }));
  }, [dispatch, severityFilter, statusFilter, activeTab]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Made responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 flex-wrap">
            Fraud & AML Center
            {activeTab === 'aml' && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs sm:text-sm">
                ENTERPRISE FEATURE
              </Badge>
            )}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Monitor and investigate suspicious activities across Fraud, AML, and AMP
          </p>
        </div>
      </div>

      {/* Tabs - Made responsive */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('fraud')}
          className={`px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'fraud' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Fraud Dashboard
        </button>
        <button
          onClick={() => setActiveTab('aml')}
          className={`px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'aml' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          AML Dashboard
        </button>
        <button
          onClick={() => setActiveTab('amp')}
          className={`px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'amp' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          AMP Dashboard
        </button>
      </div>

      {/* Metrics - Responsive grid */}
      {activeTab === 'fraud' && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Open Fraud Alerts"
            value={metrics?.open ?? 0}
            icon={<AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="warning"
          />
          <MetricCard
            title="Investigating"
            value={metrics?.investigating ?? 0}
            icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="primary"
          />
          <MetricCard
            title="Resolved"
            value={metrics?.resolved ?? 0}
            icon={<CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="success"
          />
          <MetricCard
            title="Critical Fraud"
            value={metrics?.critical ?? 0}
            icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="destructive"
          />
        </div>
      )}

      {activeTab === 'aml' && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Open AML Alerts"
            value={amlMetrics?.open ?? 0}
            icon={<ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="warning"
          />
          <MetricCard
            title="Investigating"
            value={amlMetrics?.investigating ?? 0}
            icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="primary"
          />
          <MetricCard
            title="Resolved"
            value={amlMetrics?.resolved ?? 0}
            icon={<CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="success"
          />
          <MetricCard
            title="High Risk AML"
            value={amlMetrics?.highRisk ?? 0}
            icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="destructive"
          />
        </div>
      )}

      {activeTab === 'amp' && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="AMP Active Checks"
            value={ampMetrics?.open ?? 0}
            icon={<ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="primary"
          />
          <MetricCard
            title="Pending AMP"
            value={ampMetrics?.investigating ?? 0}
            icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="warning"
          />
          <MetricCard
            title="Protected Accounts"
            value={ampMetrics?.resolved ?? 0}
            icon={<CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
            variant="success"
          />
        </div>
      )}

      {/* Alerts - Responsive grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6 gap-4">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {activeTab.toUpperCase()} Alert Queue
          </h2>
          <AlertList />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Alert Details</h2>
          <AlertDetails />
        </div>
      </div>
    </div>
  );
}