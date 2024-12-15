// Seeds the mongodb database with some initial data
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {userData, videoData, commentsData} from "../data/index.js";

console.log("Seeding database");

//Create the database
const db = await dbConnection();
await db.dropDatabase();

const user1 = await userData.createUser(
    "Alice",
    "Zaytseva",
    "alice@mail.com",
    "alice",
    "Test123$",
    15,
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsCFwPvF25NroCaraLGyv0MqVbBPlDK_XX-Q&s"
);

const video1 = await videoData.addVideo(
    user1._id.toString(),
    "My first video",
    "This is a short description",
    false,
    "./673a9b36c7dac94a4cef481a/media/673af1ff4faa2440d6a3be3d.mp4"
);

const user2 = await userData.createUser(
    "Bob",
    "Zaytseva",
    "bob@mail.com",
    "bob",
    "Test123$",
    15,
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsCFwPvF25NroCaraLGyv0MqVbBPlDK_XX-Q&s"
);

const video2 = await videoData.addVideo(
    user2._id.toString(),
    "My second video",
    "This is a short description",
    false,
    "./673a9b36c7dac94a4cef481a/media/673af1ff4faa2440d6a3be3d.mp4"
);

const user3 = await userData.createUser(
    "John",
    "Smith",
    "jsmith@example.com",
    "jsmith",
    "Test123$",
    15,
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsCFwPvF25NroCaraLGyv0MqVbBPlDK_XX-Q&s"
);

const video3 = await videoData.addVideo(
    user3._id.toString(),
    "My third video",
    "This is a short description",
    false,
    "./673a9b36c7dac94a4cef481a/media/673af1ff4faa2440d6a3be3d.mp4"
);


console.log("Done seeding database");
await closeConnection();
