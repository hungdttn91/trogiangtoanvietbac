import React from 'react';

interface RobotTutorProps {
  isThinking: boolean;
  isChatStarted: boolean;
  onNewChat: () => void;
}

const RobotTutor: React.FC<RobotTutorProps> = ({ 
  isThinking, 
  isChatStarted,
  onNewChat
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-b-3xl shadow-lg">
      <div className="w-48 h-48 md:w-56 md:h-56 relative">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <rect x="50" y="30" width="100" height="80" rx="15" fill="#E0E0E0" stroke="#B0B0B0" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="80" cy="65" r="12" fill="#FFFFFF" />
          <circle cx="120" cy="65" r="12" fill="#FFFFFF" />
          <circle cx="80" cy="65" r="5" fill="#333333" />
          <circle cx="120" cy="65" r="5" fill="#333333" />
          {/* Mouth */}
          <path d="M 80 90 Q 100 100 120 90" stroke="#333333" strokeWidth="3" fill="none" />
          {/* Antenna */}
          <line x1="100" y1="30" x2="100" y2="10" stroke="#B0B0B0" strokeWidth="3" />
          <circle cx="100" cy="10" r="5" fill="#FFD700">
            {isThinking && (
              <animate
                attributeName="r"
                values="5;8;5"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          {/* Body */}
          <rect x="35" y="110" width="130" height="60" rx="10" fill="#D0D0D0" stroke="#A0A0A0" strokeWidth="2" />
          {/* Nameplate */}
          <rect x="65" y="125" width="70" height="25" rx="5" fill="#FFFFFF" stroke="#B0B0B0" strokeWidth="1" />
          <text x="100" y="142" fontFamily="monospace" fontSize="12" textAnchor="middle" fill="#333">Mr Hưng</text>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mt-4">Trợ lý Toán học Mr Hưng</h1>
      <p className="text-white/80 text-center px-4">Đây là trợ giảng Toán học. Sản phẩm của thầy Hưng - Việt Bắc, nhằm hỗ trợ học sinh làm bài tập. (Không phải là đáp án)</p>
      
      <div className="mt-4 w-full max-w-md">
        <button 
          onClick={onNewChat}
          disabled={!isChatStarted}
          className="w-full bg-white/20 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cuộc trò chuyện mới
        </button>
      </div>
    </div>
  );
};

export default RobotTutor;