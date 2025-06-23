import { Injectable } from '@nestjs/common';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import type { CreateTodoDto } from '../todos/dto/create-todo.dto';

interface GenerateChildTodosInput {
  title: string;
  description?: string;
  parentId: string;
}

interface ChildTodoData {
  title: string;
  description: string;
}

@Injectable()
export class AiService {
  private readonly client = createOpenRouter({
    apiKey: process.env.OPEN_ROUTER_API_KEY,
  });

  async generateText(prompt: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: this.client.chat('google/gemini-2.0-flash-exp:free'),
        prompt,
      });
      return text;
    } catch (error) {
      throw new Error(`AI text generation failed: ${error.message}`);
    }
  }

  async generateChildTodos(input: GenerateChildTodosInput): Promise<CreateTodoDto[]> {
    console.log('Generating child todos for:', input);
    console.log('OpenRouter API Key configured:', !!process.env.OPEN_ROUTER_API_KEY);

    // まずAPIキーが設定されているかチェック
    if (!process.env.OPEN_ROUTER_API_KEY) {
      console.warn('OpenRouter API key not configured, using fallback');
      return this.generateFallbackChildTodos(input);
    }

    const prompt = `
親TODOを実用的な子TODOに自動分解し、TODOアプリでの管理を最適化してください。

## 入力情報
**親TODO:**
- タイトル: ${input.title}
- 説明: ${input.description || 'なし'}

## 分解ルール

### タスクサイズ
- **1タスク = 15分〜2時間** で完了可能
- チェックボックスを気持ちよくチェックできる粒度
- 一度の集中で完結できるサイズ

### 実用性重視
- **今すぐ実行可能** なアクションのみ
- 必要な情報・ツール・環境が揃っているタスク
- 「〜を検討する」「〜について考える」などの曖昧なタスクは避ける

### モバイル対応
- タイトルは **スマホ画面で読みやすい長さ**（12-20文字）
- 説明は簡潔で要点を絞る（30-80文字）
- 絵文字や記号は使用しない

## 生成条件

1. **子TODOの数**: 3-6個（複雑さに応じて調整）
2. **順序性**: 論理的な実行順序で配列
3. **完了判定**: 「完了/未完了」が明確に判断できる
4. **独立性**: 各タスクが他のタスクに過度に依存しない

## 出力仕様

### 必須フィールド
- title: 動詞始まりの簡潔なタスク名
- description: 具体的な実行内容と完了基準

## JSON出力形式

[
  {
    "title": "タスクタイトル",
    "description": "具体的な実行内容と完了の判断基準",
  },
  {
    "title": "タスクタイトル2",
    "description": "具体的な実行内容と完了の判断基準",
  }
]

## 品質チェック項目
- ✅ 各タスクが単独で理解できる
- ✅ 「今日中に」「後で」などの曖昧な表現なし  
- ✅ 完了したかどうかが明確に判断できる
- ✅ スマートフォンで読みやすい
- ✅ 実際のユーザーが実行可能

**重要**: JSONのみを出力し、説明文やコードブロックは含めないでください。
`;

    try {
      console.log('Sending request to OpenRouter...');
      const { text } = await generateText({
        model: this.client.chat('google/gemini-2.0-flash-exp:free'),
        prompt,
      });

      console.log('Received response from AI:', text);

      // JSONから不要な文字列を除去してパース
      const cleanedText = text.replace(/```json|```/g, '').trim();
      console.log('Cleaned text:', cleanedText);

      const childTodos = JSON.parse(cleanedText);
      console.log('Parsed child todos:', childTodos);

      // CreateTodoDto形式に変換
      const result = (childTodos as ChildTodoData[]).map((todo) => ({
        title: todo.title,
        description: todo.description,
        completed: false,
        parentId: input.parentId,
      }));

      console.log('Converted result:', result);
      return result;
    } catch (error) {
      console.error('Error in generateChildTodos:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data || 'No response data',
      });

      // AIが失敗した場合はフォールバックを使用
      console.warn('AI generation failed, using fallback');
      return this.generateFallbackChildTodos(input);
    }
  }

  private generateFallbackChildTodos(input: GenerateChildTodosInput): CreateTodoDto[] {
    // フォールバック用のサンプル子TODO
    const fallbackTodos = [
      {
        title: `${input.title} - 準備作業`,
        description: `${input.title}を開始するための準備作業を行う`,
      },
      {
        title: `${input.title} - 計画立案`,
        description: `${input.title}の具体的な計画を立案する`,
      },
      {
        title: `${input.title} - 実行`,
        description: `${input.title}を実際に実行する`,
      },
      {
        title: `${input.title} - 確認・完了`,
        description: `${input.title}の結果を確認し、完了処理を行う`,
      },
    ];

    return fallbackTodos.map((todo) => ({
      title: todo.title,
      description: todo.description,
      completed: false,
      parentId: input.parentId,
    }));
  }
}
