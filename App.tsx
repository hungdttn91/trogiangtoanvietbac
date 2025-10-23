import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Message } from './types';
import RobotTutor from './components/RobotTutor';
import ChatInterface from './components/ChatInterface';
import ChatMessage from './components/ChatMessage';
import { startChat, sendMessageToChat } from './services/geminiService';
import type { Chat } from '@google/genai';


const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
  
const INITIAL_MESSAGE: Message = {
    id: 'initial-message',
    sender: 'robot',
    text: 'Xin chào! Tôi là Mr Hưng. Để tôi có thể hỗ trợ tốt nhất, bạn đang học lớp mấy?',
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);
  const [customKnowledge, setCustomKnowledge] = useState<string>(
    'QUY TẮC BẮT BUỘC: Khi học sinh hỏi cách chứng minh nhiều điểm cùng thuộc một đường tròn, BẠN CHỈ ĐƯỢC PHÉP hướng dẫn một phương pháp duy nhất: "Chứng minh các điểm đó cách đều một điểm cố định (tâm của đường tròn)". Tuyệt đối không được gợi ý bất kỳ phương pháp nào khác như tứ giác nội tiếp hay cung chứa góc.\n\nLƯU Ý VỀ CHƯƠNG TRÌNH HỌC: Với học sinh dưới lớp 9, chỉ sử dụng kiến thức về hàm số bậc nhất. Từ lớp 10 trở đi mới được sử dụng kiến thức về hàm số bậc hai.'
    );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setGradeLevel(null);
    chatRef.current = null;
    setIsLoading(false);
  };

  const handleSendMessage = useCallback(async (text: string, imageFile: File | null) => {
    setIsLoading(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Stage 1: Get grade level
    if (!gradeLevel) {
        const grade = text.trim();
        if (grade) {
            setGradeLevel(grade);
            const robotMessage: Message = {
                id: `robot-${Date.now()}`,
                sender: 'robot',
                text: `Đã hiểu! Tôi sẽ đưa ra những gợi ý phù hợp với trình độ lớp ${grade} của bạn. Bây giờ hãy gửi bài toán bạn cần giúp đỡ nhé!`,
            };
            setMessages((prev) => [...prev, robotMessage]);
        } else {
             const robotMessage: Message = {
                id: `robot-${Date.now()}`,
                sender: 'robot',
                text: `Vui lòng cho tôi biết bạn đang học lớp mấy để tôi có thể hỗ trợ tốt hơn.`,
            };
            setMessages((prev) => [...prev, robotMessage]);
        }
        setIsLoading(false);
        return;
    }

    // Stage 2: Start chat and handle problems
    if (!chatRef.current) {
        chatRef.current = startChat(gradeLevel, customKnowledge);
    }
    
    let imagePayload: { mimeType: string; data: string } | null = null;
    if (imageFile) {
      try {
        const base64Data = await fileToBase64(imageFile);
        imagePayload = {
          mimeType: imageFile.type,
          data: base64Data,
        };
      } catch (error) {
        console.error("Error converting file to base64", error);
        const errorMessage: Message = {
            id: `robot-${Date.now()}`,
            sender: 'robot',
            text: "Xin lỗi, đã có lỗi khi xử lý hình ảnh của bạn.",
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }
    }

    const robotResponseText = await sendMessageToChat(chatRef.current, text, imagePayload);

    const robotMessage: Message = {
      id: `robot-${Date.now()}`,
      sender: 'robot',
      text: robotResponseText,
    };

    setMessages((prev) => [...prev, robotMessage]);
    setIsLoading(false);
  }, [gradeLevel, customKnowledge]);

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100">
      <RobotTutor 
        isThinking={isLoading}
        isChatStarted={!!gradeLevel}
        onNewChat={handleNewChat}
      />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
                 <div className="flex items-start gap-3 my-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">R</div>
                    <div className="max-w-md rounded-2xl p-4 bg-white text-gray-800 rounded-bl-none shadow-sm flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </main>
      <ChatInterface onSendMessage={handleSendMessage} isLoading={isLoading} isGradeSet={!!gradeLevel} />
    </div>
  );
};

export default App;