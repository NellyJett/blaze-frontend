import { useEffect, useMemo, useState } from 'react';
import {
  Database,
  Plug,
  Server,
  AlertTriangle,
  FileUp,
  Globe,
} from 'lucide-react';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCustomers } from '@/store/slices/customersSlice';

import { MetricCard } from '@/components/ui/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataImporter } from '@/components/ingestion/DataImporter';
import { IntegrationManager } from '@/components/integrations/IntegrationManager';

import { integrationApi } from '@/services/api';

/* ===================== TYPES ===================== */

type IntegrationType = 'Bank' | 'Core System' | 'API' | 'Third-party';
type IntegrationStatus = 'connected' | 'pending' | 'error';

interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  lastSync: string;
  environment: 'Production' | 'Sandbox';
}

/** What the backend returns */
interface BackendIntegration {
  id: string;
  provider: 'MONO' | 'PLAID' | 'CORE_BANKING';
  status: 'CONNECTED' | 'SYNCING' | 'ERROR';
  lastSyncAt?: string | null;
  createdAt: string;
}

/* ===================== COMPONENT ===================== */

export function DataIntegrations() {
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(false);

  /* ---------- Upload success stays the same ---------- */
  const handleImportSuccess = () => {
    dispatch(fetchCustomers());
  };

  /* ---------- Load integrations from backend ---------- */
  useEffect(() => {
    const loadIntegrations = async () => {
      try {
        setLoadingIntegrations(true);

        const res = await integrationApi.getIntegrations();

        const mapped: Integration[] = res.data.map(
          (i: BackendIntegration): Integration => ({
            id: i.id,
            name:
              i.provider === 'MONO'
                ? 'Mono'
                : i.provider === 'PLAID'
                ? 'Plaid'
                : 'Core Banking',
            type:
              i.provider === 'CORE_BANKING'
                ? 'Core System'
                : 'Third-party',
            status:
              i.status === 'CONNECTED'
                ? 'connected'
                : i.status === 'ERROR'
                ? 'error'
                : 'pending',
            lastSync: i.lastSyncAt ?? i.createdAt,
            environment: 'Production',
          })
        );

        setIntegrations(mapped);
      } catch (error) {
        console.error('Failed to load integrations', error);
      } finally {
        setLoadingIntegrations(false);
      }
    };

    loadIntegrations();
  }, []);

  /* ---------- Metrics ---------- */
  const metrics = useMemo(() => {
    const total = integrations.length;
    const connected = integrations.filter(i => i.status === 'connected').length;
    const pending = integrations.filter(i => i.status === 'pending').length;
    const failing = integrations.filter(i => i.status === 'error').length;

    return { total, connected, pending, failing };
  }, [integrations]);

  /* ---------- Table columns ---------- */
  const columns = [
    {
      key: 'name',
      header: 'Integration',
      render: (integration: Integration) => (
        <div>
          <p className="font-medium text-gray-900">{integration.name}</p>
          <p className="text-xs text-gray-500 font-mono truncate">
            {integration.id}
          </p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (integration: Integration) => (
        <span className="text-sm text-gray-600">{integration.type}</span>
      ),
    },
    {
      key: 'environment',
      header: 'Environment',
      render: (integration: Integration) => (
        <Badge variant="outline">{integration.environment}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (integration: Integration) => {
        const tone =
          integration.status === 'connected'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
            : integration.status === 'pending'
            ? 'bg-amber-50 text-amber-800 border-amber-100'
            : 'bg-red-50 text-red-800 border-red-100';

        const label =
          integration.status === 'connected'
            ? 'Connected'
            : integration.status === 'pending'
            ? 'Pending'
            : 'Error';

        return (
          <span
            className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${tone}`}
          >
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
            {label}
          </span>
        );
      },
    },
    {
      key: 'lastSync',
      header: 'Last sync',
      render: (integration: Integration) => (
        <span className="font-mono text-xs text-gray-500">
          {new Date(integration.lastSync).toLocaleDateString()}
        </span>
      ),
    },
  ];

  /* ===================== UI ===================== */

  return (
    <div className="space-y-6">
      <Tabs defaultValue="integrations">
        <TabsList>
          <TabsTrigger value="integrations">
            <Globe className="h-4 w-4 mr-1" /> Live Integrations
          </TabsTrigger>
          <TabsTrigger value="upload">
            <FileUp className="h-4 w-4 mr-1" /> File Upload
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Server className="h-4 w-4 mr-1" /> Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <IntegrationManager />
        </TabsContent>

        <TabsContent value="upload">
          <DataImporter onSuccess={handleImportSuccess} />
        </TabsContent>

        <TabsContent value="inventory">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Connected systems" value={metrics.connected} icon={<Server />} />
            <MetricCard title="Active integrations" value={metrics.total} icon={<Database />} />
            <MetricCard title="Pending activations" value={metrics.pending} icon={<Plug />} />
            <MetricCard title="Failing connections" value={metrics.failing} icon={<AlertTriangle />} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration inventory</CardTitle>
              <CardDescription>
                Overview of all bank, core, and third-party connections.
              </CardDescription>
            </CardHeader>
            <CardContent>
            {loadingIntegrations ? (
              <div className="flex items-center justify-center py-10 text-sm text-gray-500">
                Loading integrations…
              </div>
            ) : (
              <DataTable
                data={integrations}
                columns={columns}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                emptyMessage="No integrations configured yet."
              />
            )}

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
