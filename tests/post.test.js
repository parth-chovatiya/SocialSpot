const request = require("supertest");

const app = require("../src/app");
const {
  connect,
  userOne,
  postOne,
  setupDatabase,
  updatedPostOne,
  postTwo,
  postOneId,
  userOneId,
  tokenUserOne,
  url,
  tokenUserTwo,
} = require("./db");

beforeAll(async () => {
  const db = await connect();
  db.collection("Posts").drop();
});

describe("/api/v1/post/", () => {
  // --------- CREATE ---------
  describe("CREATE POST", () => {
    // Create Post
    test("Create Post", async () => {
      const responce = await request(app.callback())
        .post("/api/v1/post/createPost")
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(postOne);
      expect(responce.status).toBe(201);
    });

    test("Post Creation fail", async () => {
      const responce = await request(app.callback())
        .post("/api/v1/post/createPost")
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(postTwo);

      expect(responce.status).toBe(400);
    });
  });

  // --------- READ ---------
  describe("READ POST", () => {
    test("Search Post", async () => {
      const posts = await request(app.callback())
        .post("/api/v1/post/search/")
        .send({
          text: "description",
        });

      expect(posts.status).toBe(200);
    });

    test("Fetch public posts", async () => {
      const posts = await request(app.callback())
        .get("/api/v1/post/fetchPublic/")
        .send();

      expect(posts.status).toBe(200);
    });

    test("Fetch Private Posts", async () => {
      const posts = await request(app.callback())
        .get("/api/v1/post/fetchPrivate/")
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(posts.status).toBe(200);
    });

    test("Fetch My Posts", async () => {
      const posts = await request(app.callback())
        .get("/api/v1/post/my")
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(posts.status).toBe(200);
    });

    test("Fetch Users Posts", async () => {
      const posts = await request(app.callback())
        .get(`/api/v1/post/${userOneId}`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(posts.status).toBe(200);
    });
  });

  // --------- UPDATE ---------
  describe("UPDATE POST", () => {
    // Update Post
    test("Update Post", async () => {
      const responce = await request(app.callback())
        .patch(`/api/v1/post/updatePost/${postOneId}`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(updatedPostOne);

      expect(responce.status).toBe(200);
    });

    test("Can't update other user's post", async () => {
      const responce = await request(app.callback())
        .patch(`${url}/post/updatePost/${postOneId}`)
        .set("Authorization", `Bearer ${tokenUserTwo}`)
        .send(updatedPostOne);

      expect(responce.status).toBe(400);
    });
  });

  // --------- DELETE ---------
  // describe("DELETE POST", () => {
  //   test("Delete Post", async () => {
  //     const post = await request(app.callback())
  //       .delete(`/api/v1/post/deletePost/${postOneId}`)
  //       .set("Authorization", `Bearer ${tokenUserOne}`)
  //       .send();
  //     expect(post.status).toBe(200);
  //   });

  //   test("Post Not Found", async () => {
  //     const post = await request(app.callback())
  //       .delete(`/api/v1/post/deletePost/${postOneId}`)
  //       .set("Authorization", `Bearer ${tokenUserOne}`)
  //       .send();
  //     expect(post.status).toBe(404);
  //   });

  //   test("Can't delete other user's post", async () => {
  //     const responce = await request(app.callback())
  //       .delete(`${url}/post/deletePost/${postOneId}`)
  //       .set("Authorization", `Bearer ${tokenUserTwo}`)
  //       .send(updatedPostOne);

  //     expect(responce.status).toBe(404);
  //   });
  // });
});
