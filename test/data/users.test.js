import { jest } from "@jest/globals";
import { MongoClient, ObjectId } from "mongodb";

// Mock the module
jest.unstable_mockModule("../../src/config/mongoConnection.js", () => ({
  dbConnection: jest.fn(),
  closeConnection: jest.fn(),
}));

// Import the mocked functions
const { dbConnection, closeConnection } = await import(
  "../../src/config/mongoConnection.js"
);
const { userData } = await import("../../src/data/index.js");
const { users } = await import("../../src/config/mongoCollections.js");

// Begin test cases below

const johnSmithExpected = {
  first_name: "John",
  last_name: "Smith",
  email: "jsmith@example.com",
  username: "jsmith",
  visibility: {
    email_public: false,
    name_public: true,
    profile_public: true,
  },
  age: 25,
  profile_picture: "base64string3",
};

describe("users", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {});
    db = connection.db();

    dbConnection.mockResolvedValue(db); // mock the connection with the jest-mongodb database
    closeConnection.mockResolvedValue(() => {
      connection.close();
    }); // mock the close connection
  });

  beforeEach(async () => {
    await db.dropDatabase();
    const usersCollection = await users();
    const result = await usersCollection.insertMany([
      {
        first_name: "John",
        last_name: "Smith",
        email: "jsmith@example.com",
        username: "jsmith",
        password_hash: "johnpass",
        visibility: {
          email_public: false,
          name_public: true,
          profile_public: true,
        },
        age: 25,
        profile_picture: "base64string3",
        created_at: new Date(),
        modified_at: new Date(),
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        email: "jdoe@example.com",
        username: "jdoe",
        password_hash: "janepass",
        visibility: {
          email_public: false,
          name_public: true,
          profile_public: true,
        },
        age: 30,
        profile_picture: "base64string4",
        created_at: new Date(),
        modified_at: new Date(),
      },
    ]);
    if (result.insertedCount !== 2) {
      throw new Error("Failed to seed database");
    }
  });

  afterAll(async () => {
    await connection.close();
    jest.clearAllMocks(); // Clear any mocks
  });

  describe("getAllUsers", () => {
    it("getAllUsers", async () => {
      const users = await userData.getAllUsers();
      expect(users).toEqual([
        expect.objectContaining({ first_name: "John", last_name: "Smith" }),
        expect.objectContaining({ first_name: "Jane", last_name: "Doe" }),
      ]);
    });

    it("getAllUsers empty", async () => {
      await db.dropDatabase();
      const users = await userData.getAllUsers();
      expect(users).toEqual([]);
    });
  });

  describe("getUserById", () => {
    it("basic getUserById", async () => {
      const usersCollection = await users();
      const insertedUser = await usersCollection.findOne({
        username: "jsmith",
      });
      const result = await userData.getUserById(insertedUser._id.toString());
      expect(result).toEqual(expect.objectContaining(johnSmithExpected));
    });

    it("getUserById with invalid id", async () => {
      expect(userData.getUserById("invalid")).rejects.toThrow();
      expect(userData.getUserById(new ObjectId().toString())).rejects.toThrow();
    });
  });

  describe("createUser", () => {
    it("basic createUser", async () => {
      const result = await userData.createUser(
        "Alice",
        "Smith",
        "asmith@example.com",
        "asmith",
        "alicepass",
        25,
        "base64string3",
      );
      expect(result).toHaveProperty("_id");

      const usersCollection = await users();
      const insertedUser = await usersCollection.findOne({
        username: "asmith",
      });
      expect(insertedUser).toEqual(
        expect.objectContaining({
          first_name: "Alice",
          last_name: "Smith",
          email: "asmith@example.com",
          username: "asmith",
          visibility: {
            email_public: false,
            name_public: true,
            profile_public: true,
          },
          age: 25,
          profile_picture: "base64string3",
        }),
      );
    });

    it("createUser with invalid data", async () => {
      await expect(userData.createUser()).rejects.toThrow();
      await expect(
        userData.createUser(
          "Alice",
          "Smith",
          "bademail",
          "asmith",
          "alicepass",
          25,
          "base64string3",
        ),
      ).rejects.toThrow();
    });
  });

  describe("removeUser", () => {
    it("basic removeUser", async () => {
      const usersCollection = await users();
      const insertedUser = await usersCollection.findOne({
        username: "jsmith",
      });
      const result = await userData.removeUser(insertedUser._id.toString());
      expect(result).toEqual({ userId: insertedUser._id, deleted: true });

      const allUsers = await userData.getAllUsers();
      expect(allUsers).toEqual([
        expect.objectContaining({ first_name: "Jane", last_name: "Doe" }),
      ]);
    });
  });
});
