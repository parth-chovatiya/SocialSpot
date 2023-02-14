const request = require("supertest");

const app = require("../src/app");
const {
  url,
  commentOne,
  connect,
  tokenUserOne,
  commentThree,
  commentOneUpdate,
  commentOneId,
  tokenUserTwo,
  commentThreeId,
} = require("./db");

beforeAll(async () => {
  const db = await connect();
  db.collection("Comments").drop();
});

describe("/api/v1/comment", () => {
  describe("Add Comment", () => {
    test("Add comment to posts", async () => {
      const responce = await request(app.callback())
        .post(`${url}/comment/add`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(commentOne);

      expect(responce.status).toBe(201);
    });

    test("Can't comment to posts", async () => {
      const responce = await request(app.callback())
        .post(`${url}/comment/add`)
        .send(commentOne);

      expect(responce.status).toBe(400);
    });
  });

  describe("Add Comment", () => {
    test("Add comment to inside comment in the post", async () => {
      const responce = await request(app.callback())
        .post(`${url}/comment/add`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(commentThree);

      expect(responce.status).toBe(201);
    });
  });

  describe("Fetch my comments", () => {
    test("My comments", async () => {
      const responce = await request(app.callback())
        .get(`${url}/comment/my`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });
  });

  describe("update comments", () => {
    test("update comments", async () => {
      const responce = await request(app.callback())
        .patch(`${url}/comment/update/${commentOneId}`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(commentOneUpdate);

      expect(responce.status).toBe(200);
    });

    test("can't update other user's comments", async () => {
      const responce = await request(app.callback())
        .patch(`${url}/comment/update/${commentOneId}`)
        .set("Authorization", `Bearer ${tokenUserTwo}`)
        .send(commentOneUpdate);

      expect(responce.status).toBe(404);
    });
  });

  describe("delete comments", () => {
    test("delete comments", async () => {
      const responce = await request(app.callback())
        .delete(`${url}/comment/delete/${commentThreeId}`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });

    test("can't delete other user's comments", async () => {
      const responce = await request(app.callback())
        .delete(`${url}/comment/delete/${commentOneId}`)
        .set("Authorization", `Bearer ${tokenUserTwo}`)
        .send();

      expect(responce.status).toBe(404);
    });
  });
});
