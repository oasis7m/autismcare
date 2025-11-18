import { motion } from 'framer-motion';

interface ModeCardProps {
  name: string;
  icon: string;
  onClick: () => void;
}

export default function ModeCard({ name, icon, onClick }: ModeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="w-24 h-24 flex items-center justify-center mb-3">
        <i className={`${icon} text-4xl text-[#FFD166]`}></i>
      </div>
      <h3 className="text-lg font-bold text-[#7EC8E3] font-comic">{name}</h3>
    </motion.div>
  );
}