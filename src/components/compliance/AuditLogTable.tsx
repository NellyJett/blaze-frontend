import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AuditLog } from '@/types';
import { format } from 'date-fns';
import { useState } from 'react';

export function AuditLogTable() {
  const { logs, loading } = useAppSelector((state) => state.auditLogs);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const getResultStatus = (result: AuditLog['result']) => {
    switch (result) {
      case 'pass':
        return 'success';
      case 'fail':
        return 'error';
      case 'flag':
        return 'warning';
    }
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (log: AuditLog) => (
        <span className="font-mono text-sm">
          {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
        </span>
      ),
    },
    {
      key: 'ruleName',
      header: 'Rule',
      render: (log: AuditLog) => (
        <div>
          <p className="font-medium text-foreground">{log.ruleName}</p>
          <p className="font-mono text-xs text-muted-foreground">{log.ruleId}</p>
        </div>
      ),
    },
    {
      key: 'customerId',
      header: 'Customer',
      render: (log: AuditLog) => (
        <span className="font-mono text-sm">{log.customerId}</span>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (log: AuditLog) => (
        <span className="text-sm text-muted-foreground line-clamp-2">
          {log.details}
        </span>
      ),
      className: 'max-w-xs',
    },
    {
      key: 'result',
      header: 'Result',
      render: (log: AuditLog) => (
        <StatusBadge
          status={getResultStatus(log.result)}
          label={log.result}
          size="sm"
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-xl bg-muted" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Audit Logs</h3>
        <span className="text-sm text-muted-foreground">
          {logs.length} total entries
        </span>
      </div>
      <DataTable
        data={logs}
        columns={columns}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        emptyMessage="No audit logs available"
        className="bg-white" 
      />
    </div>
  );
}
