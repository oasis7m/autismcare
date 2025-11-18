import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';

// 模拟表情识别结果
const emotions = {
  happy: { 
    name: '开心', 
    description: '你看起来很开心呢！继续保持好心情吧！',
    color: 'bg-yellow-100',
    icon: 'fa-solid fa-face-laugh-beam'
  },
  sad: { 
    name: '伤心', 
    description: '看起来有点难过呢，要不要和爸爸妈妈说说？',
    color: 'bg-blue-100',
    icon: 'fa-solid fa-face-sad-tear'
  },
  angry: { 
    name: '生气', 
    description: '深呼吸，数到10，让自己平静下来吧！',
    color: 'bg-red-100',
    icon: 'fa-solid fa-face-angry'
  },
  surprised: { 
    name: '惊讶', 
    description: '哇！发现什么有趣的事情了吗？',
    color: 'bg-purple-100',
    icon: 'fa-solid fa-face-surprise'
  },
  neutral: { 
    name: '平静', 
    description: '保持专注，继续加油哦！',
    color: 'bg-green-100',
    icon: 'fa-solid fa-face-meh'
  }
};

export default function EmotionRecognition() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [result, setResult] = useState<{emotion: string, confidence: number} | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 模拟表情识别函数
  const detectEmotion = (imageData: ImageData) => {
    // 实际应用中这里会调用AI模型
    const emotionsList = Object.keys(emotions);
    const randomEmotion = emotionsList[Math.floor(Math.random() * emotionsList.length)];
    return {
      emotion: randomEmotion,
      confidence: Math.random() * 0.5 + 0.5 // 模拟50-100%的置信度
    };
  };

  // 启动摄像头
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraOn(true);
        setStream(mediaStream);
      }
    } catch (err) {
      toast.error('无法访问摄像头，请检查权限设置');
      console.error('摄像头访问错误:', err);
    }
  };

  // 停止摄像头
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // 拍照并识别
  const captureAndDetect = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const detectionResult = detectEmotion(imageData);
        setResult(detectionResult);
        toast.success('识别完成啦！');
      }
    }
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img, 0, 0);
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const detectionResult = detectEmotion(imageData);
              setResult(detectionResult);
              toast.success('识别完成啦！');
            }
          }
        };
        img.src = event.target?.result as string;
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
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img, 0, 0);
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const detectionResult = detectEmotion(imageData);
              setResult(detectionResult);
              toast.success('识别完成啦！');
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // 清理摄像头
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7EC8E3]/20 to-[#FFD166]/20">
      <NavBar activeTab="emotion" />
      
      <button 
        onClick={handleBack}
        className="absolute top-20 left-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
      >
        <i className="fa-solid fa-arrow-left text-[#7EC8E3] text-xl"></i>
      </button>

      <div className="container mx-auto pt-24 px-4 pb-20">
        <h1 className="text-3xl font-bold text-[#7EC8E3] font-comic mb-8 text-center">表情识别小助手</h1>
        
        {/* 模式切换 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode('camera')}
            className={`px-6 py-3 rounded-full font-comic text-lg ${
              mode === 'camera' ? 'bg-[#7EC8E3] text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <i className="fa-solid fa-camera mr-2"></i>
            摄像头识别
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`px-6 py-3 rounded-full font-comic text-lg ${
              mode === 'upload' ? 'bg-[#7EC8E3] text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <i className="fa-solid fa-upload mr-2"></i>
            上传图片识别
          </button>
        </div>

        {/* 摄像头模式 */}
        {mode === 'camera' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md mb-4">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  className="w-full h-auto rounded-xl border-4 border-[#7EC8E3]"
                  style={{ display: isCameraOn ? 'block' : 'none' }}
                ></video>
                {!isCameraOn && (
                  <div className="w-full aspect-video bg-gray-200 rounded-xl border-4 border-[#7EC8E3] flex items-center justify-center">
                    <i className="fa-solid fa-camera text-4xl text-gray-400"></i>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>

              <div className="flex gap-4">
                {!isCameraOn ? (
                  <button
                    onClick={startCamera}
                    className="bg-[#7EC8E3] text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-[#6ab7d8] transition"
                  >
                    <i className="fa-solid fa-power-off mr-2"></i>
                    开启摄像头
                  </button>
                ) : (
                  <>
                    <button
                      onClick={captureAndDetect}
                      className="bg-[#FFD166] text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-[#ffc233] transition"
                    >
                      <i className="fa-solid fa-camera mr-2"></i>
                      拍照识别
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-gray-600 transition"
                    >
                      <i className="fa-solid fa-power-off mr-2"></i>
                      关闭摄像头
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 上传模式 */}
        {mode === 'upload' && (
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md mb-4">
                <canvas ref={canvasRef} className="hidden"></canvas>
                <div className="w-full aspect-square bg-gray-100 rounded-xl border-4 border-dashed border-[#7EC8E3] flex flex-col items-center justify-center p-4">
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
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 识别结果 */}
        {result && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-[#7EC8E3] font-comic mb-4 text-center">识别结果</h2>
            
            <div className={`${emotions[result.emotion as keyof typeof emotions].color} p-6 rounded-xl`}>
              <div className="flex flex-col items-center">
                <i className={`${emotions[result.emotion as keyof typeof emotions].icon} text-6xl text-[#7EC8E3] mb-4`}></i>
                <h3 className="text-2xl font-bold font-comic mb-2">{emotions[result.emotion as keyof typeof emotions].name}</h3>
                <p className="text-lg text-center font-comic">{emotions[result.emotion as keyof typeof emotions].description}</p>
                <div className="mt-4 w-full bg-white rounded-full h-4">
                  <div 
                    className="bg-[#7EC8E3] h-4 rounded-full" 
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-600 font-comic">识别准确度: {Math.round(result.confidence * 100)}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}