'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

// Debounce utility function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function useCommentCheck({ context = '', threshold = 0.7, debounceMs = 500 } = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const contextRef = useRef(context)
  const debouncedFnRef = useRef(null)
  const checkTimeout = useRef(null)

  // Update context if it changes
  useEffect(() => {
    contextRef.current = context
  }, [context])

  const checkComment = useCallback(async (commentText) => {
    if (checkTimeout.current) {
      clearTimeout(checkTimeout.current)
    }
    if (!commentText?.trim()) {
      setResult({ approved: false, reason: 'Comment cannot be empty' })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/check-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          comment: commentText,
          context: contextRef.current,
          threshold
        })
      })

      if (!response.ok) {
       
      }

      const data = await response.json()
      setResult({
        ...data,
        stats: {
          length: commentText.length,
          words: commentText.trim().split(/\s+/).length
        }
      })
    } catch (err) {
      console.error('Error checking comment:', err)
      setResult({
        approved: false,
        reason: 'Failed to check comment. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }, [threshold, contextRef])

  const debouncedCheck = useCallback((text) => {
    if (checkTimeout.current) {
      clearTimeout(checkTimeout.current)
    }
    checkTimeout.current = setTimeout(() => checkComment(text), debounceMs)
  }, [checkComment, debounceMs])

  return {
    isLoading,
    result,
    checkComment,
    debouncedCheck
  }
}
