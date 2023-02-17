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

io.on("connection", (socket) => {
  // socket.emit("message", {
  //   text: "Welcome",
  //   from: "Admin",
  //   socketID: socket.id,
  // });

  // To save the connected users in the redis
  db.set(socket._id, socket.id);

  socket.on("sendMessage", async (data, callback) => {
    const { from, to, text } = data;
    console.log(data);
    // Save data to the database
    // chat -> receiverId, senderId, text

    await save_chat(data);
    const socketID = await db.get(to);

    // const chat = await save_friend_chat_api(data);
    // console.log(chat);

    // console.log("socketID", socketID);
    io.to(socketID)
      .to(socket.id)
      .emit("message", data, () => {
        console.log("Message sended.");
      });

    callback();
  });

  socket.on("disconnect", () => {
    db.del(socket._id);
  });
});

const PORT = process.env.PORT_CHAT || 3001;
server.listen(PORT, () => {
  console.log("Server is running at POST: ", PORT);
});
