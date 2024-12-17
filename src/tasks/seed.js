// Seeds the mongodb database with some initial data
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

console.log("Seeding database");
//
// //Create the database
// const db = await dbConnection();
// await db.dropDatabase();
//
// // Passwords:
// // mtravers@stevens.edu: Test1234$mtravers
// // mpresbit@stevens.edu: Test1234$mpresbit
//
// const users = [
//   {
//     _id: new ObjectId("6760f7644d3dee1b02de318a"),
//     created_at: { $date: "2024-12-17T04:00:36.981Z" },
//     dob: "2002-01-01",
//     email: "mtravers@stevens.edu",
//     first_name: "Marcos",
//     last_name: "Traverso",
//     likedTags: [],
//     modified_at: { $date: "2024-12-17T04:00:36.981Z" },
//     password_hash:
//       "$2b$13$cLjlTlvSLmFiqSQjmUHjBuFjXWWIgaZibhXGdI3LeC0nTatQV7lLO",
//     username: "mtravers",
//     visibility: {
//       email_public: false,
//       name_public: true,
//       profile_public: true,
//     },
//   },
//   {
//     _id: new ObjectId("6760f90f4d3dee1b02de3192"),
//     created_at: { $date: "2024-12-17T04:07:43.405Z" },
//     dob: "2002-02-02",
//     email: "mpresbit@stevens.edu",
//     first_name: "Megan",
//     last_name: "Presbitero",
//     likedTags: [],
//     modified_at: { $date: "2024-12-17T04:07:43.405Z" },
//     password_hash:
//       "$2b$13$LjGWrupud5LFo4yG32PC8eJVU0siKtSzOyCfsk7bTNTSblKHE5xNy",
//     username: "mpresbit",
//     visibility: {
//       email_public: false,
//       name_public: true,
//       profile_public: true,
//     },
//   },
// ];
//
// const videos = [
//   {
//     _id: new ObjectId("6760f8244d3dee1b02de318b"),
//     created_at: { $date: "2024-12-17T04:03:48.199Z" },
//     description: "Our project pitch!",
//     dislike_count: 0,
//     like_count: 1,
//     owner_id: new ObjectId("6760f7644d3dee1b02de318a"),
//     private: true,
//     tags: [],
//     title: "Project Pitch",
//     view_count: 5,
//     whitelisted_users: [],
//   },
//   {
//     _id: new ObjectId("6760f8784d3dee1b02de318c"),
//     created_at: { $date: "2024-12-17T04:05:12.200Z" },
//     description: "haha",
//     dislike_count: 1,
//     like_count: 1,
//     owner_id: new ObjectId("6760f7644d3dee1b02de318a"),
//     private: false,
//     tags: [],
//     title: "Megan's proposal portion",
//     view_count: 5,
//     whitelisted_users: [],
//   },
//   {
//     _id: new ObjectId("6760f9814d3dee1b02de3193"),
//     created_at: { $date: "2024-12-17T04:09:37.659Z" },
//     description: "proposal segment (MT)",
//     dislike_count: 0,
//     like_count: 0,
//     owner_id: new ObjectId("6760f90f4d3dee1b02de3192"),
//     private: true,
//     tags: [],
//     title: "Marcos Proposal segment (secret haha)",
//     view_count: 0,
//     whitelisted_users: [],
//   },
// ];
//
// const comments = [
//   {
//     _id: new ObjectId("6760f8944d3dee1b02de318d"),
//     created_at: { $date: "2024-12-17T04:05:40.932Z" },
//     text: "haha",
//     user_id: new ObjectId("6760f7644d3dee1b02de318a"),
//     video_id: new ObjectId("6760f8244d3dee1b02de318b"),
//   },
//   {
//     _id: new ObjectId("6760f8984d3dee1b02de318e"),
//     created_at: { $date: "2024-12-17T04:05:44.897Z" },
//     text: "this is a comment",
//     user_id: new ObjectId("6760f7644d3dee1b02de318a"),
//     video_id: new ObjectId("6760f8244d3dee1b02de318b"),
//   },
//   {
//     _id: new ObjectId("6760f9aa4d3dee1b02de3194"),
//     created_at: { $date: "2024-12-17T04:10:18.464Z" },
//     text: "hey!!!",
//     user_id: new ObjectId("6760f90f4d3dee1b02de3192"),
//     video_id: new ObjectId("6760f8784d3dee1b02de318c"),
//   },
//   {
//     _id: new ObjectId("6760fa37f38796aee7ecccba"),
//     created_at: { $date: "2024-12-17T04:12:39.534Z" },
//     text: "hey?!",
//     user_id: new ObjectId("6760f7644d3dee1b02de318a"),
//     video_id: new ObjectId("6760f8784d3dee1b02de318c"),
//   },
// ];
//
// const likes = [
//   {
//     _id: new ObjectId("6760f89f4d3dee1b02de318f"),
//     user_id: new ObjectId("6760f7644d3dee1b02de318a"),
//     video_id: new ObjectId("6760f8244d3dee1b02de318b"),
//   },
//   {
//     _id: new ObjectId("6760f8a24d3dee1b02de3191"),
//     user_id: new ObjectId("6760f7644d3dee1b02de318a"),
//     video_id: new ObjectId("6760f8784d3dee1b02de318c"),
//   },
// ];
//
// const dislikes = [
//   {
//     _id: new ObjectId("6760f8a24d3dee1b02de3190"),
//     user_id: new ObjectId("6760f7644d3dee1b02de318a"),
//     video_id: new ObjectId("6760f8784d3dee1b02de318c"),
//   },
// ];
//
// await db.collection("users").insertMany(users);
// await db.collection("videos").insertMany(videos);
// await db.collection("comments").insertMany(comments);
// await db.collection("likes").insertMany(likes);
// await db.collection("dislikes").insertMany(dislikes);
//
//
// //we gotta copy the seed videos to the data folder
// const seedDataPath = path.resolve("src/tasks/seedData");
// const dataPath = path.resolve("./data");
//
// console.log("Copying seed data from", seedDataPath, "to", dataPath);
//
// if (fs.existsSync(dataPath)) {
//   fs.rmdirSync(dataPath, { recursive: true });
// }
//
// fs.mkdirSync(dataPath);
// fs.cpSync(seedDataPath, dataPath, { recursive: true });


console.log("Done seeding database");
await closeConnection();
