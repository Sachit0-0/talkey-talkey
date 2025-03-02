import React from 'react';

interface OnlineUsersProps {
  users: string[];
  currentUser: string;
}

const OnlineUsers: React.FC<OnlineUsersProps> = ({ users, currentUser }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-md rounded-lg p-4 border-1 border-blue-300">
      <h2 className="text-lg font-semibold mb-2 text-white">Connected users</h2>
      <hr className="border-t-2 border-blue-300 mb-4" />

      <ul className="flex flex-col space-y-2">
        {users.map((user, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className={user === currentUser ? 'font-bold text-white' : 'text-white'}>
              {user} {user === currentUser && '(you)'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;

