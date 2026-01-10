import { useState } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Play, CheckCircle, XCircle, Clock, Code } from 'lucide-react';

interface TestResult {
  endpoint: string;
  method: string;
  status: number;
  data: unknown;
  duration: number;
  timestamp: string;
  success: boolean;
}

const endpoints = [
  { method: 'GET', path: '/api/customers', description: 'List all customers' },
  { method: 'GET', path: '/api/transactions', description: 'List all transactions' },
  { method: 'GET', path: '/api/fraud/alerts', description: 'List all alerts' },
  { method: 'GET', path: '/api/audit-logs', description: 'List audit logs' },
  { method: 'GET', path: '/api/dashboard/metrics', description: 'Dashboard metrics' },
  { method: 'GET', path: '/api/dashboard/charts', description: 'Chart data' },
  { method: 'POST', path: '/api/ingest/customers', description: 'Ingest customers' },
];

export function ApiTester() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [requestBody, setRequestBody] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      let response;
      if (selectedEndpoint.method === 'GET') {
        response = await api.get(selectedEndpoint.path);
      } else {
        const body = requestBody ? JSON.parse(requestBody) : {};
        response = await api.post(selectedEndpoint.path, body);
      }

      const result: TestResult = {
        endpoint: selectedEndpoint.path,
        method: selectedEndpoint.method,
        status: response.status,
        data: response.data,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        success: true,
      };

      setResults((prev) => [result, ...prev.slice(0, 9)]);
    } catch (error: unknown) {
      const err = error as { response?: { status: number; data: unknown } };
      const result: TestResult = {
        endpoint: selectedEndpoint.path,
        method: selectedEndpoint.method,
        status: err.response?.status || 500,
        data: err.response?.data || { error: 'Request failed' },
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        success: false,
      };

      setResults((prev) => [result, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const sampleIngestPayload = JSON.stringify(
    {
      type: 'transaction',
      data: {
        id: `tx_test_${Date.now()}`,
        customerId: 'cust_001',
        type: 'deposit',
        amount: 5000,
        currency: 'USD',
        timestamp: new Date().toISOString(),
        status: 'completed',
        description: 'Test Transaction',
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">API Tester</h1>
        <p className="text-muted-foreground">
          Test the mock API endpoints
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Builder */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Request Builder
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Endpoint
                </label>
                <Select
                  value={selectedEndpoint.path}
                  onValueChange={(value) =>
                    setSelectedEndpoint(endpoints.find((e) => e.path === value)!)
                  }
                >
                  <SelectTrigger className="bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {endpoints.map((endpoint) => (
                      <SelectItem key={endpoint.path} value={endpoint.path}>
                        <span className="font-mono text-primary">
                          {endpoint.method}
                        </span>{' '}
                        {endpoint.path}
                        <span className="ml-2 text-muted-foreground">
                          - {endpoint.description}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEndpoint.method === 'POST' && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">
                      Request Body (JSON)
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRequestBody(sampleIngestPayload)}
                    >
                      Load Sample
                    </Button>
                  </div>
                  <Textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder="Enter JSON payload..."
                    className="h-48 font-mono text-sm bg-muted"
                  />
                </div>
              )}

              <Button
                onClick={handleTest}
                disabled={loading}
                className="w-full"
              >
                <Play className="mr-2 h-4 w-4" />
                {loading ? 'Testing...' : 'Send Request'}
              </Button>
            </div>
          </div>

          {/* API Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Code className="h-4 w-4" />
              API Information
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Mock API simulates network latency (~300ms)</p>
              <p>• 5% chance of simulated errors</p>
              <p>• Data persists in-memory during session</p>
              <p>• POST /ingest accepts customer, transaction, or event payloads</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Response History
          </h2>

          {results.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">
                No requests sent yet. Select an endpoint and click "Send Request".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={cn(
                    'rounded-xl border p-4',
                    result.success
                      ? 'border-success/20 bg-success/5'
                      : 'border-destructive/20 bg-destructive/5'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      <div>
                        <p className="font-mono text-sm text-foreground">
                          <span className="text-primary">{result.method}</span>{' '}
                          {result.endpoint}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Status: {result.status}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {result.duration}ms
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 max-h-48 overflow-auto rounded bg-muted/50 p-3">
                    <pre className="font-mono text-xs text-muted-foreground">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
