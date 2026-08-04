'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: ChartData[];
}

export default function SolidContentChart({ data }: Props) {
  // 0보다 큰 데이터만 필터링하고 높은 순으로 정렬
  const validData = data
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalValue = validData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full flex flex-col items-center">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
          <Pie
            data={validData}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={0}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            labelLine={false}
            label={false}
          >
            {validData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => `${Number(value).toFixed(2)}g`} />
          <Legend 
            verticalAlign="bottom"
            align="center"
            content={(props) => {
              const { payload } = props;
              return (
                <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-2">
                  {payload?.map((entry, index) => {
                    const originalData = entry.payload as ChartData;
                    const percent = totalValue > 0 ? ((originalData.value / totalValue) * 100).toFixed(1) : '0.0';
                    return (
                      <li key={`item-${index}`} className="flex items-center gap-1.5 text-xs sm:text-sm">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-700 font-medium whitespace-nowrap">
                          {entry.value} ({percent}%)
                        </span>
                      </li>
                    );
                  })}
                </ul>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
