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
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsCFwPvF25NroCaraLGyv0MqVbBPlDK_XX-Q&s"
);

const video = await videoData.addVideo(
    user._id.toString(),
    "My first video",
    "This is a short description",
    false,
    "./673a9b36c7dac94a4cef481a/media/673af1ff4faa2440d6a3be3d.mp4"
);




console.log("Done seeding database");
await closeConnection();
