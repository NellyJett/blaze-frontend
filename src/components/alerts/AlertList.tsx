import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { setSelectedAlert, setSeverityFilter, setStatusFilter, fetchAlerts, fetchAlertById } from '@/store/slices/alertsSlice';
import { Alert, AlertSeverity } from '@/types';
import { cn } from '@/lib/utils';
import { StatusBadge, getAlertSeverityType } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';
import { AlertTriangle, Shield, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const alertTypeIcons: Record<Alert['type'], React.ReactNode> = {
  fraud: <AlertTriangle className="h-5 w-5" />,
  aml: <Shield className="h-5 w-5" />,
  compliance: <Clock className="h-5 w-5" />,
};

// Type guard to ensure severity is valid
const isValidAlertSeverity = (severity: string): severity is AlertSeverity => {
  return ['critical', 'high', 'medium', 'low'].includes(severity);
};

export function AlertList() {
  const dispatch = useAppDispatch();
  const { alerts, selectedAlert, severityFilter, statusFilter, loading, pagination } = useAppSelector(
    (state) => state.alerts
  );

  const handlePageChange = (newPage: number) => {
    dispatch(fetchAlerts({
      page: newPage,
      limit: 20,
      severity: severityFilter,
      status: statusFilter,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={severityFilter}
          onValueChange={(value) => dispatch(setSeverityFilter(value as AlertSeverity | 'all'))}
        >
          <SelectTrigger className="w-40 bg-white text-gray-900">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => dispatch(setStatusFilter(value as Alert['status'] | 'all'))}
        >
          <SelectTrigger className="w-40 bg-white text-gray-900">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert List */}
      <div className="space-y-2">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
          ))
        ) : alerts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-600">No alerts match your filters</p>
          </div>
        ) : (
          <>
            {alerts.map((alert) => {
              const statusType = isValidAlertSeverity(alert.severity) 
                ? getAlertSeverityType(alert.severity)
                : getAlertSeverityType('medium');
              
              return (
                <div
                  key={alert.id}
                  onClick={() => dispatch(fetchAlertById(alert.id))}
                  className={cn(
                    'cursor-pointer rounded-lg border p-4 transition-all',
                    selectedAlert?.id === alert.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg',
                          alert.severity === 'critical' && 'bg-red-100 text-red-600',
                          alert.severity === 'high' && 'bg-red-100 text-red-600',
                          alert.severity === 'medium' && 'bg-yellow-100 text-yellow-600',
                          alert.severity === 'low' && 'bg-blue-100 text-blue-600'
                        )}
                      >
                        {alertTypeIcons[alert.type]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{alert.title}</p>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="mt-3 flex items-center gap-4">
                    <StatusBadge
                      status={statusType}
                      label={alert.severity}
                      size="sm"
                    />
                    <span className="text-xs text-gray-600 capitalize">
                      {alert.status}
                    </span>
                    <span className="text-xs text-gray-600">
                      {alert.timestamp ? format(new Date(alert.timestamp), 'MMM d, HH:mm') : 'N/A'}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="bg-white"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="bg-white"
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}