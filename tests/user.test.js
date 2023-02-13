const request = require("supertest");
const db = require("../tests/db");

const app = require("../src/app");

// beforeAll(async () => await db.connect());
// beforeEach(async () => await db.clear());
// afterAll(async () => await db.close());

// test("Fetch all posts", async () => {
//   const responce = await request(app)
//     .get("/api/v1/post/fetchPublic")
//     .send()
//     .expect(200);
// });

test("Hello world works", async () => {
  const response = await request(app.callback()).get("/api/v1/");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Hello World...");
});

describe("POST /api/v1/auth/register", () => {
  test("Create new user", async () => {
    const responce = await request(app.callback())
      .post("/api/v1/auth/register/")
      .send({
        username: "jay_maniya_1",
        firstName: "Parth",
        email: "parth1_1@gmail.com",
        gender: "male",
        password: "MyPass777!",
      });
    // console.log(responce.error);
    // expect(responce.status).toBe(201);
  });

  // test("It should create a new user", (done) => {
  //     // Create a new user
  //   agent
  //     .post("/api/v1/auth/register")
  //     .send({ email: "hello@world.com", password: "123456" })
  //     .expect(201)
  //     .then((res) => {
  //       expect(res.body.user).toBeTruthy();
  //       done();
  //     });
  // });

  test("Hello world works", async () => {
    const response = await request(app.callback()).get("/api/v1/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World...");
  });

  // test("Fetch all posts", async() => {
  //   const response = await request(app.callback()).get('/api/v1/post/fetchPublic');
  //   expect(response.status).toBe(200);

  // expect(response.text).toBe('Hello World...');
  // agent
  //   .get("/api/v1/post/fetchPublic")
  //   .send()
  //   .then((res) => {
  //     expect(res.body).toBeTruthy();
  //     done();
  //   });
  // });
});

// register new user
// test("Should signup a new user", async () => {
//   const responce = await request(app)
//     .post("/api/v1/auth/register")
//     .send({
//       name: "Parth",
//       email: "parth1@gmail.com",
//       password: "MyPass777!",
//     })
//     .expect(201);
//   console.log(responce);

// To verify the user
// User is inserted or not in the database
// Assert that the database was change correctly
// const user = await User.findById(responce.body.user._id);
// user not null
// expect(user).not.toBeNull();

// Assertion abouy the responce
// Name is same or not
// expect(responce.body.user.name).toBe("Parth");

// expect(responce.body).toMatchObject({
//   user: {
//     name: "Parth",
//     email: "parth1@gmail.com",
//   },
//   token: user.tokens[0].token,
// });
// expect(user.password).not.toBe("MyPass777!");
// });
