'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export function useCommentCheck({ context = '', threshold = 0.7 } = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const checkTimeout = useRef(null)
  const contextRef = useRef(context)

  // Update context if it changes
  useEffect(() => {
    contextRef.current = context
  }, [context])

  const checkComment = useCallback(async (commentText) => {
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
  }, [threshold])

  const debouncedCheck = useCallback((text) => {
    if (checkTimeout.current) {
      clearTimeout(checkTimeout.current)
    }
    checkTimeout.current = setTimeout(() => checkComment(text), 1000)
  }, [checkComment])

  return {
    isLoading,
    result,
    checkComment,
    debouncedCheck
  }
}
