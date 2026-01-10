import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesDataPoint } from '@/types';

interface AreaChartComponentProps {
  data: TimeSeriesDataPoint[];
  title: string;
  color?: string;
  gradientId?: string;
}

export function AreaChartComponent({
  data,
  title,
  color = 'hsl(199, 89%, 48%)',
  gradientId = 'colorValue',
}: AreaChartComponentProps) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
              return `$${value}`;
            }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              color: '#111827',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number) => {
              if (value >= 1000000) return [`$${(value / 1000000).toFixed(2)}M`, 'Value'];
              if (value >= 1000) return [`$${(value / 1000).toFixed(1)}k`, 'Value'];
              return [`$${value.toLocaleString()}`, 'Value'];
            }}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              });
            }}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: 'white' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}