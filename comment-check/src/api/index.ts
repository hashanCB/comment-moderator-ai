

export interface CommentCheckRequest {
  comment: string;
  context?: string;
  threshold?: number;
}

export interface CommentCheckResponse {
  approved: boolean;
  reason: string;
  confidence: number;
}

export class CommentChecker {
  private apiKey: string;

  constructor(apiKey: string, private model: string = 'deepseek/deepseek-chat-v3-0324:free') {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    this.apiKey = apiKey;
  }

  private escapePrompt(input: string): string {
    return input.replace(/["\\]/g, '\\$&');
  }

  async checkComment({ comment, context = '', threshold = 0.7 }: CommentCheckRequest): Promise<CommentCheckResponse> {
    try {
      if (!comment?.trim()) {
        return {
          approved: false,
          reason: 'Comment is required',
          confidence: 0
        };
      }

      const sanitizedContext = context.slice(0, 1000);
      const prompt = sanitizedContext
        ? `Context: ${this.escapePrompt(sanitizedContext)}\n\nModerate the following comment: "${this.escapePrompt(comment)}"\n\nConsider:\n1. Is it appropriate and relevant to the context? (Yes/No)\n2. Is it respectful and constructive? (Yes/No)\n3. Does it contain harmful content? (Yes/No)\n\nConfidence threshold: ${threshold * 100}%\n\nRespond with:\nAPPROVED: Yes/No\nREASON: <detailed reason>\nCONFIDENCE: <score between 0-1>`
        : `Moderate the following comment: "${this.escapePrompt(comment)}"...`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/livehashan/comment-check',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a comment moderation assistant. Analyze comments and respond in the exact format: APPROVED: Yes/No\nREASON: <reason>\nCONFIDENCE: <0-1>'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from OpenRouter');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from OpenRouter');
      }

      const lines = content.trim().split('\n');
      const approved = lines.find((line: string) => line.startsWith('APPROVED:'))?.split(':')[1]?.trim() === 'Yes';
      const reason = lines.find((line: string) => line.startsWith('REASON:'))?.split(':')[1]?.trim() || 'No reason provided';
      const confidence = parseFloat(lines.find((line: string) => line.startsWith('CONFIDENCE:'))?.split(':')[1]?.trim() || '0');

      return { approved, reason, confidence };
    } catch (error) {
      console.error('Error:', error);
      return {
        approved: false,
        reason: 'Service error',
        confidence: 0
      };
    }
  }
}

// Next.js route handler
export function createNextRouteHandler(apiKey: string, model?: string) {
  const checker = new CommentChecker(apiKey, model);

  return async function handler(req: Request) {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const body = await req.json();
      const result = await checker.checkComment(body);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        approved: false,
        reason: 'Service error',
        confidence: 0
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}

// Express middleware
export function createExpressMiddleware(apiKey: string, model?: string) {
  const checker = new CommentChecker(apiKey, model);

  return async function middleware(req: any, res: any) {
    try {
      const result = await checker.checkComment(req.body);
      res.json(result);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        approved: false,
        reason: 'Service error',
        confidence: 0
      });
    }
  };
}
