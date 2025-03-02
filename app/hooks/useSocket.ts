import { useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  room: string;
}

// Define the debounce function with more specific types
// Define debounce function with proper typing for the arguments
const debounce = (func: (isTyping: boolean) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (isTyping: boolean) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(isTyping), delay);
  };
};


export const useSocket = (username: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>('general');

  // Fix: debounce function with proper typing
  const debouncedSendTypingStatus = useCallback(
    debounce((isTyping: boolean) => {
      if (socket) {
        socket.emit(isTyping ? 'typing' : 'stop typing', username);
      }
    }, 300),
    [socket, username] // Dependencies include socket and username
  );

  const addSystemMessage = useCallback((text: string, roomId?: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: uuidv4(),
        user: 'System',
        text,
        timestamp: new Date(),
        room: roomId ?? currentRoom,
      } as Message,
    ]);
  }, [currentRoom]);

  useEffect(() => {
    const socketIo = io();

    socketIo.on('connect', () => {
      setIsConnected(true);
      socketIo.emit('user joined', username);
    });

    socketIo.on('disconnect', () => {
      setIsConnected(false);
    });

    socketIo.on('chat message', (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socketIo.on('update users', (updatedUsers: string[]) => {
      setUsers(updatedUsers);
    });

    socketIo.on('update rooms', (updatedRooms: string[]) => {
      setAvailableRooms(updatedRooms);
    });

    socketIo.on('user joined', (joinedUsername: string) => {
      addSystemMessage(`${joinedUsername} has joined the chat.`);
    });

    socketIo.on('user left', (leftUsername: string) => {
      addSystemMessage(`${leftUsername} has left the chat.`);
    });

    socketIo.on('user typing', (typingUsername: string) => {
      setTypingUsers(prev => Array.from(new Set([...prev, typingUsername])));
    });

    socketIo.on('user stop typing', (typingUsername: string) => {
      setTypingUsers(prev => prev.filter(user => user !== typingUsername));
    });

    socketIo.on('room joined', (roomName: string) => {
      setCurrentRoom(roomName);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [username, addSystemMessage]); // Ensuring dependencies are correct

  const sendTypingStatus = (isTyping: boolean) => {
    if (socket) {
      socket.emit(isTyping ? 'typing' : 'stop typing', username);
    }
  };

  const stopTypingImmediately = useCallback(() => {
    if (socket) {
      socket.emit('stop typing', username);
    }
  }, [socket, username]);

  const sendMessage = (text: string) => {
    if (socket) {
      const message: Message = {
        id: uuidv4(),
        user: username,
        text,
        timestamp: new Date(),
        room: currentRoom,
      };
      socket.emit('chat message', message);
    }
  };

  const createRoom = useCallback((roomName: string) => {
    if (socket) {
      socket.emit('create room', roomName);
    }
  }, [socket]);

  const joinRoom = useCallback((roomName: string) => {
    if (socket) {
      socket.emit('join room', roomName);
    }
  }, [socket]);

  return {
    isConnected,
    messages,
    sendMessage,
    users,
    typingUsers,
    sendTypingStatus,
    debouncedSendTypingStatus,
    stopTypingImmediately,
    currentRoom,
    availableRooms,
    createRoom,
    joinRoom
  };
};
