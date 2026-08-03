'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

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

  return (
    <div className="w-full flex flex-col items-center">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 20, right: 45, bottom: 20, left: 45 }}>
          <Pie
            data={validData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={0}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            labelLine={false}
            label={(props: any) => {
              const { name, percent, cx = 0, cy = 0, midAngle = 0, outerRadius = 0, index } = props;
              const RADIAN = Math.PI / 180;
              const sin = Math.sin(-midAngle * RADIAN);
              const cos = Math.cos(-midAngle * RADIAN);
              
              const sx = cx + outerRadius * cos;
              const sy = cy + outerRadius * sin;
              
              let ex = cx + (outerRadius + 20) * cos;
              let ey = cy + (outerRadius + 20) * sin;
              
              // 비중이 작은 조각(8% 미만)은 텍스트가 겹치지 않도록 위치를 위로/바깥으로 분산시킵니다.
              if (percent < 0.08) {
                ey = ey - (index * 14) + 40;
                ex = ex + (cos >= 0 ? 1 : -1) * (index * 5);
              }
              
              const textAnchor = cos >= 0 ? 'start' : 'end';
              
              return (
                <g>
                  <path d={`M${sx},${sy}L${ex},${ey}`} stroke="#9ca3af" fill="none" />
                  <text 
                    x={ex + (cos >= 0 ? 1 : -1) * 8} 
                    y={ey} 
                    textAnchor={textAnchor} 
                    fill="#374151" 
                    dominantBaseline="central"
                    fontSize={11}
                    fontWeight={500}
                  >
                    {`${name}(${(percent * 100).toFixed(1)}%)`}
                  </text>
                </g>
              );
            }}
          >
            {validData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => `${Number(value).toFixed(2)}g`} />
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}
