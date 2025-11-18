import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Expression, generateGameQuestions, getRandomExpressionImage } from '@/lib/utils';

const scenarios = {
  happy: [
    '收到最喜欢的玩具',
    '吃到美味的冰淇淋',
    '和朋友一起玩耍',
    '听到表扬的话'
  ],
  sad: [
    '心爱的玩具坏了',
    '朋友不和自己玩',
    '被父母批评',
    '喜欢的动画片结束了'
  ],
  angry: [
    '玩具被抢走',
    '被不公平对待',
    '被插队',
    '被冤枉'
  ],
  scared: [
    '看到蜘蛛',
    '听到很大的雷声',
    '做噩梦',
    '在黑暗中独处'
  ],
  disgusted: [
    '吃到难吃的食物',
    '闻到臭味',
    '看到脏东西',
    '摸到黏糊糊的东西'
  ]
};

export default function ExpressionScenarioGame() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    const gameQuestions = generateGameQuestions(10).map(q => {
      // 从当前表情的多个情景中随机选择1个作为正确情景
      const correctScenarios = scenarios[q.expression];
      const correctScenario = correctScenarios[Math.floor(Math.random() * correctScenarios.length)];
      
      // 获取其他表情的情景作为干扰项
      const otherExpressions = Object.keys(scenarios).filter(e => e !== q.expression) as Expression[];
      const otherScenarios = [];
      
      // 确保干扰项来自不同的表情
      while (otherScenarios.length < 3) {
        const randomExpression = otherExpressions[Math.floor(Math.random() * otherExpressions.length)];
        const randomScenarios = scenarios[randomExpression];
        const randomScenario = randomScenarios[Math.floor(Math.random() * randomScenarios.length)];
        
        if (!otherScenarios.includes(randomScenario)) {
          otherScenarios.push(randomScenario);
        }
      }
      
      return {
        ...q,
        correctScenarios: [correctScenario],
        options: [correctScenario, ...otherScenarios].sort(() => Math.random() - 0.5)
      };
    });
    setQuestions(gameQuestions);
  }, []);

  const handleScenarioSelect = (scenario: string) => {
    setSelectedScenario(scenario);
    const isCorrect = questions[currentQuestion].correctScenarios.includes(scenario);
    
    if (isCorrect) {
      toast.success('配对正确！');
      setScore(score + 1);
      setTimeout(() => nextQuestion(), 1000);
    } else {
      toast.error('配对错误，请再试一次');
    }
  };

  const nextQuestion = () => {
    setSelectedScenario(null);
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
    setSelectedScenario(null);
    setGameCompleted(false);
  };

  if (questions.length === 0) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  if (gameCompleted) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-[#7EC8E3] font-comic">情景配对游戏</h2>
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
      <h2 className="text-2xl font-bold mb-4 text-[#7EC8E3] font-comic">情景配对游戏</h2>
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-comic">
            题目: {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-lg font-comic">
            得分: {score}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-4 text-center font-comic">表情</h3>
            <div className="flex justify-center">
              <img
                src={currentQ.imageUrl}
                alt={`表情 ${currentQ.expression}`}
                className="w-64 h-64 object-cover rounded-xl"
              />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold mb-4 text-center font-comic">请选择匹配的情景</h3>
            <div className="grid grid-cols-1 gap-4">
              {currentQ.options.map((scenario: string, index: number) => (
                <button
                  key={index}
                  className={cn(
                    "bg-[#7EC8E3]/20 p-4 rounded-xl text-left font-comic",
                    selectedScenario === scenario 
                      ? currentQ.correctScenarios.includes(scenario)
                        ? "bg-green-500/20 border-2 border-green-500"
                        : "bg-red-500/20 border-2 border-red-500"
                      : "hover:bg-[#7EC8E3]/30"
                  )}
                  onClick={() => handleScenarioSelect(scenario)}
                  disabled={selectedScenario !== null}
                >
                  {scenario}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}