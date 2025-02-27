import React from 'react';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  roomId?: string;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => (
  <div className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
    <span className={`inline-block p-2 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
      <strong>{message.user}: </strong>{message.text}
    </span>
    <div className="text-xs text-gray-500 mt-1">
      {new Date(message.timestamp).toLocaleTimeString()}
    </div>
  </div>
);

export default ChatMessage;