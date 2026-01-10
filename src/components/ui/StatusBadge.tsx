import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<StatusType, string> = {
  success: 'bg-success/20 text-success border-success/30',
  warning: 'bg-warning/20 text-warning border-warning/30',
  error: 'bg-destructive/20 text-destructive border-destructive/30',
  info: 'bg-primary/20 text-primary border-primary/30',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ status, label, className, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        statusStyles[status],
        className
      )}
    >
      <span className={cn(
        'rounded-full',
        size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
        status === 'success' && 'bg-success',
        status === 'warning' && 'bg-warning',
        status === 'error' && 'bg-destructive',
        status === 'info' && 'bg-primary',
        status === 'neutral' && 'bg-muted-foreground'
      )} />
      {label}
    </span>
  );
}

// Helper function to map various statuses to StatusType
export function getKYCStatusType(status: string): StatusType {
  switch (status) {
    case 'verified':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'neutral';
  }
}

export function getAlertSeverityType(severity: string): StatusType {
  switch (severity) {
    case 'low':
      return 'info';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
    case 'critical':
      return 'error';
    default:
      return 'neutral';
  }
}

export function getTransactionStatusType(status: string): StatusType {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    case 'flagged':
      return 'error';
    default:
      return 'neutral';
  }
}
