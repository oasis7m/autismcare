import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarsBackground from '@/components/StarsBackground';
import ModeCard from '@/components/ModeCard';
import NavBar from '@/components/NavBar';
import { toast } from 'sonner';


const modes = [
  { id: 1, name: "日常提醒", icon: "fa-solid fa-sun" },
  { id: 2, name: "康复游戏", icon: "fa-solid fa-gamepad" },
  { id: 3, name: "专业分析", icon: "fa-solid fa-chart-line" }
];

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const handleModeClick = (modeId: number) => {
    const mode = modes.find(m => m.id === modeId);
    if (mode) {
      toast(`进入${mode.name}模式`);
      if (modeId === 1) {
        navigate('/training', { state: { activeTab: 'daily' } });
      } else if (modeId === 2) {
        navigate('/training', { state: { activeTab: 'game' } });
      } else if (modeId === 3) {
        navigate('/training', { state: { activeTab: 'professional' } });
      }
    }
  };

  return (
    <div className="relative min-h-[110vh] overflow-hidden">
      <StarsBackground />
      
      {/* 顶部导航 */}
      <NavBar activeTab={activeTab} />

      <main className="relative z-10 flex flex-col items-center min-h-[calc(100vh-140px)] px-4 pt-6 pb-20">
        <h1 className="mb-2 text-3xl font-bold text-[#7EC8E3] font-comic">表情识别训练</h1>
            
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-2">
          {modes.map((mode) => (
            <ModeCard
              key={mode.id}
              name={mode.name}
              icon={mode.icon}
              onClick={() => handleModeClick(mode.id)}
            />
          ))}
        </div>
      </main>

      {/* 底部导航 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-20 py-2">
        <div className="max-w-md mx-auto flex justify-between px-4">
          <button 
            onClick={() => navigate('/')}
            className="flex flex-col items-center text-[#7EC8E3]"
          >
            <i className="fa-solid fa-house text-xl"></i>
            <span className="text-xs mt-1">首页</span>
          </button>
          <button 
            onClick={() => navigate('/training')}
            className="flex flex-col items-center text-[#7EC8E3]"
          >
            <i className="fa-solid fa-dumbbell text-xl"></i>
            <span className="text-xs mt-1">训练中心</span>
          </button>
          <button 
            onClick={() => navigate('/emotion-recognition')}
            className="flex flex-col items-center text-[#7EC8E3]"
          >
            <i className="fa-solid fa-face-smile-beam text-xl"></i>
            <span className="text-xs mt-1">表情识别</span>
          </button>
          <button 
            onClick={() => navigate('/emotion-support')}
            className="flex flex-col items-center text-[#7EC8E3]"
          >
            <i className="fa-solid fa-heart text-xl"></i>
            <span className="text-xs mt-1">情感陪伴</span>
          </button>
        </div>
      </footer>
    </div>
  );
}