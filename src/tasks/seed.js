// Seeds the mongodb database with some initial data
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {userData, videoData, commentsData} from "../data/index.js";

console.log("Seeding database");

//Create the database
const db = await dbConnection();
await db.dropDatabase();

const user = await userData.createUser(
    "Alice",
    "Zaytseva",
    "alice@mail.com",
    "alice",
    "Test123$",
    15,
    "https://www.google.com");




console.log("Done seeding database");
await closeConnection();
