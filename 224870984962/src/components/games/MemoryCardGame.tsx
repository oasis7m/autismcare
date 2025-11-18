import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Expression, generateGameQuestions, getRandomExpressionImage } from '@/lib/utils';
import { updateGameCompletion } from '@/components/training/DailyMode';

export default function MemoryCardGame() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    const gameQuestions = generateGameQuestions(1).map(q => {
      // 创建8张卡片(4对) - 使用四种固定表情
      const expressions: Expression[] = ['happy', 'sad', 'angry', 'scared'];
      const cards = [];
      
      expressions.forEach((expression, index) => {
        const imageUrl = getRandomExpressionImage(expression);
        cards.push({
          id: index * 2,
          expression,
          imageUrl
        });
        cards.push({
          id: index * 2 + 1,
          expression,
          imageUrl
        });
      });

      return {
        ...q,
        cards: cards.sort(() => Math.random() - 0.5)
      };
    });
    setQuestions(gameQuestions);
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedCards.length >= 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const card1 = questions[currentQuestion].cards[newFlippedCards[0]];
      const card2 = questions[currentQuestion].cards[newFlippedCards[1]];
      
      if (card1.expression === card2.expression) {
        toast.success('匹配成功！');
        setMatchedCards([...matchedCards, newFlippedCards[0], newFlippedCards[1]]);
        setFlippedCards([]);
        
        if (matchedCards.length + 2 === 8) {
          setScore(score + 1);
          updateGameCompletion(); // 更新游戏完成状态
          setTimeout(() => nextQuestion(), 1000);
        }
      } else {
        toast.error('不匹配，请再试一次');
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const nextQuestion = () => {
    setMatchedCards([]);
    setFlippedCards([]);
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
    setMatchedCards([]);
    setFlippedCards([]);
    setGameCompleted(false);
  };

  if (questions.length === 0) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  if (gameCompleted) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-[#7EC8E3] font-comic">盖棉被游戏</h2>
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
      <h2 className="text-2xl font-bold mb-4 text-[#7EC8E3] font-comic">盖棉被游戏</h2>
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-comic">
            题目: {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-lg font-comic">
            得分: {score}
          </div>
          <div className="text-lg font-comic">
            已匹配: {matchedCards.length / 2}/4
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {currentQ.cards.map((card: any, index: number) => (
            <div
              key={index}
              className={cn(
                "aspect-square cursor-pointer transition-all duration-300 transform",
                flippedCards.includes(index) || matchedCards.includes(index) 
                  ? "rotate-y-180" 
                  : "bg-[#7EC8E3] rounded-xl"
              )}
              onClick={() => handleCardClick(index)}
            >
              <div className="w-full h-full flex items-center justify-center">
                {flippedCards.includes(index) || matchedCards.includes(index) ? (
                  <img
                    src={card.imageUrl}
                    alt={`表情卡片 ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <i className="fa-solid fa-question text-4xl text-white"></i>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}