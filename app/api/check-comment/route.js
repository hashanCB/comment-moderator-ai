import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

// Environment variable validation
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined');
}
if (!process.env.OPENROUTER_MODEL) {
  throw new Error('OPENROUTER_MODEL is not defined');
}

const openRouterProvider = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  try {
    const { comment, context = '', threshold = 0.7 } = await req.json();

    // Input validation
    if (!comment) {
      return Response.json(
        { approved: false, reason: 'Comment is required' },
        { status: 400 }
      );
    }
    if (typeof threshold !== 'number' || threshold < 0 || threshold > 1) {
      return Response.json(
        { approved: false, reason: 'Threshold must be a number between 0 and 1' },
        { status: 400 }
      );
    }

    // Sanitize inputs to prevent prompt injection
    const escapePrompt = (input) => input.replace(/["\\]/g, '\\$&');
    const sanitizedContext = context.slice(0, 1000); // Limit context length

    const prompt = sanitizedContext
      ? `Context: ${escapePrompt(sanitizedContext)}\n\nModerate the following comment: "${escapePrompt(comment)}"\n\nConsider:\n1. Is it appropriate and relevant to the context? (Yes/No)\n2. Is it respectful and constructive? (Yes/No)\n3. Does it contain harmful content? (Yes/No)\n\nConfidence threshold: ${threshold * 100}%\n\nRespond with:\nAPPROVED: Yes/No\nREASON: <detailed reason>\nCONFIDENCE: <score between 0-1>`
      : `Moderate the following comment: "${escapePrompt(comment)}"\n\nConsider:\n1. Is it appropriate? (Yes/No)\n2. Is it respectful? (Yes/No)\n3. Does it contain harmful content? (Yes/No)\n\nConfidence threshold: ${threshold * 100}%\n\nRespond with:\nAPPROVED: Yes/No\nREASON: <detailed reason>\nCONFIDENCE: <score between 0-1>`;

    let text;
    try {
      const response = await generateText({
        model: openRouterProvider(process.env.OPENROUTER_MODEL),
        prompt,
      });
      text = response.text;
    } catch (error) {
      console.error('OpenRouter API error:', error);
      // Check if it's a rate limit error
      if (error?.data?.error?.code === 429 || error?.cause?.value?.error?.code === 429) {
        return Response.json(
          { approved: false, reason: 'Rate limit exceeded. Please try again later.', confidence: 0 },
          { status: 200 }
        );
      }
      // Handle other API errors
      return Response.json(
        { approved: false, reason: 'Service unavailable. Please try again.', confidence: 0 },
        { status: 200 }
      );
    }

    if (!text) {
      return Response.json(
        { approved: false, reason: 'No response from service', confidence: 0 },
        { status: 200 }
      );
    }

    // Parse response with validation
    const lines = text.trim().split('\n');
    const approvedLine = lines.find(line => line.startsWith('APPROVED:'));
    const reasonLine = lines.find(line => line.startsWith('REASON:'));
    const confidenceLine = lines.find(line => line.startsWith('CONFIDENCE:'));

    if (!approvedLine || !reasonLine || !confidenceLine) {
      console.warn('Unexpected response format from OpenRouter:', text);
      return Response.json(
        { approved: false, reason: 'Invalid response format', confidence: 0 },
        { status: 200 }
      );
    }

    const approved = approvedLine.split(':')[1]?.trim() === 'Yes';
    const reason = reasonLine.split(':')[1]?.trim() || 'No reason provided';
    const confidence = parseFloat(confidenceLine.split(':')[1]?.trim() || '0') || 0;

    return Response.json({ approved, reason, confidence });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { approved: false, reason: 'Service error, please try again', confidence: 0 },
      { status: 200 }
    );
  }
}