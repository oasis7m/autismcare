import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Expression, generateGameQuestions, getRandomExpressionImage } from '@/lib/utils';

const expressionNames = {
  happy: '开心',
  sad: '伤心',
  angry: '生气',
  scared: '害怕',
  disgusted: '厌恶'
};

export default function ExpressionSelectionGame() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    const gameQuestions = generateGameQuestions(10);
    setQuestions(gameQuestions);
  }, []);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    const isCorrect = questions[currentQuestion].options[index].expression === questions[currentQuestion].expression;
    
    if (isCorrect) {
      toast.success('选择正确！');
      setScore(score + 1);
      setTimeout(() => nextQuestion(), 1000);
    } else {
      toast.error('选择错误，请再试一次');
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameCompleted(true);
      toast(`游戏结束！你的得分是 ${score}/${questions.length}`);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setGameCompleted(false);
  };

  if (questions.length === 0) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  if (gameCompleted) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-[#7EC8E3] font-comic">表情选择游戏</h2>
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
          <h3 className="text-xl font-bold mb-4">游戏完成！</h3>
          <p className="text-lg mb-6">你的得分: {score}/{questions.length}</p>
          <button
            onClick={restartGame}
            className="bg-[#FFD166] text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-[#ffc233] transition"
          >
            再玩一次
          </button>
          <button
            onClick={() => navigate('/training')}
            className="ml-4 bg-[#7EC8E3] text-white px-6 py-3 rounded-lg font-comic text-lg hover:bg-[#6ab7d8] transition"
          >
            返回训练中心
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#7EC8E3] font-comic">表情选择游戏</h2>
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-comic">
            题目: {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-lg font-comic">
            得分: {score}
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-4 font-comic">
            请选择{expressionNames[currentQ.expression]}的表情
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentQ.options.map((option: any, index: number) => (
            <div
              key={index}
              className={cn(
                "cursor-pointer border-4 rounded-lg overflow-hidden transition-all",
                selectedOption === index 
                  ? option.expression === currentQ.expression 
                    ? "border-green-500" 
                    : "border-red-500"
                  : "border-transparent hover:border-[#7EC8E3]"
              )}
              onClick={() => handleOptionSelect(index)}
            >
              <img
                src={option.imageUrl}
                alt={`表情选项 ${index + 1}`}
                className="w-full h-48 object-cover"
              />

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}