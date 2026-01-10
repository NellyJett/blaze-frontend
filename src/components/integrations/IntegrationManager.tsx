import React, { useState, useEffect } from 'react';
import { Plug, RefreshCw, CheckCircle, AlertCircle, ExternalLink, Settings2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { integrationApi } from '@/services/api';
import { toast } from 'sonner';

interface Integration {
  id?: string;
  provider: 'PLAID' | 'MONO' | 'CORE_BANKING';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING';
  lastSyncAt?: string;
  error?: string;
}

const PROVIDER_INFO = {
  PLAID: {
    name: 'Plaid',
    description: 'Connect to global bank accounts and financial institutions.',
    logo: 'https://plaid.com/favicon.ico',
    color: 'bg-blue-950 text-white',
  },
  MONO: {
    name: 'Mono',
    description: 'Connect to African bank accounts and financial data.',
    logo: 'https://mono.co/favicon.ico',
    color: 'bg-blue-600 text-white',
  },
  CORE_BANKING: {
    name: 'Core Banking',
    description: 'Direct integration with your internal banking system (Orion/Temenos).',
    logo: null,
    color: 'bg-emerald-600 text-white',
  }
};

export function IntegrationManager() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingProviders, setSyncingProviders] = useState<string[]>([]);

  const fetchIntegrations = async () => {
    try {
      const response = await integrationApi.getIntegrations();
      setIntegrations(response.data);
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleConnect = async (provider: string) => {
    // In a real app, this would open Plaid Link or Mono Connect widget
    toast.info(`Connecting to ${provider}...`);
    
    try {
      // Mocking the successful connection and credential save
      await integrationApi.configure(provider, { 
        apiKey: 'sk_live_test_' + Math.random().toString(36).substring(7),
        environment: 'production'
      });
      
      toast.success(`${provider} connected successfully`);
      fetchIntegrations();
    } catch (error) {
      toast.error(`Failed to connect ${provider}`);
    }
  };

  const handleSync = async (provider: string) => {
    setSyncingProviders(prev => [...prev, provider]);
    toast.info(`Starting sync for ${provider}...`);

    try {
      const response = await integrationApi.sync(provider);
      if (response.data.success) {
        toast.success(`Sync complete: ${response.data.imported} new customers imported`);
      } else {
        toast.error(`Sync failed: ${response.data.error}`);
      }
      fetchIntegrations();
    } catch (error) {
      toast.error(`Sync failed for ${provider}`);
    } finally {
      setSyncingProviders(prev => prev.filter(p => p !== provider));
    }
  };

  const getIntegrationForProvider = (provider: string) => {
    return integrations.find(i => i.provider === provider);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-sm text-gray-500 font-medium">Loading integrations...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {(Object.keys(PROVIDER_INFO) as Array<keyof typeof PROVIDER_INFO>).map((providerKey) => {
        const info = PROVIDER_INFO[providerKey];
        const integration = getIntegrationForProvider(providerKey);
        const isSyncing = syncingProviders.includes(providerKey) || integration?.status === 'SYNCING';
        const isConnected = integration?.status === 'CONNECTED' || integration?.status === 'SYNCING' || integration?.status === 'ERROR';

        return (
          <Card key={providerKey} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${info.color}`}>
                  <Plug className="h-5 w-5" />
                </div>
                {integration ? (
                  <Badge 
                    variant={integration.status === 'ERROR' ? 'destructive' : 'outline'}
                    className={
                      integration.status === 'CONNECTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      integration.status === 'SYNCING' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''
                    }
                  >
                    {integration.status}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-500">Not Configured</Badge>
                )}
              </div>
              <CardTitle className="text-lg">{info.name}</CardTitle>
              <CardDescription className="line-clamp-2 h-10">
                {info.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-0">
              {integration && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Last Sync</span>
                    <span className="font-medium text-gray-900">
                      {integration.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleString() : 'Never'}
                    </span>
                  </div>
                  {integration.error && (
                    <div className="flex items-start gap-2 p-2 bg-red-50 rounded text-[10px] text-red-700 border border-red-100">
                      <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{integration.error}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50/50 border-t border-gray-100 pt-4 flex flex-col gap-2">
              {isConnected ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full h-9 text-xs gap-2"
                    disabled={isSyncing}
                    onClick={() => handleSync(providerKey)}
                  >
                    {isSyncing ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                    Sync Now
                  </Button>
                  <Button variant="ghost" className="w-full h-9 text-[10px] text-gray-500 gap-2">
                    <Settings2 className="h-3 w-3" />
                    Manage Connection
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full gap-2 h-10" 
                  onClick={() => handleConnect(providerKey)}
                >
                  <ExternalLink className="h-4 w-4" />
                  Connect Account
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
