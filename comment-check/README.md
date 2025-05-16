# Comment Check - AI-Powered Comment Moderation 🤖

Hey there! 👋 This package helps you check if comments are appropriate before showing them on your website. It's like having a friendly robot that reads comments and tells you if they're nice or not!

## What Does It Do? 🎯

- Checks if comments are appropriate and respectful
- Tells you why a comment might be good or bad
- Shows how confident it is about its decision
- Works with any React website
- Super easy to set up!

## Getting Started 🚀

### Step 1: Install the Package

Open your terminal and type:

```bash
npm install @livehashan/comment-check
```

### Step 2: Get Your OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Get your API key from the dashboard

### Step 3: Set Up Your Environment

Create a file called `.env` in your project folder and add:

```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free
```

### Step 4: Use in Your React Components

```javascript
'use client'
import { useState } from 'react'
import { useCommentCheck } from '@livehashan/comment-check'

export default function CommentForm() {
  const [comment, setComment] = useState('')
  const { isLoading, result, checkComment } = useCommentCheck()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await checkComment(comment)
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Checking...' : 'Submit'}
      </button>
      {result && (
        <div>
          {result.approved ? '✅ Approved!' : '❌ Not Approved'}
          <p>{result.reason}</p>
        </div>
      )}
    </form>
  )
}
```

### Step 5: Create the API Route

If you're using Next.js, create a file called `app/api/check-comment/route.js`:

```javascript
import { CommentChecker } from '@livehashan/comment-check';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined');
}

const checker = new CommentChecker(
  process.env.OPENROUTER_API_KEY,
  process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324:free'
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
```

## Advanced Features 🛠️

### Custom Context

You can provide context about your website to help the AI make better decisions:

```javascript
const { checkComment } = useCommentCheck({
  context: 'This is a friendly gaming community for kids',
  threshold: 0.8 // Higher number = stricter moderation (0 to 1)
})
```

### Custom API Endpoint

If your API route is at a different URL:

```javascript
const { checkComment } = useCommentCheck({
  apiEndpoint: '/api/my-custom-route'
})
```

## Response Format 📝

When you check a comment, you get back:

```javascript
{
  approved: true or false,    // Is the comment okay?
  reason: "explanation here", // Why was it approved/rejected?
  confidence: 0.95,          // How sure is the AI? (0 to 1)
  stats: {                    // Extra info
    length: 50,              // Comment length
    words: 10                // Word count
  }
}
```

## Need Help? 🤔

- Check out our [examples folder](https://github.com/livehashan/comment-check/tree/main/examples)
- [Report issues](https://github.com/livehashan/comment-check/issues)
- [Ask questions](https://github.com/livehashan/comment-check/discussions)

## License 📄

MIT - feel free to use this in your projects! 🎉
