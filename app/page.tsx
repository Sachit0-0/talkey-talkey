'use client';

import { useState } from 'react';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinChat = () => {
    if (username.trim()) {
      setIsJoined(true);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center ">
      <main className="flex min-h-screen flex-col items-center justify-center p-24 w-full">
        {!isJoined ? (
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-8 rounded shadow-md">
            <h2 className="text-2xl font-bold text-white mb-4">Enter your username</h2>
            <input
              type="text"
              className="border rounded px-4 py-2 w-full text-white mb-4"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleJoinChat();
                }
              }}
            />
            <button
              className="relative group cursor-pointer text-sky-50 overflow-hidden h-12 w-34 rounded-md bg-sky-800 p-1 flex items-center justify-center font-extrabold mx-auto"
              onClick={handleJoinChat}
            >
              <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-40 h-40 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-900" />
              <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-32 h-32 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-800" />
              <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-24 h-24 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-700" />
              <div className="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-14 h-14 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-sky-600" />
              <p className="z-10">Join Chat</p>
            </button>
          </div>
        ) : (
          <ChatInterface username={username} />
        )}
      </main>
    </div>
  );
}

