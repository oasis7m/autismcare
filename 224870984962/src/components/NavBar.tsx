import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  activeTab: string;
}

export default function NavBar({ activeTab }: NavBarProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-sm p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <i className="fa-solid fa-face-smile text-3xl text-[#FFD166] mr-2"></i>
          <h1 className="text-2xl font-bold text-[#7EC8E3] font-comic">表情识别助手</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/settings')}
            className={`text-[#7EC8E3] ${activeTab === 'settings' ? 'text-[#FFD166]' : ''}`}
          >
            <i className="fa-solid fa-gear text-xl"></i>
          </button>
          <button className="text-[#7EC8E3]">
            <i className="fa-solid fa-user text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}