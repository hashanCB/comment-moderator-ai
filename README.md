# AI-Powered Comment Moderation System 🤖

[![NPM Version](https://img.shields.io/npm/v/@livehashan/comment-check)](https://www.npmjs.com/package/@livehashan/comment-check)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, AI-powered comment moderation system built with Next.js and OpenRouter AI. This project provides real-time comment validation with context awareness and detailed feedback.

## ✨ Features

- 🔥 Real-time comment validation
- 🤖 AI-powered content moderation
- 💬 Context-aware responses
- ⏱️ Debounced API calls for better performance
- 📈 Detailed validation statistics
- 💻 Modern React hooks for easy integration
- 🎨 Beautiful UI with Tailwind CSS
- 🚀 Next.js App Router support

## 🛠️ Installation

```bash
npm install @livehashan/comment-check
```

## 📖 Quick Start

1. Set up your environment variables:
```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free
```

2. Create your API route (Next.js):
```javascript
import { CommentChecker } from '@livehashan/comment-check';

const checker = new CommentChecker(
  process.env.OPENROUTER_API_KEY,
  process.env.OPENROUTER_MODEL
);

export async function POST(req) {
  const body = await req.json();
  const result = await checker.checkComment(body);
  return new Response(JSON.stringify(result));
}
```

3. Use the React hook in your component:
```javascript
'use client'
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

## 💻 Tech Stack

- Next.js 13+ (App Router)
- React 18+
- OpenRouter AI API
- TypeScript
- Tailwind CSS

## 📃 License

MIT © [Hashan](https://github.com/hashanCB)

## ❤️ Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 Support

If you have any questions or need help, please:

- Open an [issue](https://github.com/hashanCB/aicomment/issues)
- Contact me on [Twitter](https://twitter.com/hashanCB)
- Visit our [Discord community](https://discord.gg/your-discord)

## ⭐️ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hashanCB/aicomment&type=Date)](https://star-history.com/#hashanCB/aicomment&Date)

---

Made with ❤️ by [Hashan](https://github.com/hashanCB)
