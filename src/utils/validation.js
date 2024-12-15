import { ObjectId } from "mongodb";
import EmailValidator from "email-validator";

const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw new Error(`Error: You must provide a ${varName}`);
    if (typeof id !== "string")
      throw new Error(`Error:${varName} must be a string`);
    id = id.trim();
    if (id.length === 0)
      throw new Error(
        `Error: ${varName} cannot be an empty string or just spaces`,
      );
    if (!ObjectId.isValid(id))
      throw new Error(`Error: ${varName} invalid object ID`);
    return new ObjectId(id);
  },

  checkString(strVal, varName) {
    if (!strVal) throw new Error(`Error: You must supply a ${varName}!`);
    if (typeof strVal !== "string")
      throw new Error(`Error: ${varName} must be a string!`);
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw new Error(
        `Error: ${varName} cannot be an empty string or string with just spaces`,
      );
    if (!isNaN(strVal))
      throw new Error(
        `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`,
      );
    return strVal;
  },

  checkNumber(val, varName, options = {}) {
    options = {
      onlyInt: false,
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER,
      ...options,
    };

    if (typeof val !== "number") throw new Error(`${varName} is not a number`);

    if (isNaN(val)) {
      throw new Error(`${varName} is NaN`);
    }

    if (options.onlyInt && !Number.isInteger(val)) {
      throw new Error(`${varName} is not an integer`);
    }

    if (val < options.min) {
      throw new Error(
        `${varName} is less than the minimum value of ${options.min}`,
      );
    }

    if (val > options.max) {
      throw new Error(
        `${varName} is greater than the maximum value of ${options.max}`,
      );
    }

    return val;
  },
  checkBoolean(val, varName) {
    if (typeof val !== "boolean") {
      throw new Error(`${varName} is not a boolean`);
    }
    return val;
  },

  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw new Error(`You must provide an array of ${varName}`);
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw new Error(
          `One or more elements in ${varName} array is not a string or is an empty string`,
        );
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  checkEmail(email, varName) {
    this.checkString(email, varName);

    if (!EmailValidator.validate(email)) {
      throw new Error(`Error: ${varName} is not a valid email address`);
    }

    return email;
  },
  checkUserId (userId) {
    userId = validateString(userId)
    if(userId.length > 10 || userId.length < 5){
        throw "UserID must be between 5 - 10 characters"
    }
    return userId
  },
  checkPassword(password) {
    password = validateString(password)
    if(password.length < 8){
        throw "Password must be at least 8 characters long"
    }
    let regex1 = /[A-Z]/
    let regex2 = /[^A-Za-z0-9]/
    let regex3 = /\d/
    if(!regex1.test(password)){
        throw "Password must have at least 1 Uppercase letter"
    }
    if(!regex2.test(password)){
        throw "Password must contain at least 1 special character"
    }
    if(!regex3.test(password)){
        throw "Password must have at least 1 number"
    }
    return password
    
  }
};



export default exportedMethods;
