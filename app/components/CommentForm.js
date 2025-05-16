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
