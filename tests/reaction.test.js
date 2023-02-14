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
  postReactionOne,
  commentReactionOne,
  commentReactionTwo,
  unlikeCommentOne,
  unlikePostOne,
} = require("./db");

beforeAll(async () => {
  const db = await connect();
  db.collection("Reactions").drop();
});

describe(`${url}/reaction`, () => {
  describe("Like", () => {
    test("Like Post", async () => {
      const responce = await request(app.callback())
        .post(`${url}/reaction/like`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(postReactionOne);

      expect(responce.status).toBe(201);
    });

    test("Like Comment", async () => {
      const responce = await request(app.callback())
        .post(`${url}/reaction/like`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(commentReactionOne);

      expect(responce.status).toBe(201);
    });
  });

  describe("Unlike", () => {
    test("Unlike Post", async () => {
      const responce = await request(app.callback())
        .post(`${url}/reaction/unlike`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(unlikePostOne);

      expect(responce.status).toBe(200);
    });

    test("Can't Unlike other user's liked Post", async () => {
      const responce = await request(app.callback())
        .post(`${url}/reaction/unlike`)
        .set("Authorization", `Bearer ${tokenUserTwo}`)
        .send(unlikePostOne);

      expect(responce.status).toBe(404);
    });

    test("Unlike Comment", async () => {
      const responce = await request(app.callback())
        .post(`${url}/reaction/unlike`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(unlikeCommentOne);

      expect(responce.status).toBe(200);
    });

    test("Can't Unlike other user's liked Comment", async () => {
      const responce = await request(app.callback())
        .post(`${url}/reaction/unlike`)
        .set("Authorization", `Bearer ${tokenUserTwo}`)
        .send(unlikeCommentOne);

      expect(responce.status).toBe(404);
    });
  });
});
