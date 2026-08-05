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
        <PieChart margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
          <Pie
            data={validData}
            cx="50%"
            cy="68%"
            innerRadius={50}
            outerRadius={85}
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
              
              // 비중이 작은 조각(8% 미만)은 텍스트가 잘리지 않도록 차트 위쪽 텅 빈 공간에 가로로 쫙 펼쳐서(지그재그) 배치
              if (percent < 0.08) {
                const total = validData.reduce((sum, item) => sum + item.value, 0);
                const smallStartIndex = validData.findIndex(d => (d.value / total) < 0.08);
                const smallCount = validData.length - smallStartIndex;
                const smallIndex = index - smallStartIndex;
                
                // Y축: 위쪽 공간을 활용하여 지그재그(높낮이 교차) 배치로 텍스트 상하 겹침 방지
                ey = cy - outerRadius - 20 - ((smallIndex % 2) * 35);
                
                // X축: 가운데(cx)를 기준으로 좌우 220px 너비에 골고루 분산 배치
                // index가 낮을수록(조금 더 큰 파이, 왼쪽에 위치) 텍스트도 왼쪽에 배치하여 선 꼬임 방지
                const spreadWidth = 220; 
                const startX = cx - (spreadWidth / 2);
                const spacing = smallCount > 1 ? spreadWidth / (smallCount - 1) : 0;
                ex = startX + (smallIndex * spacing);
              }
              
              const textAnchor = percent < 0.08 ? 'middle' : (cos >= 0 ? 'start' : 'end');
              const textX = percent < 0.08 ? ex : ex + (cos >= 0 ? 1 : -1) * 8;
              
              return (
                <g>
                  <path d={`M${sx},${sy}L${ex},${ey}`} stroke="#9ca3af" fill="none" />
                  <text 
                    x={textX} 
                    y={ey} 
                    textAnchor={textAnchor} 
                    fill="#374151" 
                    fontSize={11}
                    fontWeight={500}
                  >
                    {/* 상하(위아래)로 텍스트 배치하여 가로 길이 단축 */}
                    <tspan x={textX} dy="-0.4em">{name}</tspan>
                    <tspan x={textX} dy="1.2em">({(percent * 100).toFixed(1)}%)</tspan>
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
