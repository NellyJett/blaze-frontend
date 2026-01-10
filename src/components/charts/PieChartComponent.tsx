import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

interface PieChartComponentProps {
  data: PieDataPoint[];
  title: string;
}

export function PieChartComponent({ data, title }: PieChartComponentProps) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
            labelLine={false}
            label={({ name, percent }) => 
              percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
            }
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              color: '#111827',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '14px',
            }}
            formatter={(value: number, name: string, props) => {
              const total = data.reduce((sum, item) => sum + item.value, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return [`${value} (${percentage}%)`, name];
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            iconSize={8}
            formatter={(value, entry) => {
              const item = data.find(d => d.name === value);
              const total = data.reduce((sum, d) => sum + d.value, 0);
              const percentage = item ? ((item.value / total) * 100).toFixed(1) : '0';
              return (
                <span className="text-sm text-gray-700">
                  {value}: {item?.value} ({percentage}%)
                </span>
              );
            }}
            wrapperStyle={{
              paddingLeft: '20px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}