import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, Label, Scatter, ScatterChart, ComposedChart,
  Area, Brush
} from 'recharts';
import NavBar from '@/components/NavBar';

// Mock数据
const mockData = {
  milestones: [
    { date: "2023-01-05", event: "首次完成日常训练", accuracy: 65 },
    { date: "2023-01-12", event: "完成第一幅拼图", accuracy: 70 },
    { date: "2023-01-20", event: "准确率突破80%", accuracy: 82 }
  ],
  comparisons: {
    daily: 65,
    game: 45,
    pro: 70
  },
  charts: {
    mainChart: {
      data: [
        { date: "2023-01-01", daily: 60, game: 30, pro: 55 },
        { date: "2023-01-08", daily: 65, game: 40, pro: 60 },
        { date: "2023-01-15", daily: 70, game: 45, pro: 65 },
        { date: "2023-01-22", daily: 75, game: 50, pro: 70 },
        { date: "2023-01-29", daily: 78, game: 55, pro: 72 }
      ],
      annotations: [
        { date: "2023-01-05", note: "日常训练", y: 65 },
        { date: "2023-01-12", note: "拼图完成", y: 70 },
        { date: "2023-01-20", note: "突破80%", y: 82 }
      ]
    }
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('week');
  
  const handleBack = () => {
    navigate('/');
  };

  const handleExport = () => {
    toast.success('PDF报告已生成并下载');
  };

  // 处理日期范围变化
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    toast(`已切换至${range === 'week' ? '周' : '月'}视图`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7EC8E3]/20 to-[#FFD166]/20">
      {/* 顶部导航 */}
      <NavBar activeTab="dashboard" />
      
      {/* 返回按钮 */}
      <button 
        onClick={handleBack}
        className="absolute top-20 left-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
      >
        <i className="fa-solid fa-arrow-left text-[#7EC8E3] text-xl"></i>
      </button>

      <div className="container mx-auto pt-24 px-4 pb-20">
        {/* 筛选控件 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-[#7EC8E3] font-comic mb-4">数据筛选</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleDateRangeChange('week')}
              className={`px-4 py-2 rounded-lg font-comic ${
                dateRange === 'week' ? 'bg-[#7EC8E3] text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <i className="fa-solid fa-calendar-week mr-2"></i>
              本周数据
            </button>
            <button
              onClick={() => handleDateRangeChange('month')}
              className={`px-4 py-2 rounded-lg font-comic ${
                dateRange === 'month' ? 'bg-[#7EC8E3] text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <i className="fa-solid fa-calendar-days mr-2"></i>
              本月数据
            </button>
          </div>
        </div>

        {/* 模式对比 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-[#7EC8E3] font-comic mb-4">模式对比</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(mockData.comparisons).map(([mode, value]) => (
              <div key={mode} className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-bold text-[#7EC8E3] font-comic mb-2">
                  {mode === 'daily' ? '日常模式' : mode === 'game' ? '游戏模式' : '专业模式'}
                </h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-[#FFD166] h-4 rounded-full" 
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 font-bold text-[#7EC8E3]">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 主图表 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-[#7EC8E3] font-comic mb-4">学习进度趋势</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={mockData.charts.mainChart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Brush dataKey="date" height={30} stroke="#7EC8E3" />
              <Line 
                type="monotone" 
                dataKey="daily" 
                stroke="#FFD166" 
                strokeWidth={2}
                name="日常模式"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="game" 
                stroke="#7EC8E3" 
                strokeWidth={2}
                name="游戏模式"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="pro" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="专业模式"
                dot={{ r: 4 }}
              />
              {mockData.charts.mainChart.annotations.map((anno, index) => (
                <ReferenceLine
                  key={index}
                  x={anno.date}
                  stroke="#FFD166"
                  strokeDasharray="3 3"
                >
                  <Label 
                    value={anno.note} 
                    position="insideTopRight" 
                    fill="#FFD166"
                    className="font-comic"
                  />
                </ReferenceLine>
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 里程碑 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#7EC8E3] font-comic mb-4">重要里程碑</h2>
          <div className="space-y-4">
            {mockData.milestones.map((milestone, index) => (
              <div 
                key={index} 
                className="bg-[#FFD166]/20 p-4 rounded-xl border-l-4 border-[#FFD166]"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#7EC8E3] font-comic">
                    {milestone.event}
                  </h3>
                  <span className="text-sm text-gray-600">{milestone.date}</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#7EC8E3] h-2 rounded-full" 
                        style={{ width: `${milestone.accuracy}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-bold text-[#7EC8E3]">
                      {milestone.accuracy}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 导出按钮 */}
        <div className="mt-6 text-center">
          <button
            onClick={handleExport}
            className="bg-[#7EC8E3] text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-[#6ab7d8] transition"
          >
            <i className="fa-solid fa-file-pdf mr-2"></i>
            导出PDF报告
          </button>
        </div>
      </div>
    </div>
  );
}
