import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';

export default function EmotionSupportAgent() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'photo'>('chat');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [socialScenario, setSocialScenario] = useState<string | null>(null);

  // 社交场景训练选项
  const socialScenarios = [
    {
      name: "打招呼",
      description: "学习如何友好地向他人问好",
      steps: [
        "保持微笑",
        "挥手或点头",
        "说'你好'或'早上好'"
      ]
    },
    {
      name: "分享玩具",
      description: "学习如何与他人分享物品",
      steps: [
        "询问'你想玩这个吗？'",
        "轻轻递给对方",
        "说'我们可以一起玩'"
      ]
    },
    {
      name: "请求帮助",
      description: "学习如何礼貌地寻求帮助",
      steps: [
        "先说'请问'",
        "清楚地说明需要什么帮助",
        "说'谢谢'"
      ]
    }
  ];

  // 数据库建议内容
  const adviceDatabase = {
    general: [
      {
        text: "我注意到你愿意交流了，这太棒了！",
        advice: "每天进步一点点，你已经做得很好了！"
      },
      {
        text: "你分享的内容很有趣！",
        advice: "试着把这些有趣的想法记录下来，可以做成小故事哦。"
      },
      {
        text: "我理解你的感受，每个人都需要朋友。",
        advice: "交朋友就像种小花，需要耐心和关心，慢慢来。"
      }
    ],
    comfort: [
      {
        text: "看起来你有点难过，没关系，我在这里陪着你。",
        advice: "难过的时候可以深呼吸5次，感觉会好一些。"
      },
      {
        text: "生气是很正常的情绪，我们一起想办法平静下来。",
        advice: "试试数到10，或者画一幅画来表达你的感受。"
      }
    ],
    encouragement: [
      {
        text: "你今天表现得非常勇敢！",
        advice: "记住：每个小进步都很重要，继续加油！"
      },
      {
        text: "你刚才的尝试很棒！",
        advice: "明天可以试着和一个人打招呼，我相信你能做到！"
      }
    ]
  };

  // 获取AI回复 - 增强版
  const getBotResponse = (userMessage: string) => {
    // 社交场景训练模式
    if (socialScenario) {
      const scenario = socialScenarios.find(s => s.name === socialScenario);
      if (scenario) {
        return {
          text: `做得很好！接下来尝试：${scenario.steps[1]}`,
          advice: `记住：${scenario.steps.join('，然后')}。你可以做到的！`
        };
      }
    }

    // 分析用户情绪关键词
    const comfortKeywords = ['难过', '伤心', '生气', '害怕', '孤独'];
    const encourageKeywords = ['尝试', '努力', '想要', '希望', '可以'];

    // 根据用户情绪选择回复类型
    let responseType = 'general';
    if (comfortKeywords.some(keyword => userMessage.includes(keyword))) {
      responseType = 'comfort';
    } else if (encourageKeywords.some(keyword => userMessage.includes(keyword))) {
      responseType = 'encouragement';
    }

    // 从数据库中获取稳定的建议
    const responses = adviceDatabase[responseType as keyof typeof adviceDatabase];
    const lastMessage = messages[messages.length - 2]?.text || '';
    const lastAdviceIndex = lastMessage ? 
      responses.findIndex(r => r.text === lastMessage) : -1;
    
    // 确保不重复相同的建议
    const nextIndex = lastAdviceIndex >= 0 
      ? (lastAdviceIndex + 1) % responses.length
      : Math.floor(Math.random() * responses.length);
    
    return responses[nextIndex];
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {text: inputText, sender: 'user' as const};
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // 模拟AI回复
      setTimeout(() => {
        const response = getBotResponse(inputText);
        const botMessage = {text: response.text, sender: 'bot' as const};
        setMessages(prev => [...prev, botMessage]);
        
        // 社交场景训练结束
        if (socialScenario && messages.length > 2) {
          setTimeout(() => {
            const scenario = socialScenarios.find(s => s.name === socialScenario);
            setMessages(prev => [
              ...prev,
              {
                text: `太棒了！你完成了${socialScenario}练习！`,
                sender: 'bot' as const
              },
              {
                text: `记住这些步骤：${scenario?.steps.join(' → ')}`,
                sender: 'bot' as const
              }
            ]);
            setSocialScenario(null);
          }, 1500);
        }
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 语音识别功能
  const startListening = () => {
    setIsListening(true);
    toast('请开始说话...');
    // 这里应该是实际的语音识别API调用
    setTimeout(() => {
      const recognizedText = "我听到你说：今天天气真好"; // 模拟识别结果
      setInputText(recognizedText);
      setIsListening(false);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    toast('语音识别已停止');
  };

  // 拍照功能
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      toast.error('无法访问摄像头');
      console.error(err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        toast.success('照片已拍摄！');
        
        // 添加到聊天
        const photoUrl = canvasRef.current.toDataURL('image/png');
        const newMessage = {text: photoUrl, sender: 'user' as const};
        setMessages(prev => [...prev, newMessage]);
        
        // 模拟AI回复
        setTimeout(() => {
          const botMessage = {text: "我看到了你的照片，拍得真棒！", sender: 'bot' as const};
          setMessages(prev => [...prev, botMessage]);
        }, 1000);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result as string;
        const newMessage = {text: photoUrl, sender: 'user' as const};
        setMessages(prev => [...prev, newMessage]);
        
        // 模拟AI回复
        setTimeout(() => {
          const botMessage = {text: "我看到你分享的图片了，真有趣！", sender: 'bot' as const};
          setMessages(prev => [...prev, botMessage]);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理拖放
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result as string;
        const newMessage = {text: photoUrl, sender: 'user' as const};
        setMessages(prev => [...prev, newMessage]);
        
        // 模拟AI回复
        setTimeout(() => {
          const botMessage = {text: "我看到你分享的图片了，真有趣！", sender: 'bot' as const};
          setMessages(prev => [...prev, botMessage]);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    // 初始欢迎消息
    setMessages([{text: "你好呀！我是你的情感陪伴小助手，有什么想和我分享的吗？", sender: 'bot'}]);
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7EC8E3]/20 to-[#FFD166]/20">
      <NavBar activeTab="emotion-support" />
      
      <button 
        onClick={handleBack}
        className="absolute top-20 left-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
      >
        <i className="fa-solid fa-arrow-left text-[#7EC8E3] text-xl"></i>
      </button>

      <div className="container mx-auto pt-24 px-4 pb-32">
        <h1 className="text-3xl font-bold text-[#7EC8E3] font-comic mb-8 text-center">情感陪伴小助手</h1>
          
        {/* 标签页切换 */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2 rounded-l-full font-comic text-lg ${
              activeTab === 'chat' ? 'bg-[#7EC8E3] text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <i className="fa-solid fa-comment-dots mr-2"></i>
            聊天
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`px-6 py-2 rounded-r-full font-comic text-lg ${
              activeTab === 'photo' ? 'bg-[#7EC8E3] text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <i className="fa-solid fa-camera mr-2"></i>
            图片
          </button>
        </div>

        {/* 社交训练选择 */}
        {activeTab === 'chat' && !socialScenario && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-[#7EC8E3] font-comic mb-4 text-center">社交技能训练</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {socialScenarios.map((scenario, index) => (
                <div 
                  key={index}
                  className="bg-[#7EC8E3]/10 p-4 rounded-xl border-2 border-[#7EC8E3] cursor-pointer hover:bg-[#7EC8E3]/20"
                  onClick={() => setSocialScenario(scenario.name)}
                >
                  <h3 className="text-lg font-bold text-[#7EC8E3] font-comic">{scenario.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
                  <i className="fa-solid fa-arrow-right text-[#7EC8E3] float-right"></i>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 聊天区域 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-6 h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-[#7EC8E3] text-white'
                    : 'bg-[#FFD166] text-white'
                }`}
              >
                {message.text.startsWith('data:image') ? (
                  <img 
                    src={message.text} 
                    alt="用户分享" 
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <div>
                    <p className="font-comic">{message.text}</p>
                     {message.sender === 'bot' && messages[index-1]?.sender === 'user' && (
                       <div className="mt-2 p-2 bg-white/20 rounded-lg">
                         <p className="text-sm font-comic">💡 小建议: {getBotResponse(messages[index-1].text).advice}</p>
                       </div>
                     )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 输入区域 */}
        {activeTab === 'chat' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你想说的话..."
                className="flex-1 p-3 rounded-lg border-2 border-[#7EC8E3] font-comic"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#7EC8E3] text-white p-3 rounded-lg"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-3 rounded-lg ${
                  isListening ? 'bg-red-500' : 'bg-[#FFD166]'
                } text-white`}
              >
                <i className={`fa-solid fa-${isListening ? 'stop' : 'microphone'}`}></i>
              </button>
            </div>
          </div>
        )}

        {/* 图片区域 */}
        {activeTab === 'photo' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col items-center">
              {/* 摄像头预览 */}
              <div className="relative w-full max-w-md mb-4">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  className="w-full h-auto rounded-xl border-4 border-[#7EC8E3]"
                  style={{ display: stream ? 'block' : 'none' }}
                ></video>
                {!stream && (
                  <div className="w-full aspect-video bg-gray-200 rounded-xl border-4 border-[#7EC8E3] flex items-center justify-center">
                    <i className="fa-solid fa-camera text-4xl text-gray-400"></i>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>

              <div className="flex gap-4">
                {!stream ? (
                  <button
                    onClick={startCamera}
                    className="bg-[#7EC8E3] text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-[#6ab7d8] transition"
                  >
                    <i className="fa-solid fa-camera mr-2"></i>
                    开启摄像头
                  </button>
                ) : (
                  <>
                    <button
                      onClick={capturePhoto}
                      className="bg-[#FFD166] text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-[#ffc233] transition"
                    >
                      <i className="fa-solid fa-camera mr-2"></i>
                      拍照
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-gray-600 transition"
                    >
                      <i className="fa-solid fa-power-off mr-2"></i>
                      关闭
                    </button>
                  </>
                )}
              </div>

              {/* 文件上传 */}
              <div 
                className="mt-4 w-full p-6 bg-gray-100 rounded-xl border-4 border-dashed border-[#7EC8E3] flex flex-col items-center justify-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <i className="fa-solid fa-cloud-arrow-up text-4xl text-[#7EC8E3] mb-4"></i>
                <p className="text-center text-gray-600 mb-4 font-comic">拖放图片到这里，或者</p>
                <label className="bg-[#7EC8E3] text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-[#6ab7d8] transition cursor-pointer">
                  <i className="fa-solid fa-folder-open mr-2"></i>
                  选择图片
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}