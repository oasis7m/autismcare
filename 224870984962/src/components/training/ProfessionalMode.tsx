import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { toast } from 'sonner';

const mockData = {
  daily: [
    { date: "2023-01-01", successRate: 65, games: 3 },
    { date: "2023-01-02", successRate: 68, games: 3 },
    { date: "2023-01-03", successRate: 72, games: 3 },
    { date: "2023-01-04", successRate: 70, games: 2 },
    { date: "2023-01-05", successRate: 75, games: 3 },
    { date: "2023-01-06", successRate: 78, games: 3 },
    { date: "2023-01-07", successRate: 80, games: 3 }
  ],
  weekly: Array.from({length: 12}, (_, i) => ({
    week: `第${i+1}周`,
    successRate: 65 + Math.floor(Math.random() * 20),
    games: 15 + Math.floor(Math.random() * 10)
  })),
  monthly: Array.from({length: 6}, (_, i) => ({
    month: `${i+1}月`,
    successRate: 60 + Math.floor(Math.random() * 25),
    games: 60 + Math.floor(Math.random() * 30)
  })),
  yearly: Array.from({length: 2}, (_, i) => ({
    year: `202${i+3}`,
    successRate: 65 + Math.floor(Math.random() * 20),
    games: 300 + Math.floor(Math.random() * 100)
  }))
};

export default function ProfessionalMode() {
  const [timeRange, setTimeRange] = useState('daily');
  const handleExport = () => {
    toast.success('PDF报告已生成并下载');
  };

  const getChartData = () => {
    switch(timeRange) {
      case 'daily':
        return mockData.daily.map(session => ({
          date: session.date.split('-')[2],
          成功率: session.successRate,
          游戏数: session.games
        }));
      case 'weekly':
        return mockData.weekly;
      case 'monthly':
        return mockData.monthly;
      case 'yearly':
        return mockData.yearly;
      default:
        return mockData.daily;
    }
  };

  const todaySuccessRate = mockData.daily.length > 0 
    ? mockData.daily[mockData.daily.length - 1].successRate
    : 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#7EC8E3] font-comic mb-6 text-center">专业分析模式</h2>
      
      <div className="bg-white/90 p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-bold text-[#7EC8E3] font-comic mb-4">当天表现</h3>
        <div className="text-center">
          <div className="text-5xl font-bold text-[#FFD166] mb-2">{todaySuccessRate}%</div>
          <div className="text-lg text-[#7EC8E3]">平均成功率</div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        {['daily', 'weekly', 'monthly', 'yearly'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-comic ${
              timeRange === range 
                ? 'bg-[#7EC8E3] text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {range === 'daily' ? '日' : range === 'weekly' ? '周' : range === 'monthly' ? '月' : '年'}
          </button>
        ))}
      </div>

      <div className="bg-white/90 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-[#7EC8E3] font-comic mb-4">
          {timeRange === 'daily' ? '每日' : timeRange === 'weekly' ? '每周' : timeRange === 'monthly' ? '每月' : '每年'}训练趋势
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={timeRange === 'daily' ? 'date' : 
                          timeRange === 'weekly' ? 'week' : 
                          timeRange === 'monthly' ? 'month' : 'year'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="成功率" 
              stroke="#FFD166" 
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center">
        <button
          onClick={handleExport}
          className="bg-[#7EC8E3] text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-[#6ab7d8] transition"
        >
          <i className="fa-solid fa-file-pdf mr-2"></i>
          导出PDF报告
        </button>
      </div>
    </div>
  );
}