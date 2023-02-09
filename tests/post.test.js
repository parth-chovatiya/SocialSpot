const request = require("supertest");

test("Should publish post", async () => {
  const responce = await request(app)
    .post("/post/createPost")
    .send({
      description: "this is description",
      type: "text",
      privacy: "public",
    })
    .expect(201);

  // const post = await
});
