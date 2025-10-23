
import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';

// Khai báo renderMathInElement trên đối tượng window cho TypeScript
declare global {
  interface Window {
    renderMathInElement?: (element: HTMLElement, options?: any) => void;
  }
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isRobot = message.sender === 'robot';
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRobot && contentRef.current && window.renderMathInElement) {
      window.renderMathInElement(contentRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true },
        ],
        throwOnError: false,
      });
    }
  }, [message.text, isRobot]);

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {isRobot && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
          R
        </div>
      )}
      <div className={`max-w-md lg:max-w-2xl rounded-2xl p-4 ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="User upload"
            className="rounded-lg mb-2 max-w-xs h-auto"
          />
        )}
        <div ref={contentRef} className="whitespace-pre-wrap">{message.text}</div>
      </div>
    </div>
  );
};

export default ChatMessage;