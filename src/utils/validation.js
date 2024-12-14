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
};

export default exportedMethods;
