const request = require("supertest");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const app = require("../src/app");
const {
  connect,
  userOne,
  userOneId,
  tokenUserOne,
  setupDatabase,
  userTwo,
} = require("./db");

beforeAll(async () => {
  const db = await connect();
  db.collection("Users").drop();
});
// beforeEach(async () => await db.clear());
// afterAll(async () => await db.close());

const users = [
  {
    user: userOne,
    create: 1,
    login: 1,
    verify: 1,
  },
  {
    user: userTwo,
    create: 1,
    login: 1,
    verify: 1,
  },
];

// const createUser = [userOne, userTwo];
// const loginUser = [userOne, userTwo];
// const verifyEmail = [userOne, userTwo];

describe("/api/v1/auth/", () => {
  for (let obj of users) {
    const user = obj.user;
    // User Registration
    describe("Create new user", () => {
      test("Create new user", async () => {
        const responce = await request(app.callback())
          .post("/api/v1/auth/register/")
          .send(user);
        expect(responce.status).toBe(201);

        console.log(responce.status);
        console.log(responce.error);

        const _id = new ObjectId(responce.body.insertedUser.insertedId);
        const registeredUser = await app.context.db
          .collection("Users")
          .findOne({ _id });
        expect(registeredUser).not.toBeNull();
      });

      test("Can't create same user again", async () => {
        const responce = await request(app.callback())
          .post("/api/v1/auth/register/")
          .send(user);

        expect(responce.status).toBe(400);
      });
    });

    // User Authentication
    describe("Login User", () => {
      // Login User
      test("Login User", async () => {
        const responceUser1 = await request(app.callback())
          .post("/api/v1/auth/login/")
          .send({
            email: user.email,
            password: user.password,
          });
        expect(responceUser1.status).toBe(200);
      });

      test("Can't Login User", async () => {
        const responce = await request(app.callback())
          .post("/api/v1/auth/login/")
          .send({
            email: user.email,
            password: user.password + ".",
          });
        expect(responce.status).toBe(400);
      });
    });

    // Verify Email
    describe("Verify Email", () => {
      // Verify Email
      test("Verify Email", async () => {
        const responce = await request(app.callback())
          .get(`/api/v1/auth/verifyEmail/${user._id}/`)
          .send();
        expect(responce.status).toBe(200);
      });
    });
  }
});
