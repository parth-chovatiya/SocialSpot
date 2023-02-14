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
  url,
  pageOne,
  pageOneId,
  updatedPageOne,
  tokenUserOne,
  tokenUserTwo,
  pageTwo,
  pageTwoId,
  permissionOne,
  removePermissionOne,
  userPermission,
  tokenUserThree,
  userPermissionId,
} = require("./db");

beforeAll(async () => {
  const db = await connect();
  db.collection("Pages").drop();
});

const pages = [pageOne, pageTwo];

describe("/api/v1/page/", () => {
  // --------- CREATE ---------
  describe("CREATE PAGE", () => {
    test("Create Page", async () => {
      for (let page of pages) {
        const responce = await request(app.callback())
          .post(`${url}/page/create/`)
          .set("Authorization", `Bearer ${tokenUserOne}`)
          .send(page);
        expect(responce.status).toBe(201);
      }
    });
  });

  // --------- READ ---------
  describe("READ PAGE", () => {
    test("fetch Page by pageId", async () => {
      const responce = await request(app.callback())
        .get(`${url}/page/page/${pageOneId}`)
        .send();

      expect(responce.status).toBe(200);
    });

    test("fetch my pages", async () => {
      const responce = await request(app.callback())
        .get(`${url}/page/user/my`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });

    test("fetch pages by userId", async () => {
      const responce = await request(app.callback())
        .get(`${url}/page/user/${userOneId}`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });

    test("Search Page", async () => {
      const posts = await request(app.callback())
        .post(`${url}/page/search/`)
        .send({
          text: "page desc",
        });

      expect(posts.status).toBe(200);
    });
  });

  // --------- UPDATE ---------
  describe("UPDATE PAGE", () => {
    test("Update his/her page", async () => {
      const responce = await request(app.callback())
        .patch(`${url}/page/update/${pageOneId}`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(updatedPageOne);
      expect(responce.status).toBe(200);
    });

    test("Can't update others page", async () => {
      const responce = await request(app.callback())
        .patch(`${url}/page/update/${pageOneId}`)
        .set("Authorization", `Bearer ${tokenUserTwo}`)
        .send(updatedPageOne);

      expect(responce.status).toBe(404);
    });
  });

  // --------- DELETE ---------
  describe("DELETE PAGE", () => {
    //   test("Delete My Pages", async () => {
    //     const responce = await request(app.callback())
    //       .delete(`${url}/page/delete/${pageOneId}`)
    //       .set("Authorization", `Bearer ${tokenUserOne}`)
    //       .send();

    //     expect(responce.status).toBe(200);
    //   });

    test("Delete Other user Pages", async () => {
      const responce = await request(app.callback())
        .delete(`${url}/page/delete/${pageTwoId}`)
        .set("Authorization", `Bearer ${tokenUserTwo}`)
        .send();

      expect(responce.status).toBe(400);
    });
  });

  // --------------------------

  describe("PAGES", () => {
    test("Fetch all pages that i follow", async () => {
      const responce = await request(app.callback())
        .get(`${url}/page/followedPages/`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });

    test("Fetch pages in which i have permission to publish post", async () => {
      const responce = await request(app.callback())
        .get(`${url}/page/permissionPages/`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });
  });

  describe("PERMISSION", () => {
    test("Give permission", async () => {
      const responce = await request(app.callback())
        .post(`${url}/page/givePermission/`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(permissionOne);

      expect(responce.status).toBe(200);
    });

    test("Remove permission", async () => {
      const responce = await request(app.callback())
        .post(`${url}/page/removePermission/`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send(removePermissionOne);

      expect(responce.status).toBe(200);
    });

    test("Publish post in the page in which user have access", async () => {
      const responce = await request(app.callback())
        .post(`${url}/post/createPost/`)
        .set("Authorization", `Bearer ${tokenUserThree}`)
        .send(userPermission);

      expect(responce.status).toBe(200);
    });

    test("Accept post publish request", async () => {
      const responce = await request(app.callback())
        .post(`${url}/page/acceptPostPublishRequests/`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send({
          postId: userPermissionId,
        });

      console.log(responce.error);
      expect(responce.status).toBe(200);
    });

    test("Fetch pages in which i have permission to publish post", async () => {
      const responce = await request(app.callback())
        .get(`${url}/page/permissionPages/`)
        .set("Authorization", `Bearer ${tokenUserOne}`)
        .send();

      expect(responce.status).toBe(200);
    });
  });
});
