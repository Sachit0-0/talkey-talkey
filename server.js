const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const users = new Map();
const rooms = new Set(['general']); // Start with a default room

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A client connected");

    socket.on("user joined", (username) => {
      users.set(socket.id, { username, room: 'general' });
      socket.join('general');
      io.to('general').emit("update users", Array.from(users.values())
        .filter(user => user.room === 'general')
        .map(user => user.username));
      socket.broadcast.to('general').emit("user joined", username);
    });

    socket.on("chat message", (msg) => {
      const user = users.get(socket.id);
      if (user) {
        io.to(user.room).emit("chat message", { ...msg, room: user.room });
      }
    });

    socket.on("create room", (roomName) => {
      if (!rooms.has(roomName)) {
        rooms.add(roomName);
        io.emit("update rooms", Array.from(rooms));
      }
    });

    socket.on("join room", (roomName) => {
      const user = users.get(socket.id);
      if (user && rooms.has(roomName)) {
        const oldRoom = user.room;
        socket.leave(oldRoom);
        socket.join(roomName);
        user.room = roomName;
        io.to(oldRoom).emit("update users", Array.from(users.values())
          .filter(u => u.room === oldRoom)
          .map(u => u.username));
        io.to(roomName).emit("update users", Array.from(users.values())
          .filter(u => u.room === roomName)
          .map(u => u.username));
        socket.emit("room joined", roomName);
      }
    });

    socket.on("disconnect", () => {
      const user = users.get(socket.id);
      if (user) {
        console.log("User disconnected:", user.username);
        users.delete(socket.id);
        io.to(user.room).emit("update users", Array.from(users.values())
          .filter(u => u.room === user.room)
          .map(u => u.username));
        io.to(user.room).emit("user left", user.username);
      }
    });
  });

  const PORT = process.env.PORT || 3000; // Use the port from the environment, or fallback to 3000
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
 
});