import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCreditScore } from '@/store/slices/customersSlice';
import { getScoreColor, getScoreBgColor } from '@/services/creditScoring';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

export function CreditScoreDisplay() {
  const dispatch = useAppDispatch();
  const { selectedCustomerId, creditScore, loading } = useAppSelector((state) => state.customers);

  useEffect(() => {
    if (selectedCustomerId) {
      dispatch(fetchCreditScore(selectedCustomerId));
    }
  }, [dispatch, selectedCustomerId]);

  if (loading || !selectedCustomerId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
        <div className="flex items-baseline gap-3 mb-6">
          <div className="h-12 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-12 bg-gray-100 rounded" />
        </div>
        <div className="h-3 w-full bg-gray-200 rounded" />
      </div>
    );
  }

  if (!creditScore) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
        <Info className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">
          Unable to calculate credit score
        </p>
      </div>
    );
  }

  const bucket = creditScore?.label || 'poor';

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-gray-600">Credit Score</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className={cn('text-5xl font-bold', getScoreColor(bucket))}>
                {creditScore.score}
              </span>
              <span className="text-lg text-gray-500">/ 100</span>
            </div>
          </div>
          <div
            className={cn(
              'rounded-xl px-6 py-3 text-center min-w-[180px]',
              getScoreBgColor(bucket)
            )}
          >
            <p className={cn('text-2xl font-bold capitalize', getScoreColor(bucket))}>
              {bucket}
            </p>
            <p className="text-sm text-gray-600">Risk Level</p>
          </div>
        </div>

        {/* Score Bar */}
        <div className="mt-6">
          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className={cn(
                'h-full transition-all duration-500',
                bucket === 'excellent' && 'bg-green-500',
                bucket === 'good' && 'bg-blue-500',
                bucket === 'fair' && 'bg-amber-500',
                bucket === 'poor' && 'bg-red-500'
              )}
              style={{ width: `${creditScore.score}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Factors */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Score Factors
        </h3>
        <div className="space-y-4">
          {creditScore.factors.map((factor: { name: string; impact: string; description: string; value: number; weight: number }, index: number) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {factor.impact === 'positive' && (
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  {factor.impact === 'negative' && (
                    <TrendingDown className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  {factor.impact === 'neutral' && (
                    <Minus className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{factor.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {factor.description}
                    </p>
                  </div>
                </div>
                <div className="text-right sm:text-left sm:min-w-[120px]">
                  <p className="font-mono text-lg font-bold text-gray-900">
                    {(factor.value || 0).toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Weight: {((factor.weight || 0) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}