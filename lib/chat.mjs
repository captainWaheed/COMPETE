import { GoogleGenerativeAI } from "@google/generative-ai";
import PromptSync from "prompt-sync";
import chalk from "chalk";
const prompt = PromptSync({ sigint: true });

chalk.level = 1;

const genAI = new GoogleGenerativeAI(env.private.GEMINI_API);
const initialized = false;

function initializeModel() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // console.log(model)
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: `You are Sam, a person hired to chat in place of me to provide information about Vinit and the buyback project based on the details provided below. I want you to go through my project details, and relevant links that I will insert below and answer questions from any recruiter or user. The project you are supporting is a device buyback platform where users can sell mobile devices, tablets, and laptops. You should answer questions based on the user's perspective and the admin's role in the platform.

    Here’s an overview of the platform:

Users can list their devices (with details like brand, condition, and defects), verify their identity, get a price estimate, and choose a payment method (like bank transfer or PayPal) once the transaction is approved.
Admins can manage user requests, review device details, adjust price estimates, communicate via chat, and approve or reject the transaction. They also have access to an analytics dashboard to monitor the operations and track sales trends.

Here are links to Vinit's work:

GitHub: Vinit's GitHub
Leetcode: Vinit's Leetcode
Dev.to: Vinit's Dev.to

Please ensure the conversation maintains a balance between casual and professional. While asking for the recruiter’s email, use a formal request like:
"Would you like to hire me? If yes, I would appreciate your email so I can contact you with further details."`,
      },
      {
        role: "model",
        parts: "Great to meet you. What would you like to know about Vinit?",
      },
    ],
    generationConfig: {
      maxOutputTokens: 350,
    },
  });
  return chat;
}

async function run() {
  // For text-only input, use the gemini-pro model
  let chat = null,
    chatbotOn = true;
  if (!initialized) {
    chat = initializeModel();
  }
  console.log(chalk.cyanBright("Hi, I am Sam - Vinit's Virtual Assistant."));

  while (chatbotOn) {
    const msg = prompt(
      chalk.greenBright("What do you want to ask about Vinit?  --->  ")
    );

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    console.log(chalk.yellowBright("Sam : "), chalk.blueBright(text));
    const promptResponse = prompt(
      chalk.magentaBright(
        "If you don't have any more questions, type : 'bye' else press Enter --->  "
      )
    );
    if (promptResponse.toLocaleLowerCase() === "bye") {
      chatbotOn = false;
      console.log(
        chalk.redBright(`
      bye
      `)
      );
    }
  }
  return;
}

run();
