import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Define default system message
    const systemMessage = {
      role: 'system',
      content: "You are a helpful emergency preparedness assistant that provides accurate and concise information about safety and emergency planning."
    };

    // Create new messages array with system message first and only user/assistant messages after
    const formattedMessages = [
      systemMessage,
      ...messages.filter((msg: { role: string; }) => msg.role === 'user' || msg.role === 'assistant')
    ];

    // Log the formatted messages for debugging
    console.log('Formatted messages:', formattedMessages);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 2048,
        stream: false
      }),
    });

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return NextResponse.json({ 
        error: 'API request failed', 
        details: errorData 
      }, { 
        status: response.status 
      });
    }

    const data = await response.json();
    
    // Validate response data
    if (!data?.choices?.[0]?.message?.content) {
      console.error('Invalid API response:', data);
      return NextResponse.json({ 
        error: 'Invalid API response structure',
        data: data
      }, { 
        status: 500 
      });
    }

    // Return successful response
    return NextResponse.json({ 
      response: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    });
  }
}