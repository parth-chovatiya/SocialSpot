const cors = require("@koa/cors");
const Koa = require("koa");

const bodyParser = require("koa-bodyparser");

const { connectDB, getDB } = require("./DB/connectDB");
const router = require("./routers/index.router");

const app = new Koa();
app.use(cors());

app.use(bodyParser());

// connectDB(function (error, client) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Database is connected.");
//     app.context.db = client;
//   }
// });

app.use(async (ctx, next) => {
  // app.context.db = await connectDB();
  app.context.db = await getDB();
  await next();
});

// app.use(async (ctx) => {
//   ctx.body = "Hello";
// });

router.get("/", (ctx) => {
  ctx.body = "Hello World...";
});

app.use(router.routes()).use(router.allowedMethods());

// TODO
// app.on("error", (error, ctx) => {
//   ctx.body = "Something went wrong...";
//   console.log("Server error", error);
// });

module.exports = app;
