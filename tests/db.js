const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const connectionURL = process.env.MongoDB_Connection_URL;
const databaseName = process.env.DATABASE;

const connect = async () => {
  // console.log(connectionURL);
  // console.log(databaseName);
  const client = new MongoClient(connectionURL);
  await client.connect();
  const _db = client.db(databaseName);

  // const collectionsInfo = await _db.listCollections().toArray();
  // console.log(collectionsInfo);
  // const collections = [];
  // for (let collection of collectionsInfo) {
  //   collections.push(collection.name);
  // }
  // console.log(collections);
  return _db;
};

const url = "/api/v1";

// --------- USER ---------
const userOneId = new ObjectId("63eb19b9cf6123ebf3eee480");
const tokenUserOne = jwt.sign({ _id: userOneId }, process.env.SECRET_JWT_KEY);
const userOne = {
  _id: userOneId,
  username: "jay_maniya_5",
  firstName: "Parth",
  email: "parth15@gmail.com",
  gender: "male",
  password: "MyPass777!",
};

const userTwoId = new ObjectId("63eb19b9cf6123ebf3eee481");
const tokenUserTwo = jwt.sign({ _id: userTwoId }, process.env.SECRET_JWT_KEY);
const userTwo = {
  _id: userTwoId,
  username: "jay_maniya_6",
  firstName: "Parth",
  email: "parth16@gmail.com",
  gender: "male",
  password: "MyPass777!",
};

const userThreeId = new ObjectId("63eb19b9cf6123ebf3eee481");
const tokenUserThree = jwt.sign({ _id: userTwoId }, process.env.SECRET_JWT_KEY);
const userThree = {
  _id: userTwoId,
  username: "jay_maniya_7",
  firstName: "Parth",
  email: "parth17@gmail.com",
  gender: "male",
  password: "MyPass777!",
};

// --------- POST ---------
const postOneId = new ObjectId("63eb19b9cf6123ebf3eec410");
const postOne = {
  _id: postOneId,
  description: "Here we are #ready to go.. (postOne) #one #two #three #four",
  type: "text",
  privacy: "public",
};

const updatedPostOne = {
  description:
    "Here this is updated post one.. (Edited postOne) #one #two #three #four",
  type: "text",
  privacy: "public",
};

// post without imageLinks
const postTwoId = new ObjectId("63eb19b9cf6123ebf3eec411");
const postTwo = {
  _id: postTwoId,
  description: "Here we are #ready to go.. #one #two #three #four",
  type: "image",
  privacy: "public",
};

// --------- PAGE ---------
const pageOneId = new ObjectId("63eb19b9cf6123ebf3eec311");
const pageOne = {
  _id: pageOneId,
  pageName: "First Page",
  pageDesc: "This is my first page.",
};

const updatedPageOne = {
  pageName: "This is first page... (Edited)",
  pageDesc: "First Page.. (Edited postOne) #one #two #three #four",
};

const pageTwoId = new ObjectId("63eb19b9cf6123ebf3eec312");
const pageTwo = {
  _id: pageTwoId,
  pageName: "Second Page",
  pageDesc: "This is my second page.",
};

// --------- COMMENT ---------
const commentOneId = new ObjectId("63eb19b9cf6123ebf2eec310");
const commentOne = {
  _id: commentOneId,
  postId: postOneId,
  commentText: "This is good post",
};

const commentOneUpdate = {
  postId: postOneId,
  commentText: "This is good post. (Edited)",
};

const commentTwoId = new ObjectId("63eb19b9cf6123ebf2eec311");
const commentTwo = {
  _id: commentTwoId,
  postId: postOneId,
  commentText: "This is good post",
};

const commentThreeId = new ObjectId("63eb19b9cf6123ebf2eec312");
const commentThree = {
  _id: commentThreeId,
  postId: postOneId,
  parentId: commentOneId,
  commentText: "This is good post",
};

// --------- REACTION ---------
const postReactionOneId = new ObjectId("63eb19b9cf6123ebf1eec310");
const postReactionOne = {
  _id: postReactionOneId,
  type: "like",
  postId: postOneId,
};
const postReactionTwoId = new ObjectId("63eb19b9cf6123ebf1eec311");
const postReactionTwo = {
  _id: postReactionTwoId,
  type: "funny",
  postId: postTwoId,
};

const commentReactionOneId = new ObjectId("63eb19b9cf6124ebf1eec310");
const commentReactionOne = {
  _id: commentReactionOneId,
  type: "like",
  postId: postOneId,
  commentId: commentOneId,
};
const commentReactionTwoId = new ObjectId("63eb19b9cf6124ebf1eec311");
const commentReactionTwo = {
  _id: commentReactionTwoId,
  type: "funny",
  postId: postOneId,
  commentId: commentTwoId,
};

const unlikePostOne = {
  postId: postOneId,
};

const unlikeCommentOne = {
  postId: postOneId,
  commentId: commentOneId,
};

// --------- PERMISSION ---------
const permissionOneId = new ObjectId("63eb19b9cf5124ebf1eec310");
const permissionOne = {
  pageId: pageOneId,
  userId: userThreeId,
  role: ["content creator"],
  permissions: ["create", "delete"],
};

const removePermissionOneId = new ObjectId("63eb19b9cf5124ebf1eec310");
const removePermissionOne = {
  pageId: pageOneId,
  userId: userThreeId,
  role: "content creator",
  permission: "delete",
};

const userPermissionId = new ObjectId("63eb19b8cf5124ebf1eec310");
const userPermission = {
  _id: userPermissionId,
  pageId: pageOneId,
  description: "In this page, i have access",
  type: "text",
  privacy: "private",
};

const setupDatabase = async () => {
  // const db = await connect();
  // await db.dropDatabase();
  // await db.collection("Users").insertOne(userOne);
  // await db.collection("Users").insertOne(userTwo);
};

module.exports = {
  connect,
  setupDatabase,
  url,

  userOne,
  userOneId,
  tokenUserOne,
  userTwo,
  userTwoId,
  tokenUserTwo,
  userThree,
  userThreeId,
  tokenUserThree,

  postOne,
  updatedPostOne,
  postOneId,
  postTwo,
  postTwoId,

  commentOne,
  commentOneId,
  commentOneUpdate,
  commentTwo,
  commentTwoId,
  commentThree,
  commentThreeId,

  postReactionOneId,
  postReactionOne,
  postReactionTwoId,
  postReactionTwo,
  commentReactionOneId,
  commentReactionOne,
  commentReactionTwoId,
  commentReactionTwo,
  unlikePostOne,
  unlikeCommentOne,

  pageOne,
  pageOneId,
  updatedPageOne,
  pageTwo,
  pageTwoId,

  permissionOneId,
  permissionOne,

  userPermissionId,
  userPermission,

  removePermissionOneId,
  removePermissionOne,
};
