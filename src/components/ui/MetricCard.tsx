import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary/10 border-primary/20',
  success: 'bg-success/10 border-success/20',
  warning: 'bg-warning/10 border-warning/20',
  destructive: 'bg-destructive/10 border-destructive/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/20 text-primary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  destructive: 'bg-destructive/20 text-destructive',
};

export function MetricCard({
  title,
  value,
  icon,
  trend,
  className,
  variant = 'default',
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-6 transition-all hover:shadow-lg',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg',
            iconStyles[variant]
          )}
        >
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          {trend.direction === 'up' && (
            <TrendingUp className="h-4 w-4 text-success" />
          )}
          {trend.direction === 'down' && (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          {trend.direction === 'neutral' && (
            <Minus className="h-4 w-4 text-muted-foreground" />
          )}
          <span
            className={cn(
              'text-sm font-medium',
              trend.direction === 'up' && 'text-success',
              trend.direction === 'down' && 'text-destructive',
              trend.direction === 'neutral' && 'text-muted-foreground'
            )}
          >
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-sm text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}
