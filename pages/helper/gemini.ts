import { GoogleGenerativeAI } from "@google/generative-ai";

// Define a type for the response from sendMessage
type SendMessageResponse = {
  response: {
    text: () => Promise<string>;
  };
};

// Define a type for the conversation
type Conversation = {
  _apiKey?: string | null;
  sendMessage: (message: string) => Promise<SendMessageResponse>;
};

let conversation: Conversation | null = null;

export function initializeChat(message: string): Conversation {
  const geminiApiKey = process.env.GEMINI_API;

  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables");
  }

  const model = new GoogleGenerativeAI(geminiApiKey).getGenerativeModel({ model: 'gemini-pro' });

  const initHistory = [
    {
      role: 'user',
      parts: [message],
    },
    {
      role: 'model',
      parts: 'Hi, I am Sam. How can I help you today about Vinit?',
    },
  ];

  conversation = model.startChat({
    history: initHistory,
    generationConfig: {
      maxOutputTokens: 350,
    },
  });

  conversation._apiKey = null;
  return conversation;
}

export async function sendMessage(message: string): Promise<{ text: string; conversation: Conversation | null }> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const response = {
    text: 'Something went wrong',
    conversation: null,
  };

  if (!conversation) {
    console.log('Conversation Error');
    return response;
  }

  try {
    conversation._apiKey = geminiApiKey;
    const result = await conversation.sendMessage(message);
    response.text = await result.response.text();
    response.conversation = conversation;
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    response.conversation = conversation;
    return response;
  }
}
