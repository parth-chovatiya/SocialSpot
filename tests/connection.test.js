const request = require("supertest");

const app = require("../src/app");
const { connect, tokenUserOne, url, pageOneId } = require("./db");

beforeAll(async () => {
  const db = await connect();
  db.collection("Connections").drop();
});

describe("/api/v1/connection", () => {
  describe("Follow pages", () => {
    test("follow pages", async () => {
      const responce = await request(app.callback())
        .post(`${url}/connection/followPage/${pageOneId}`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });
  });

  describe("Unfollow pages", () => {
    test("follow pages", async () => {
      const responce = await request(app.callback())
        .post(`${url}/connection/unfollowPage/${pageOneId}`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });
  });
});
