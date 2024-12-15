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

    password = await bcrypt.hash(password, bcryptConfig.saltRounds);

    const userCollection = await users();

    // Check if the email is already in use
    const emailCheck = await userCollection.findOne({ email: email });
    if (emailCheck) throw new Error("Email already in use");


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
  async signUpUser (
    firstName,
    lastName,
    email,
    username,
    password,
    age,
  ) {
    console.log("singing up user")
    let newUser = this.createUser(firstName, lastName, email, username, password, age)
    return {registrationCompleted: true}

  },

  async signInUserById (userId, password) {
    userId = validation.checkUserId(userId)
    userId = userId.toLowerCase()
    password = validation.checkPassword(password)
    const userCollection = await users();
    const user = await userCollection.findOne({userId: userId});
    if(user === null){
        throw new Error("Either the userId or password is invalid")
    }
    let hash = user.password_hash
    let matched = await bcrypt.compare(password, hash);
    if(!matched){
      throw new Error("Either the userId or password is invalid")
    }
    return {firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            age: user.age}
  },
  async signInUserByEmail (email, password) {
    email = validation.checkEmail(email)
    password = validation.checkPassword(password)
    const userCollection = await users();
    const user = await userCollection.findOne({email: email});
    if(user === null){
        throw new Error("Either the email or password is invalid")
    }
    let hash = user.password_hash
    let matched = await bcrypt.compare(password, hash);
    if(!matched){
      throw new Error("Either the email or password is invalid")
    }
    return {firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      username: user.username,
      age: user.age}
  },
};

export default exportedMethods;
