const Koa = require("koa");

require("dotenv/config");

const bodyParser = require("koa-bodyparser");

const { connectDB } = require("./DB/connectDB");
const router = require("./routers/index.router");

const app = new Koa();

app.use(bodyParser());

connectDB(function (error, client) {
  if (error) {
    console.log(error);
  } else {
    console.log("Database is connected.");
    app.context.db = client;
  }
});

// app.use(async (ctx) => {
//   ctx.body = "Hello";
// });

app.use(router.routes()).use(router.allowedMethods());

// TODO
// app.on("error", (error, ctx) => {
//   ctx.body = "Something went wrong...";
//   console.log("Server error", error);
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
