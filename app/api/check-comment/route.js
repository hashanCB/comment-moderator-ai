import { CommentChecker } from '@livehashan/comment-check';

// Environment variable validation
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined');
}

const checker = new CommentChecker(
  process.env.OPENROUTER_API_KEY,
  process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324:free' // Use environment variable or default
);

export async function POST(req) {
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
}