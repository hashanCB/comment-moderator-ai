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

### Advance React Components

```javascript
'use client'
import { useState } from 'react'
import { useCommentCheck } from '@livehashan/comment-check'

export default function CommentForm({ context = 'This is a discussion about web development and programming.', threshold = 0.7 } = {}) {
  const [comment, setComment] = useState('')
  const { isLoading, result, debouncedCheck, checkComment } = useCommentCheck({ context, threshold })
  const maxLength = 500
  const charCount = comment.length

  const handleChange = (e) => {
    const text = e.target.value
    if (text.length <= maxLength) {
      setComment(text)
      debouncedCheck(text)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    await checkComment(comment)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-xl rounded-lg p-6 border border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Add a Comment
            </h2>
          </div>
          
          <div className="relative">
            <textarea
              value={comment}
              onChange={handleChange}
              className={`w-full p-4 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${result?.approved === false ? 'border-red-500' : 'border-gray-200'}
                ${isLoading ? 'bg-gray-50' : 'bg-white'}`}
              placeholder="Write your comment here..."
              rows={4}
            />

            <div className="mt-2 space-y-3">
              <div className="flex justify-between text-sm">
                <span className={`${charCount > maxLength * 0.8 ? 'text-red-500' : 'text-gray-500'}`}>
                  {charCount}/{maxLength} characters
                </span>
                {isLoading && (
                  <span className="text-blue-500 animate-pulse">
                    Checking your comment...
                  </span>
                )}
              </div>

              {result && (
                <div
                  className={`p-3 rounded-lg border ${result.approved 
                    ? 'bg-green-50 border-green-100 text-green-700' 
                    : 'bg-red-50 border-red-100 text-red-700'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {result.approved ? '✅ Comment approved!' : '⚠️ Comment needs revision'}
                    </p>
                    {result.confidence && (
                      <span className={`text-sm px-2 py-1 rounded ${result.confidence >= 0.8 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        Confidence: {Math.round(result.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="mt-1">{result.reason}</p>
                  {result.stats && (
                    <div className="mt-2 pt-2 border-t border-current border-opacity-10 text-sm">
                      <p>Words: {result.stats.words}</p>
                      <p>Characters: {result.stats.length}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || result?.approved === false}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200
              ${isLoading
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : result?.approved === false
                ? 'bg-red-100 text-red-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 hover:shadow-lg'}`}
          >
            {isLoading ? 'Checking...' : result?.approved === false ? 'Not Approved' : 'Submit Comment'}
          </button>
        </div>
      </form>
    </div>
  )
}

```

## Need Help? 🤔

- Check out our [examples folder](https://github.com/livehashan/comment-check/tree/main/examples)
- [Report issues](https://github.com/livehashan/comment-check/issues)
- [Ask questions](https://github.com/livehashan/comment-check/discussions)

## License 📄

MIT - feel free to use this in your projects! 🎉
