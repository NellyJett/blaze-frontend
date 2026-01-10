import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Info } from 'lucide-react';
import { userApi } from '@/services/api';
import { PlanConfig } from '@/types/organization';

export function Pricing() {
  const [plans, setPlans] = useState<Record<string, PlanConfig> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await userApi.getPricingConfig();
        setPlans(response.data);
      } catch (error) {
        console.error('Failed to fetch pricing config:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return <div className="flex h-96 items-center justify-center">Loading pricing plans...</div>;
  }

  if (!plans) {
    return <div className="flex h-96 items-center justify-center text-red-500">Failed to load pricing plans.</div>;
  }

  const planKeys = ['FREE', 'GROWTH', 'ENTERPRISE'];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Pricing</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Scale your compliance and fraud operations with BlazeTech. Choose the plan that fits your institution's volume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {planKeys.map((key) => {
          const plan = plans[key];
          const isEnterprise = key === 'ENTERPRISE';
          const isGrowth = key === 'GROWTH';

          return (
            <Card key={key} className={`relative flex flex-col border-2 ${isGrowth ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
              {isGrowth && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-blue-600 text-white hover:bg-blue-700">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">{key}</CardTitle>
                <CardDescription>
                  {isEnterprise ? 'For large-scale institutions' : isGrowth ? 'For growing fintechs' : 'Start for free'}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {isEnterprise ? 'Custom' : isGrowth ? '$499' : '$0'}
                  </span>
                  {!isEnterprise && <span className="text-gray-500">/mo</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" /> Limits
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {plan.maxCustomers.toLocaleString()} Customers
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {plan.maxTransactionsPerMonth.toLocaleString()} Transactions /mo
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Features</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className={`h-4 w-4 ${plan.modules.fraud ? 'text-green-500' : 'text-gray-300'}`} />
                      Fraud Detection
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className={`h-4 w-4 ${plan.modules.aml ? 'text-green-500' : 'text-gray-300'}`} />
                      AML Screening
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className={`h-4 w-4 ${plan.modules.compliance ? 'text-green-500' : 'text-gray-300'}`} />
                      Compliance Engine
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className={`h-4 w-4 ${plan.modules.creditScoring ? 'text-green-500' : 'text-gray-300'}`} />
                      Credit Scoring
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${isGrowth ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'}`}
                  variant={isGrowth || isEnterprise ? 'default' : 'outline'}
                  disabled={!isEnterprise}
                >
                  {isEnterprise ? 'Contact Sales' : 'Coming Soon'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-blue-900">Need a custom enterprise solution?</h3>
          <p className="text-blue-700 text-sm">Dedicated support, custom rules, and unlimited transaction volume.</p>
        </div>
        <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">Talk to our experts</Button>
      </div>
    </div>
  );
}
