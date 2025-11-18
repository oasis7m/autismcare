import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import DailyMode from '@/components/training/DailyMode';
import GameMode from '@/components/training/GameMode';
import ProfessionalMode from '@/components/training/ProfessionalMode';

const tabs = [
  { id: 'daily', name: '日常提醒', icon: 'fa-solid fa-sun' },
  { id: 'game', name: '康复游戏', icon: 'fa-solid fa-gamepad' },
  { id: 'professional', name: '专业分析', icon: 'fa-solid fa-chart-line' }
];

export default function Training() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daily');

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7EC8E3] to-[#FFD166]">
      {/* 顶部导航 */}
      <NavBar activeTab="training" />
      
      {/* 返回按钮 */}
      <button 
        onClick={handleBack}
        className="absolute top-20 left-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
      >
        <i className="fa-solid fa-arrow-left text-[#7EC8E3] text-xl"></i>
      </button>

      {/* 标签页 */}
      <div className="container mx-auto pt-24 px-4 pb-32">
        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mx-2 px-6 py-2 rounded-full font-comic text-lg font-bold ${
                activeTab === tab.id 
                  ? 'bg-[#FFD166] text-white' 
                  : 'bg-white/80 text-[#7EC8E3]'
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.name}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg min-h-[60vh]"
        >
          {activeTab === 'daily' && <DailyMode />}
          {activeTab === 'game' && <GameMode />}
          {activeTab === 'professional' && <ProfessionalMode />}
        </motion.div>
      </div>
    </div>
  );
}