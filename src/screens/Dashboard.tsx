import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchMetrics, fetchChartData } from '@/store/slices/dashboardSlice';
import { usePoll } from '@/hooks/usePoll';
import { AreaChartComponent } from '@/components/charts/AreaChartComponent';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { PieChartComponent } from '@/components/charts/PieChartComponent';
import { Users, CreditCard, AlertTriangle, ShieldX, DollarSign, TrendingUp, RefreshCw, Bell, Search, ChevronDown, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { RootState } from '@/store';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { metrics, chartData, loading, lastUpdated } = useAppSelector(
    (state) => state.dashboard
  );

  const { refresh } = usePoll(
    () => {
      dispatch(fetchMetrics());
      dispatch(fetchChartData());
    },
    { interval: 10000 }
  );

  const user = useAppSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 right-0 z-40 px-4 lg:px-6 py-4 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm left-16 md:left-64 transition-all duration-300">
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Updated: {format(new Date(lastUpdated), 'HH:mm:ss')}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">

          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-900">{user?.firstName || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-0">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Here's what's happening with your platform today
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              {lastUpdated && (
                <div className="flex lg:hidden items-center gap-2 px-2 sm:px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-blue-700">
                    {format(new Date(lastUpdated), 'HH:mm:ss')}
                  </span>
                </div>
              )}
              <button
                onClick={refresh}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-300 text-xs sm:text-sm"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh Data</span>
                <span className="sm:hidden">Refresh</span>
              </button>
            </div>
          </div>

          {/* Primary Metrics Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">+12%</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Total Customers</p>
              <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">{metrics?.riskSummary?.totalCustomers ?? '-'}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">+5%</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Active Loans</p>
              <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">{metrics?.loanPerformance?.activeLoans ?? '-'}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 rounded-lg bg-amber-100">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-full">
                  <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                  <span className="text-xs font-medium text-red-700">-3%</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Fraud Alerts</p>
              <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">{metrics?.fraudAlerts?.total ?? '-'}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 rounded-lg bg-red-100">
                  <ShieldX className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-full">
                  <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                  <span className="text-xs font-medium text-red-700">-2%</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Compliance Fails</p>
              <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">{metrics?.complianceFails ?? '-'}</p>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">+8%</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Total Transaction Volume</p>
              <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">
                {metrics?.totalTransactionVolume 
                  ? `$${(metrics.totalTransactionVolume / 1000000).toFixed(1)}M`
                  : '-'}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">+2%</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Avg Credit Score</p>
              <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">{metrics?.riskSummary?.averageRiskScore ?? '-'}</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
            {chartData?.loanPerformance && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Loan Performance (30 Days)</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>Performance</span>
                  </div>
                </div>
                <div className="h-48 sm:h-64">
                  <AreaChartComponent
                    title="Loan Performance"
                    data={chartData.loanPerformance}
                    color="hsl(199, 89%, 48%)"
                    gradientId="loanGradient"
                  />
                </div>
              </div>
            )}
            {chartData?.transactionVolume && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Transaction Volume (30 Days)</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Volume</span>
                  </div>
                </div>
                <div className="h-48 sm:h-64">
                  <AreaChartComponent
                    title="Transaction Volume"
                    data={chartData.transactionVolume}
                    color="hsl(142, 76%, 36%)"
                    gradientId="txGradient"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
            {chartData?.fraudAlertsByDay && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Fraud Alerts (7 Days)</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span>Alerts</span>
                  </div>
                </div>
                <div className="h-48 sm:h-64">
                  <BarChartComponent
                    title="Fraud Alerts"
                    data={chartData.fraudAlertsByDay}
                    color="hsl(0, 84%, 60%)"
                  />
                </div>
              </div>
            )}
            {chartData?.complianceBreakdown && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">KYC Status Breakdown</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <span>Status Distribution</span>
                  </div>
                </div>
                <div className="h-48 sm:h-64">
                  <PieChartComponent
                    title="KYC Status"
                    data={chartData.complianceBreakdown}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
