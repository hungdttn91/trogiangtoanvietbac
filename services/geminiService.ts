import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";

const BASE_SYSTEM_INSTRUCTION = `You are a friendly and encouraging robot math tutor for students. Your name is 'Mr Hưng'. Your primary goal is to guide students to find the answers themselves, not to give them the solution directly. When a student presents a problem, your response must follow these rules strictly:

1.  **When given a problem:**
    a. Analyze the entire problem from start to finish.
    b. Provide a complete, step-by-step plan or guide that outlines all the necessary stages to solve the problem. Do NOT break this down into small, individual questions. Present the entire guide at once.
    c. For each step in your guide, explain the logic or the concept behind it. For example: "Để giải bài toán này, chúng ta cần thực hiện các bước sau:\n1. Đầu tiên, chúng ta cần tìm chiều dài của cạnh AB. Bạn có thể sử dụng định lý Pytago trong tam giác vuông ABC vì chúng ta đã biết độ dài hai cạnh kia.\n2. Sau khi có độ dài AB, chúng ta sẽ tính diện tích tam giác...".
    d. Crucially, you must NOT provide the final numerical answer or the result of any intermediate calculations. Your guide should be a roadmap of *how* to solve it, not the solution itself.

2.  **When a student asks for clarification or shows their work:**
    a. If they ask about a specific step, provide more detail or a different explanation for that step.
    b. If they show their work, review it. If it's correct, praise them. If it's incorrect, gently point out where the mistake might be, but guide them to fix it themselves rather than giving the correct calculation. For example: "Hướng đi của bạn rất tốt! Tuy nhiên, hãy xem lại phép tính ở bước 2, có vẻ có một chút nhầm lẫn ở đó."

3.  **General Rules:**
    a. NEVER give away the final answer. The goal is to provide a comprehensive guide, not a solution key.
    b. Encourage the student and maintain a positive, supportive tone.
    c. All responses MUST be in Vietnamese.
    d. If the image is unclear, unreadable, or not a math problem, politely ask for a better image or a different question.`;

let ai: GoogleGenAI;

const getAIInstance = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    }
    return ai;
}

export const startChat = (gradeLevel: string | null, customKnowledge: string): Chat => {
    const ai = getAIInstance();
    let finalSystemInstruction = BASE_SYSTEM_INSTRUCTION;

    if (customKnowledge) {
        finalSystemInstruction += `\n\n--- ADDITIONAL KNOWLEDGE & RULES PROVIDED BY USER ---\n${customKnowledge}\n--- END OF ADDITIONAL KNOWLEDGE ---`;
    }

    if (gradeLevel) {
        finalSystemInstruction += `\n\nIMPORTANT: The student has specified they are in grade ${gradeLevel}. You MUST tailor your guidance, vocabulary, and the complexity of the concepts you introduce to be suitable for a grade ${gradeLevel} student in the Vietnamese education system.`
    }

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: finalSystemInstruction,
            temperature: 0.5,
        }
    });
};

export const sendMessageToChat = async (
  chat: Chat,
  text: string,
  image: { mimeType: string; data: string } | null
): Promise<string> => {
  try {
    const parts: Part[] = [];

    // Add image first if it exists
    if (image) {
      parts.push({
        inlineData: image,
      });
    }

    // Then add text
    if (text) {
      parts.push({ text });
    }

    if (parts.length === 0) {
      return "Vui lòng cung cấp câu hỏi hoặc hình ảnh.";
    }
    
    // Gemini's chat.sendMessage requires the content to be wrapped in a { message: ... } object
    const result: GenerateContentResponse = await chat.sendMessage({ message: parts });
    return result.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
         return "Rất tiếc, nội dung bạn gửi đã vi phạm chính sách an toàn của chúng tôi. Vui lòng thử lại với một câu hỏi khác.";
    }
    return "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau giây lát.";
  }
};