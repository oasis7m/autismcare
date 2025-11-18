import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 表情类型定义
export type Expression = 'happy' | 'sad' | 'angry' | 'scared' | 'disgusted';

// 获取用户自定义表情图片
function getUserCustomExpression(expression: Expression): string | null {
  const savedSettings = localStorage.getItem('expressionSettings');
  if (savedSettings) {
    const { customExpressions } = JSON.parse(savedSettings);
    return customExpressions?.[expression] || null;
  }
  return null;
}

// 获取随机表情
export function getRandomExpression(): Expression {
  const expressions: Expression[] = ['happy', 'sad', 'angry', 'scared', 'disgusted'];
  return expressions[Math.floor(Math.random() * expressions.length)];
}

// 获取表情图片URL
export function getRandomExpressionImage(expression: Expression): string {
  // 优先使用用户自定义图片
  const customImage = getUserCustomExpression(expression);
  if (customImage) {
    return customImage;
  }

  // 检查设置是否完成
  const savedSettings = localStorage.getItem('expressionSettings');
  if (savedSettings) {
    const { settingsComplete } = JSON.parse(savedSettings);
    if (!settingsComplete) {
      throw new Error('请先完成表情图片设置');
    }
  } else {
    throw new Error('请先完成表情图片设置');
  }

  // 如果没有自定义图片但设置已完成，返回空字符串
  return '';
}

// 分割图片为上下两部分
export function splitImage(imageUrl: string): { top: string, bottom: string } {
  return {
    top: `${imageUrl}#top`,
    bottom: `${imageUrl}#bottom`
  };
}

// 检查设置是否完成
export function checkSettingsComplete(): boolean {
  const savedSettings = localStorage.getItem('expressionSettings');
  if (savedSettings) {
    const { customExpressions, settingsComplete } = JSON.parse(savedSettings);
    if (!settingsComplete) return false;
    
    // 检查所有表情图片是否都已设置
    return Object.values(customExpressions).every(url => url !== '');
  }
  return false;
}

// 生成游戏题目
export function generateGameQuestions(count: number = 10) {
  if (!checkSettingsComplete()) {
    throw new Error('请先完成表情图片设置');
  }

  const questions = [];
  for (let i = 0; i < count; i++) {
    const expression = getRandomExpression();
    questions.push({
      id: i,
      expression,
      imageUrl: getRandomExpressionImage(expression),
      options: getRandomOptions(expression)
    });
  }
  return questions;
}

// 获取随机选项
function getRandomOptions(correctExpression: Expression): {expression: Expression, imageUrl: string}[] {
  const allExpressions: Expression[] = ['happy', 'sad', 'angry', 'scared', 'disgusted'];
  const otherExpressions = allExpressions.filter(e => e !== correctExpression);
  
  // 随机选择3个错误选项
  const options = [];
  while (options.length < 3) {
    const randomIndex = Math.floor(Math.random() * otherExpressions.length);
    const randomExpression = otherExpressions[randomIndex];
    if (!options.some(o => o.expression === randomExpression)) {
      options.push({
        expression: randomExpression,
        imageUrl: getRandomExpressionImage(randomExpression)
      });
    }
  }
  
  // 添加正确答案
  options.push({
    expression: correctExpression,
    imageUrl: getRandomExpressionImage(correctExpression)
  });
  
  // 打乱选项顺序
  return options.sort(() => Math.random() - 0.5);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
