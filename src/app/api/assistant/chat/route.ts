// src/app/api/assistant/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemPrompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const messages = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const completion = await openai.createChatCompletion({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages,
    });

    const assistantResponse = completion.data.choices[0].message?.content;

    if (!assistantResponse) {
      throw new Error('No assistant response');
    }

    return NextResponse.json({ response: assistantResponse });
  } catch (error: any) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { error: 'Failed to get assistant response' },
      { status: 500 }
    );
  }
}
