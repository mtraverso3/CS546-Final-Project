// Seeds the mongodb database with some initial data
import { dbConnection, closeConnection } from "../config/mongoConnection.js";

//Clear the database
const db = await dbConnection();
await db.dropDatabase();

console.log("Done seeding database");
await closeConnection();
