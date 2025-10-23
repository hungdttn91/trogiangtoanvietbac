
import React, { useState, useRef } from 'react';
import { SendIcon, PaperclipIcon, XCircleIcon } from './icons';

interface ChatInterfaceProps {
  onSendMessage: (text: string, image: File | null) => void;
  isLoading: boolean;
  isGradeSet: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage, isLoading, isGradeSet }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placeholderText = isGradeSet
    ? "Nhập câu hỏi hoặc dán ảnh bài tập vào đây..."
    : "Nhập lớp học của bạn (ví dụ: 10, 11, 12)...";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData.items;
    for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
                setImageFile(file);
                setImagePreviewUrl(URL.createObjectURL(file));
                event.preventDefault();
                break; 
            }
        }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageFile(null);
    if(imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading || (!text.trim() && !imageFile)) return;
    onSendMessage(text, imageFile);
    setText('');
    removeImage();
  };
  
  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {imagePreviewUrl && (
            <div className="relative inline-block mb-2">
                <img src={imagePreviewUrl} alt="Preview" className="h-24 w-auto rounded-lg object-cover" />
                <button onClick={removeImage} type="button" className="absolute -top-2 -right-2 bg-gray-700 rounded-full text-white hover:bg-red-500 transition-colors">
                    <XCircleIcon className="h-6 w-6" />
                </button>
            </div>
        )}
        <div className="flex items-center p-2 border border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={placeholderText}
            className="flex-grow bg-transparent border-none focus:ring-0 resize-none p-2 text-gray-800 placeholder-gray-500"
            rows={1}
            disabled={isLoading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <button
            type="button"
            onClick={triggerFileSelect}
            className="p-2 text-gray-500 hover:text-blue-600 disabled:text-gray-300"
            disabled={isLoading || !isGradeSet}
          >
            <PaperclipIcon className="h-6 w-6" />
          </button>
          <button
            type="submit"
            className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-300"
            disabled={isLoading || (!text.trim() && !imageFile)}
          >
            <SendIcon className="h-6 w-6" />
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">Bạn có thể Shift + Enter để xuống dòng.</p>
      </form>
    </div>
  );
};

export default ChatInterface;
