import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const games = [
  {
    id: 'treasure',
    name: '百宝箱',
    icon: 'fa-solid fa-box-open',
    description: '在箱子里寻找表情照片'
  },
  {
    id: 'memory',
    name: '盖棉被',
    icon: 'fa-solid fa-layer-group',
    description: '记忆并匹配相同的表情'
  },
  {
    id: 'scenario',
    name: '情景配对',
    icon: 'fa-solid fa-object-group',
    description: '将表情与对应情景配对'
  },
  {
    id: 'selection',
    name: '表情选择',
    icon: 'fa-solid fa-face-smile',
    description: '根据名称选择正确的表情'
  }
];

export default function GameMode() {
  const navigate = useNavigate();

  const handleGameSelect = (gameId: string) => {
    navigate(`/training/game/${gameId}`);
    toast(`进入${games.find(g => g.id === gameId)?.name}游戏`);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#7EC8E3] font-comic mb-6 text-center">康复游戏模式</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/90 p-6 rounded-xl shadow-md cursor-pointer"
            onClick={() => handleGameSelect(game.id)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-[#7EC8E3]/20 rounded-full">
                <i className={`${game.icon} text-3xl text-[#7EC8E3]`}></i>
              </div>
              <h3 className="text-xl font-bold text-[#7EC8E3] font-comic mb-2">{game.name}</h3>
              <p className="text-gray-600">{game.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}