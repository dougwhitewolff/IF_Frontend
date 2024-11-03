// src/app/api/openai/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the system prompt
const SYSTEM_PROMPT = `You are an AI math tutor specifically assisting students with the "Coded Messages" activity. 
This activity involves solving puzzles by decoding and encoding messages, focusing on inverse functions.
Provide concise, encouraging responses and gentle hints without revealing answers. 
Guide students to interact with the application's UI elements, such as suggesting buttons to click or areas to focus on, 
to help them progress through the activity.`;

/**
 * Handle POST requests to /api/openai/chat
 */
export async function POST(req: NextRequest) {
  try {
    const { prompt, assistantId, activityId } = await req.json();

    // Validate required fields
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing "prompt" in the request body.' },
        { status: 400 }
      );
    }

    if (!assistantId || typeof assistantId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing "assistantId" in the request body.' },
        { status: 400 }
      );
    }

    if (!activityId || typeof activityId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing "activityId" in the request body.' },
        { status: 400 }
      );
    }

    console.log(`Received prompt: "${prompt}" for assistantId: "${assistantId}" and activityId: "${activityId}"`);

    // Fetch the model from environment variables, fallback to default if not set
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini-2024-07-18';

    // Log the model being used
    console.log(`Using OpenAI model: ${model}`);

    // Create chat completion using the specified model
    const completion = await openai.chat.completions.create({
      model, // Use the model from environment variables
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const aiText = completion.choices[0]?.message?.content?.trim() || 
      'Sorry, I could not generate a response.';

    console.log('AI Response:', aiText);

    return NextResponse.json({ response: aiText });

  } catch (error: any) {
    console.error('OpenAI API error:', error.response?.data || error.message || error);
    
    return NextResponse.json(
      { error: 'Failed to fetch AI response. Please try again later.' },
      { status: error.response?.status || 500 }
    );
  }
}
