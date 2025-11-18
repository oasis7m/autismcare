import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';

type Expression = 'happy' | 'sad' | 'angry' | 'disgusted' | 'scared';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [customExpressions, setCustomExpressions] = useState<Record<Expression, string>>({
    happy: '',
    sad: '',
    angry: '',
    disgusted: '',
    scared: ''
  });
  const [settingsComplete, setSettingsComplete] = useState(false);

  useEffect(() => {
    // 加载已保存的设置
    const savedSettings = localStorage.getItem('expressionSettings');
    if (savedSettings) {
      const { customExpressions: savedExpressions, settingsComplete: savedComplete } = JSON.parse(savedSettings);
      setCustomExpressions(savedExpressions || {
        happy: '',
        sad: '',
        angry: '',
        disgusted: '',
        scared: ''
      });
      setSettingsComplete(savedComplete || false);
    }
  }, []);

  const handleImageChange = (expression: Expression, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomExpressions(prev => ({
          ...prev,
          [expression]: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    const allSet = Object.values(customExpressions).every(url => url !== '');
    if (!allSet) {
      toast.error('请为所有表情上传图片');
      return;
    }

    const settings = {
      customExpressions,
      settingsComplete: true
    };
    localStorage.setItem('expressionSettings', JSON.stringify(settings));
    setSettingsComplete(true);
    toast.success('设置已保存！');
    navigate('/');
  };

  const expressions: { key: Expression; name: string }[] = [
    { key: 'happy', name: '开心' },
    { key: 'sad', name: '伤心' },
    { key: 'angry', name: '生气' },
    { key: 'disgusted', name: '厌恶' },
    { key: 'scared', name: '害怕' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7EC8E3]/20 to-[#FFD166]/20">
      <NavBar activeTab="settings" />
      
      <div className="container mx-auto pt-24 px-4 pb-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#7EC8E3] font-comic mb-6">表情图片设置</h2>
          
          <div className="space-y-6">
             {expressions.map(({ key, name }) => (
               <div key={key} className="flex flex-col md:flex-row items-center gap-4">
                 <div className="w-32 font-bold text-[#7EC8E3] font-comic">{name}</div>
                 <div className="flex-1 flex items-center gap-4">
                   <input
                     type="file"
                     id={`${key}-input`}
                     accept="image/*"
                     onChange={(e) => handleImageChange(key, e)}
                     className="hidden"
                   />
                   <div className="flex items-center gap-4">
                     <label
                       htmlFor={`${key}-input`}
                       className="bg-[#7EC8E3]/20 text-[#7EC8E3] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#7EC8E3]/30"
                     >
                       选择图片
                     </label>
                     <div 
                       className="border-2 border-dashed border-[#7EC8E3] rounded-lg p-4 text-center w-64"
                       onDragOver={(e) => {
                         e.preventDefault();
                         e.currentTarget.classList.add('bg-[#7EC8E3]/10');
                       }}
                       onDragLeave={(e) => {
                         e.preventDefault();
                         e.currentTarget.classList.remove('bg-[#7EC8E3]/10');
                       }}
                       onDrop={(e) => {
                         e.preventDefault();
                         e.currentTarget.classList.remove('bg-[#7EC8E3]/10');
                         if (e.dataTransfer.files.length > 0) {
                           handleImageChange(key, {
                             target: { files: e.dataTransfer.files }
                           } as React.ChangeEvent<HTMLInputElement>);
                         }
                       }}
                     >
                       或拖拽图片到这里
                     </div>
                   </div>
                   {customExpressions[key] && (
                     <div className="w-16 h-16 border-2 border-[#7EC8E3] rounded-lg overflow-hidden">
                       <img
                         src={customExpressions[key]}
                         alt={`${name}表情预览`}
                         className="w-full h-full object-cover"
                       />
                     </div>
                   )}
                 </div>
               </div>
             ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSaveSettings}
              className="bg-[#FFD166] text-white px-8 py-3 rounded-lg font-comic text-lg hover:bg-[#ffc233] transition"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
