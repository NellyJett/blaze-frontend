import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesDataPoint } from '@/types';

interface BarChartComponentProps {
  data: TimeSeriesDataPoint[];
  title: string;
  color?: string;
}

export function BarChartComponent({
  data,
  title,
  color = 'hsl(199, 89%, 48%)',
}: BarChartComponentProps) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              return date.toLocaleDateString('en-US', { weekday: 'short' });
            }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
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
            formatter={(value: number) => [value, 'Alerts']}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              });
            }}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
          />
          <Bar
            dataKey="value"
            fill={color}
            radius={[4, 4, 0, 0]}
            stroke={color}
            strokeWidth={1}
            activeBar={{ 
              fill: color, 
              stroke: color, 
              strokeWidth: 2,
              fillOpacity: 0.9 
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}