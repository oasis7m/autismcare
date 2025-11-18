import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// 用户打卡数据结构
type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  completedToday: boolean;
  gamesCompleted: number;
  lastUpdated: string;
};

// 初始化数据
const initialStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  completedToday: false,
  gamesCompleted: 0,
  lastUpdated: new Date().toISOString()
};

// 从localStorage加载数据
const loadStreakData = (): StreakData => {
  const savedData = localStorage.getItem('dailyStreak');
  return savedData ? JSON.parse(savedData) : initialStreakData;
};

// 保存数据到localStorage
const saveStreakData = (data: StreakData) => {
  localStorage.setItem('dailyStreak', JSON.stringify(data));
};

// 更新游戏完成状态
export const updateGameCompletion = () => {
  const currentData = loadStreakData();
  const today = new Date().toISOString().split('T')[0];
  const lastUpdated = currentData.lastUpdated?.split('T')[0];
  
  // 如果是新的一天，重置游戏完成数
  const gamesCompleted = today === lastUpdated ? 
    Math.min(currentData.gamesCompleted + 1, 4) : 
    1;
  
  const newData = {
    ...currentData,
    gamesCompleted,
    lastUpdated: new Date().toISOString()
  };
  
  saveStreakData(newData);
  return newData;
};

export default function DailyMode() {
  const [streakData, setStreakData] = useState<StreakData>(loadStreakData());
  const [dailyProgress, setDailyProgress] = useState(0);

  // 初始化数据和监听storage变化
  useEffect(() => {
    const handleStorageChange = () => {
      setStreakData(loadStreakData());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 计算进度
  useEffect(() => {
    const progress = Math.min(100, (streakData.gamesCompleted / 4) * 100);
    setDailyProgress(progress);
  }, [streakData.gamesCompleted]);

  const handleDailyCheckIn = () => {
    const today = new Date();
    const lastDate = streakData.lastActiveDate ? new Date(streakData.lastActiveDate) : null;
    
    let newStreak = streakData.currentStreak;
    let newLongestStreak = streakData.longestStreak;
    
    // 检查是否是连续打卡
    if (lastDate && (today.getDate() - lastDate.getDate() === 1)) {
      newStreak += 1;
      newLongestStreak = Math.max(newLongestStreak, newStreak);
    } else if (!lastDate || today.getDate() !== lastDate.getDate()) {
      newStreak = 1;
    }
    
    const newData = {
      ...streakData,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today.toISOString(),
      completedToday: true,
      lastUpdated: today.toISOString()
    };
    
    saveStreakData(newData);
    setStreakData(newData);
    toast.success(`打卡成功！当前连续打卡${newStreak}天`);
  };

  // 日历样式布局
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    return date;
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#7EC8E3] font-comic mb-6 text-center">每日训练日历</h2>
      
      {/* 日历视图 */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div key={day} className="text-center font-bold text-[#7EC8E3]">
              {day}
            </div>
          ))}
          {calendarDays.map((date, index) => (
            <div 
              key={index}
              className={`aspect-square rounded-lg flex items-center justify-center ${
                date.getDate() === new Date().getDate() 
                  ? 'bg-[#FFD166] text-white' 
                  : 'bg-[#7EC8E3]/20'
              }`}
            >
              {date.getDate()}
            </div>
          ))}
        </div>

        {/* 打卡状态 */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FFD166]">{streakData.currentStreak}</div>
              <div className="text-sm text-gray-600">当前连续</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#7EC8E3]">{streakData.longestStreak}</div>
              <div className="text-sm text-gray-600">最长记录</div>
            </div>
          </div>
          
          <button
            onClick={handleDailyCheckIn}
            disabled={streakData.completedToday}
            className={`w-full py-3 rounded-lg font-comic text-lg ${
              streakData.completedToday 
                ? 'bg-green-500 text-white' 
                : 'bg-[#FFD166] hover:bg-[#ffc233] text-white'
            }`}
          >
            {streakData.completedToday ? '今日已完成' : '立即打卡'}
          </button>
        </div>

        {/* 今日进度 */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-[#7EC8E3] font-comic mb-2">今日进度</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-[#7EC8E3] h-4 rounded-full" 
              style={{ width: `${dailyProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <div className="mt-2 text-center text-sm">
            已完成 {streakData.gamesCompleted}/4 个游戏
          </div>
        </div>
      </div>
    </div>
  );
}