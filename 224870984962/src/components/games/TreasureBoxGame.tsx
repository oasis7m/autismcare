import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Expression, generateGameQuestions, getRandomExpressionImage } from '@/lib/utils';
import { updateGameCompletion } from '@/components/training/DailyMode';

export default function TreasureBoxGame() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    // 生成10个题目
    const gameQuestions = generateGameQuestions(10).map(q => {
      // 创建宝箱物品（20个，其中4个是目标表情）
      const boxItems = [];
      for (let i = 0; i < 4; i++) {
        boxItems.push({
          id: i,
          type: 'target',
          expression: q.expression,
          imageUrl: q.imageUrl
        });
      }
      // 添加干扰物
      for (let i = 4; i < 20; i++) {
        boxItems.push({
          id: i,
          type: 'distraction',
          imageUrl: `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%24%7BencodeURIComponent%28%27%E9%80%9A%E5%BF%83%E7%B2%89%EF%BC%8C%E7%99%BD%E8%89%B2%E8%83%8C%E6%99%AF%EF%BC%8C%E5%8D%A1%E9%80%9A%E9%A3%8E%E6%A0%BC%27%29%7D&sign=0f19de77bc0838ec60e141e29ae80001`
        });
      }
      // 打乱顺序
      return {
        ...q,
        boxItems: boxItems.sort(() => Math.random() - 0.5)
      };
    });
    setQuestions(gameQuestions);
    if (gameQuestions.length > 0) {
      setItems(gameQuestions[0].boxItems);
    }
  }, []);

  useEffect(() => {
    if (foundCount === 4 && questions.length > 0) {
      toast.success('找到了所有目标表情！');
      setScore(score + 1);
      updateGameCompletion(); // 更新游戏完成状态
      nextQuestion();
    }
  }, [foundCount]);

  const handleItemClick = (item: any) => {
    if (item.type === 'target') {
      toast.success('找到了一个表情！');
      setFoundCount(foundCount + 1);
      // 标记为已找到
      setItems(items.map(i => 
        i.id === item.id ? { ...i, found: true } : i
      ));
    } else {
      toast.error('这是通心粉，继续寻找表情！');
    }
  };

  const nextQuestion = () => {
    setFoundCount(0);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setItems(questions[currentQuestion + 1].boxItems);
    } else {
      setGameCompleted(true);
      toast(`游戏结束！你的得分是 ${score}/${questions.length}`);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setFoundCount(0);
    setGameCompleted(false);
    setItems(questions[0].boxItems);
  };

  if (questions.length === 0) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  if (gameCompleted) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-[#7EC8E3] font-comic">百宝箱游戏</h2>
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#7EC8E3] font-comic">百宝箱游戏</h2>
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-comic">
            题目: {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-lg font-comic">
            得分: {score}
          </div>
          <div className="text-lg font-comic">
            已找到: {foundCount}/4
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-center font-comic">
            请在宝箱中找出所有 {questions[currentQuestion].expression} 表情
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {items.map((item: any) => (
            <div
              key={item.id}
              className={cn(
                "cursor-pointer border-4 rounded-lg overflow-hidden transition-all h-24",
                item.found ? "border-green-500" : "border-transparent"
              )}
              onClick={() => !item.found && handleItemClick(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.type === 'target' ? '表情图片' : '通心粉'}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}