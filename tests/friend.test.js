const request = require("supertest");

const app = require("../src/app");
const {
  connect,
  tokenUserOne,
  url,
  pageOneId,
  userTwoId,
  userOneId,
  tokenUserTwo,
  tokenUserThree,
} = require("./db");

beforeAll(async () => {
  const db = await connect();
  db.collection("Friends").drop();
});

describe(`${url}/friend`, () => {
  describe("Send friend request", () => {
    test("send friend request", async () => {
      const responce = await request(app.callback())
        .post(`${url}/friend/sendFriendRequest/${userTwoId}`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });
  });

  describe("Accept friend request", () => {
    test("Accept friend request", async () => {
      const responce = await request(app.callback())
        .post(`${url}/friend/acceptFriendRequest/${userOneId}`)
        .set("Authorization", `Bearer ${tokenUserTwo}`)
        .send();

      expect(responce.status).toBe(200);
    });
  });

  describe("Cancle friend request", () => {
    test("Cancle friend request", async () => {
      const responce = await request(app.callback())
        .post(`${url}/friend/cancelFriendRequest/${userOneId}`)
        .set("Authorization", `Bearer ${tokenUserThree}`)
        .send();

      expect(responce.status).toBe(404);
    });
  });

  describe("Remove friend", () => {
    test("Remove friend", async () => {
      const responce = await request(app.callback())
        .post(`${url}/friend/removeFriend/${userOneId}`)
        .set("Authorization", `Bearer ${tokenUserThree}`)
        .send();

      expect(responce.status).toBe(200);
    });
  });

  describe("Friends", () => {
    test("Fetch all friends", async () => {
      const responce = await request(app.callback())
        .get(`${url}/friend/friends`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });

    test("Fetch all friend request", async () => {
      const responce = await request(app.callback())
        .get(`${url}/friend/friendRequests`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });

    test("Fetch all friend request", async () => {
      const responce = await request(app.callback())
        .get(`${url}/friend/sendedFriendRequests`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });
  });
});
