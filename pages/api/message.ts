// pages/api/message.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeChat, sendMessage } from "../helper/gemini"; // Adjust the import based on your folder structure
import { config } from 'dotenv';
config();



// Define types for the request body and the conversation
interface RequestBody {
  message: string;
  conversation?: any;
}

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables");
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message, conversation }: RequestBody = req.body;

    if (!conversation) {
      console.log("New Conversation!");
      const newConversation = initializeChat(firstMessage);

      return res.status(200).json({
        message: 'Hi, I am Sam. How can I help you.',
        conversation: newConversation,
      });
    } else {
      try {
        const response = await sendMessage(message, conversation);
        return res.status(200).json(response);
      } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Error processing your request" });
      }
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
