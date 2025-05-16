import { useState, useCallback, useRef, useEffect } from 'react';
const debounce = require('lodash.debounce');
import type { CommentCheckResponse } from '../api';

interface CommentCheckOptions {
  context?: string;
  threshold?: number;
  debounceMs?: number;
  apiEndpoint?: string;
}

export function useCommentCheck(options: CommentCheckOptions = {}) {
  const {
    context = '',
    threshold = 0.7,
    apiEndpoint = '/api/check-comment',
    debounceMs = 500
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CommentCheckResponse | null>(null);
  const contextRef = useRef(context);
  const debouncedFnRef = useRef<((text: string) => void) | null>(null);

  // Update context if it changes
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const checkComment = useCallback(async (commentText: string) => {
    if (!commentText?.trim()) {
      setResult({
        approved: false,
        reason: 'Comment cannot be empty',
        confidence: 0
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: commentText,
          context: contextRef.current,
          threshold
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.reason || 'Failed to check comment');
      }

      const result = {
        ...data,
        stats: {
          length: commentText.length,
          words: commentText.trim().split(/\s+/).length
        }
      };

      setResult(result);
      return result;
    } catch (err) {
      console.error('Error checking comment:', err);
      setResult({
        approved: false,
        reason: 'Failed to check comment. Please try again.',
        confidence: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, threshold]);

  // Initialize debounced function
  useEffect(() => {
    const debouncedFn = debounce(async (text: string) => {
      await checkComment(text);
    }, debounceMs);

    debouncedFnRef.current = debouncedFn;

    return () => {
      if (debouncedFnRef.current) {
        // @ts-ignore - debounce types don't include cancel
        debouncedFnRef.current.cancel?.();
      }
    };
  }, [checkComment, debounceMs]);

  const debouncedCheck = useCallback((text: string) => {
    if (!text) return;
    debouncedFnRef.current?.(text);
  }, []);

  return {
    isLoading,
    result,
    checkComment,
    debouncedCheck
  };
}
