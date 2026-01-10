import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, CreditCard, AlertTriangle, ShieldCheck, DollarSign, Activity } from 'lucide-react';
import { userApi } from '@/services/api';
import { UsageSummary } from '@/types/organization';

export function Usage() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await userApi.getUsageSummary();
        setUsage(response.data);
      } catch (error) {
        console.error('Failed to fetch usage summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, []);

  if (loading) {
    return <div className="flex h-96 items-center justify-center">Loading usage statistics...</div>;
  }

  if (!usage) {
    return <div className="flex h-96 items-center justify-center text-red-500">Failed to load usage statistics.</div>;
  }

  const { organization, monthlyUsage, lifetimeUsage, limits, valueMetrics } = usage;

  const getPercent = (current: number, max: number) => Math.min(Math.round((current / max) * 100), 100);

  const customerPercent = getPercent(monthlyUsage.customers, limits.maxCustomers);
  const transactionPercent = getPercent(monthlyUsage.transactions, limits.maxTransactions);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Usage & Billing</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {organization.plan} PLAN
          </Badge>
        </div>
        <p className="text-gray-600">Track your consumption and platform value in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resource Limits (Monthly) */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" /> Monthly Resource Consumption
            </CardTitle>
            <CardDescription>Usage against your current plan's monthly limits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Customers Ingested</span>
                <span className="text-gray-500">{monthlyUsage.customers} / {limits.maxCustomers}</span>
              </div>
              <Progress value={customerPercent} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Transactions Processed</span>
                <span className="text-gray-500">{monthlyUsage.transactions} / {limits.maxTransactions}</span>
              </div>
              <Progress value={transactionPercent} className="h-2" />
            </div>
            
            <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
              Note: Approaching limits may trigger enforcement alerts based on platform configuration.
            </p>
          </CardContent>
        </Card>

        {/* Lifetime Usage */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" /> Lifetime Activity
            </CardTitle>
            <CardDescription>Total value processed since organization setup.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-50">
              <p className="text-xs font-medium text-indigo-700 uppercase tracking-wider mb-1">Customers</p>
              <p className="text-2xl font-bold text-indigo-900">{lifetimeUsage.customers.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-50">
              <p className="text-xs font-medium text-indigo-700 uppercase tracking-wider mb-1">Transactions</p>
              <p className="text-2xl font-bold text-indigo-900">{lifetimeUsage.transactions.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-50">
              <p className="text-xs font-medium text-indigo-700 uppercase tracking-wider mb-1">Alerts</p>
              <p className="text-2xl font-bold text-indigo-900">{lifetimeUsage.alerts.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-50">
              <p className="text-xs font-medium text-indigo-700 uppercase tracking-wider mb-1">Checks</p>
              <p className="text-2xl font-bold text-indigo-900">{lifetimeUsage.complianceChecks.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Value Metrics */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" /> Platform Protection Value
            </CardTitle>
            <CardDescription>Economic impact and risk mitigation metrics.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Risk Events</p>
              <p className="text-2xl font-bold text-gray-900">{valueMetrics.riskEventsDetected}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fraud / AML Detections</p>
              <p className="text-2xl font-bold text-gray-900">{valueMetrics.fraudDetections}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Compliance Checks</p>
              <p className="text-2xl font-bold text-gray-900">{valueMetrics.complianceChecksPerformed}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider mb-1">Potential Loss Prevented</p>
              <p className="text-2xl font-bold text-emerald-900">${(valueMetrics.potentialLossPrevented / 1000).toFixed(1)}k</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Access */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Plan Features</CardTitle>
          <CardDescription>Modules enabled for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(limits.features).map(([feature, enabled]) => (
              <div 
                key={feature} 
                className={`flex items-center justify-between p-3 rounded-lg border ${enabled ? 'bg-blue-50 border-blue-100 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'}`}
              >
                <span className="text-sm font-semibold capitalize">{feature}</span>
                {enabled ? <ShieldCheck className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border border-gray-300" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
