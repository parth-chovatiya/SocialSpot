const path = require("path");
const http = require("http");
const Koa = require("koa");
const serve = require("koa-static");
const redis = require("redis");

const app = new Koa();

// Redis connection -> put it in other file
const db = redis.createClient();
db.connect();
db.on("connect", () => {
  console.log("Redis Connected!");
});

const server = http.createServer(app.callback());

const socketio = require("socket.io");
const save_chat = require("./db/query");
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// const publicDirectoryPath = path.join(__dirname, "../client/public");
// app.use(serve(publicDirectoryPath));

app.use(async (ctx, next) => {
  ctx.body = "Server runnning.";
  await next();
});

io.use((socket, next) => {
  const { _id, username } = socket.handshake.auth;

  if (!username) return next(new Error("invalid username"));

  socket._id = _id;
  socket.username = username;
  next();
});

let onlineUsers = [];
io.on("connection", (socket) => {
  // socket.emit("message", {
  //   text: "Welcome",
  //   from: "Admin",
  //   socketID: socket.id,
  // });

  // To save the connected users in the redis
  // socket._id -> userId
  db.set(socket._id, socket.id);

  socket.on("login", async ({ userId }) => {
    const socketId = await db.get(userId);
    if (!onlineUsers.includes({ socketId, userId }))
      onlineUsers.push({ socketId, userId });
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("sendMessage", async (data, callback) => {
    const { from, to, text, socketID1 } = data;

    await save_chat(data);
    const socketID = await db.get(to);

    io.to(socketID)
      .to(socket.id)
      .emit("message", data, () => {
        console.log("Message sended.");
      });

    callback();
  });

  socket.on("disconnect", async () => {
    const userId = socket._id;
    const socketId = await db.get(userId);

    const filteredPeople = onlineUsers.filter(
      (user) => user.socketId !== socketId && user.userId !== userId
    );
    onlineUsers = filteredPeople;
    io.emit("onlineUsers", onlineUsers);

    db.del(socket._id);
  });
});

const PORT = process.env.PORT_CHAT || 3001;
server.listen(PORT, () => {
  console.log("Chat Server is running at POST: ", PORT);
});
