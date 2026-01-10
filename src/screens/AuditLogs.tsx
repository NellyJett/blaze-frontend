import { useEffect, useMemo, useState } from 'react';
import { Filter, ShieldCheck } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchAuditLogs } from '@/store/slices/auditLogsSlice';
import { AuditLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';

export function AuditLogs() {
  const dispatch = useAppDispatch();
  const { logs, loading } = useAppSelector((state) => state.auditLogs);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState<string | 'all'>('all');

  useEffect(() => {
    dispatch(fetchAuditLogs(undefined));
  }, [dispatch]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesUser =
        !userFilter ||
        (log.metadata?.user as string | undefined)?.toLowerCase().includes(userFilter.toLowerCase());

      const matchesAction =
        actionFilter === 'all' ||
        (log.metadata?.action as string | undefined)?.toLowerCase() === actionFilter.toLowerCase();

      return matchesUser && matchesAction;
    });
  }, [logs, userFilter, actionFilter]);

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (log: AuditLog) => (
        <span className="font-mono text-xs text-muted-foreground">
          {new Date(log.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (log: AuditLog) => (
        <div>
          <p className="text-sm font-medium text-foreground">
            {(log.metadata?.user as string) || 'System'}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {(log.metadata?.userId as string) || '—'}
          </p>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (log: AuditLog) => (
        <div>
          <p className="text-sm text-foreground">
            {(log.metadata?.action as string) || log.ruleName}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1">{log.details}</p>
        </div>
      ),
    },
    {
      key: 'entity',
      header: 'Entity',
      render: (log: AuditLog) => (
        <div className="text-xs text-muted-foreground font-mono">
          {log.customerId && <div>Customer: {log.customerId}</div>}
          {log.transactionId && <div>Txn: {log.transactionId}</div>}
        </div>
      ),
    },
    {
      key: 'source',
      header: 'IP / Source',
      render: (log: AuditLog) => (
        <div className="text-xs text-muted-foreground font-mono">
          {(log.metadata?.ip as string) || '10.0.0.1'}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">
            Immutable, regulator-grade activity history across customers, rules, and data operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:inline-flex bg-gray-100 text-black">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Export for Regulator
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">Filter activity</CardTitle>
            <CardDescription>
              Narrow the log to specific users, actions, or entities. All events are stored immutably.
            </CardDescription>
          </div>
          <Filter className="hidden h-4 w-4 text-muted-foreground md:block" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">User</label>
              <Input
                placeholder="Search by user name or ID"
                value={userFilter}
                className='bg-gray-100'
                onChange={(e) => {
                  setCurrentPage(1);
                  setUserFilter(e.target.value);
    
                }}
              />
            </div>
            <div className="space-y-1.5 ">
              <label className="text-xs font-medium text-muted-foreground">Action type</label>
              <Select
                value={actionFilter}
                onValueChange={(value) => {
                  setCurrentPage(1);
                  setActionFilter(value as typeof actionFilter);
                }}
              >
                <SelectTrigger className="bg-gray-100 text-gray-500">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="configuration_change">Configuration change</SelectItem>
                  <SelectItem value="rule_update">Rule update</SelectItem>
                  <SelectItem value="export">Data export</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Time window</label>
              <Input
                placeholder="Last 24 hours"
                readOnly
                className="cursor-not-allowed bg-gray-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Activity log</CardTitle>
          <CardDescription>
            Read-only record of system and user events. Entries cannot be edited or deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredLogs}
            columns={columns}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            emptyMessage={loading ? 'Loading audit trail…' : 'No audit events for the selected filters.'}
          />
        </CardContent>
      </Card>
    </div>
  );
}


