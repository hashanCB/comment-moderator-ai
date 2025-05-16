# AI-Powered Comment Moderation System

This project provides an intelligent comment moderation system using Next.js and OpenRouter AI. It's available as two npm packages:

1. [@livehashan/comment-check-hook](https://www.npmjs.com/package/@livehashan/comment-check-hook) - React hook for comment validation
2. [@livehashan/comment-check-api](https://www.npmjs.com/package/@livehashan/comment-check-api) - API implementation with AI integration

## Features

- AI-powered comment moderation
- Context-aware validation
- Real-time feedback
- Customizable validation rules
- TypeScript support
- Next.js and Express.js support

## Quick Start

1. Install the packages:

```bash
npm install @livehashan/comment-check-hook @livehashan/comment-check-api @openrouter/ai-sdk-provider ai
```

2. Set up environment variables in `.env.local`:

```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

3. Create the API endpoint:

```typescript
// app/api/check-comment/route.ts
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined');
}

const openRouterProvider = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  const { comment, context = '' } = await req.json();
  
  // Create AI prompt for moderation
  const prompt = `Moderate: "${comment}" ${context ? `\nContext: ${context}` : ''}`;
  
  const response = await generateText({
    model: openRouterProvider(process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo'),
    prompt,
  });
  
  // Parse AI response
  const approved = !response.text.toLowerCase().includes('inappropriate');
  
  return Response.json({
    approved,
    reason: response.text,
    confidence: approved ? 0.9 : 0.1
  });
}
```

4. Use the hook in your components:

```jsx
import { useCommentCheck } from '@livehashan/comment-check-hook';

function CommentForm() {
  const { checkComment, isLoading, result } = useCommentCheck({
    context: 'Optional context',
    threshold: 0.7
  });

  const handleSubmit = async (comment) => {
    await checkComment(comment);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form content */}
    </form>
  );
}
```

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
