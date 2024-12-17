import { collections, videos } from "../config/mongoCollections.js";
import validation from "../utils/validation.js";
import { bcryptConfig } from "../config/settings.js";
import bcrypt from "bcrypt";


const exportedMethods = {
  async getCollectionById(id) {
    id = validation.checkId(id, "ID");
    const collectionsCollection = await collections();
    const collection = await collectionsCollection.findOne({ _id: id });
    if (!collection) throw new Error("Collection not found");
    return collection;
  },
  async getCollectionsByOwner(ownerId) {
    ownerId = validation.checkId(ownerId, "Owner ID");

    const collectionCollection = await collections();
    return await collectionCollection.find({ owner_id: ownerId }).toArray();
  },
  async createCollection(
    userId,
    title,
    description
  ) {
    userId = validation.checkId(userId, "User ID");
    title = validation.checkString(title, "Title");
    description = validation.checkString(description, "Description");

    const collectionsCollection = await collections();
    const newCollection = {
      title: title,
      description: description,
      owner_id: userId,
      videos: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    const insertInfo = await collectionsCollection.insertOne(newCollection);
    if (insertInfo.insertedCount === 0) throw new Error("Could not add collection");
    const newId = insertInfo.insertedId;
    return await this.getCollectionById(newId.toString());
  }
};

export default exportedMethods;
