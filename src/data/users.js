import { users } from "../config/mongoCollections.js";
import validation from "../utils/validation.js";
import { bcryptConfig } from "../config/settings.js";
import bcrypt from "bcrypt";

const exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    return await userCollection.find({}).toArray();
  },
  async getUserById(id) {
    id = validation.checkId(id, "ID");
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });
    if (!user) throw new Error("User not found");
    return user;
  },
  async createUser(
    firstName,
    lastName,
    email,
    username,
    password,
    age,
    profilePicture,
  ) {
    firstName = validation.checkString(firstName, "First Name");
    lastName = validation.checkString(lastName, "Last Name");
    email = validation.checkEmail(email, "Email");
    username = validation.checkString(username, "Username");
    password = validation.checkString(password, "Password");
    age = validation.checkNumber(age, "Age", {
      onlyInt: true,
      min: 0,
      max: 120,
    });
    profilePicture = validation.checkString(profilePicture, "Profile Picture");

    password = await bcrypt.hash(password, bcryptConfig.saltRounds);

    const userCollection = await users();
    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: username,
      password_hash: password,
      visibility: {
        email_public: false,
        name_public: true,
        profile_public: true,
      },
      age: age,
      profile_picture: profilePicture,
      created_at: new Date(),
      modified_at: new Date(),
    };
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw new Error("Could not add user");
    const newId = insertInfo.insertedId;
    return await this.getUserById(newId.toString());
  },
  async updateUserPatch(id, updatedUser) {
    id = validation.checkId(id, "ID");

    const userCollection = await users();
    const updatedUserData = {};
    if (updatedUser.firstName) {
      updatedUserData.first_name = validation.checkString(
        updatedUser.firstName,
        "First Name",
      );
    }
    if (updatedUser.last_name) {
      updatedUserData.last_name = validation.checkString(
        updatedUser.lastName,
        "Last Name",
      );
    }
    if (updatedUser.email) {
      updatedUserData.email = validation.checkEmail(updatedUser.email, "Email");
    }
    if (updatedUser.username) {
      updatedUserData.username = validation.checkString(
        updatedUser.username,
        "Username",
      );
    }
    if (updatedUser.password) {
      updatedUserData.password = validation.checkString(
        updatedUser.password,
        "Password",
      );
    }
    if (updatedUser.age) {
      updatedUserData.age = validation.checkNumber(updatedUser.age, "Age", {
        onlyInt: true,
        min: 0,
        max: 120,
      });
    }
    if (updatedUser.profilePicture) {
      updatedUserData.profilePicture = validation.checkString(
        updatedUser.profilePicture,
        "Profile Picture",
      );
    }
    updatedUserData.modified_at = new Date();
    const newUser = await userCollection.findOneAndUpdate(
      { _id: id },
      { $set: updatedUserData },
      { returnDocument: "after", includeResultMetadata: true },
    );
    if (newUser.lastErrorObject.n === 0) {
      throw new Error(
        `Error: Update failed! Could not update user with id ${id}`,
      );
    }
    return await this.getUserById(id.toString());
  },
  async removeUser(id) {
    id = validation.checkId(id, "ID");
    const userCollection = await users();
    const deletionInfo = await userCollection.deleteOne({ _id: id });
    if (deletionInfo.deletedCount === 0)
      throw new Error(`Could not delete user with id of ${id}`);
    return { userId: id, deleted: true };
  },
  async updateUserVisibilityPatch(id, updatedVisibility) {
    id = validation.checkId(id, "ID");
    const userCollection = await users();
    const updatedUserData = {};
    if (updatedVisibility.emailPublic) {
      updatedUserData.visibility.email_public = validation.checkBoolean(
        updatedVisibility.emailPublic,
        "Email Public",
      );
    }
    if (updatedVisibility.namePublic) {
      updatedUserData.visibility.name_public = validation.checkBoolean(
        updatedVisibility.namePublic,
        "Name Public",
      );
    }
    if (updatedVisibility.profilePublic) {
      updatedUserData.visibility.profile_public = validation.checkBoolean(
        updatedVisibility.profilePublic,
        "Profile Public",
      );
    }
    updatedUserData.modified_at = new Date();
    const newUser = await userCollection.findOneAndUpdate(
      { _id: id },
      { $set: updatedUserData },
      { returnDocument: "after", includeResultMetadata: true },
    );
    if (newUser.lastErrorObject.n === 0) {
      throw new Error(
        `Error: Update failed! Could not update user with id ${id}`,
      );
    }
    return await this.getUserById(id.toString());
  },
};

export default exportedMethods;
