import { ObjectId } from "mongodb";
import EmailValidator from "email-validator";
import {validateDate} from "./validate-date.js"

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

  checkEmail(email) {
    email = this.checkString(email, "email")
    email = email.toLowerCase();
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(!regex.test(email)){
        throw new Error("Invalid email. Please enter an email in the format: john@example.com")
    }
    return email;
},
  checkUserId (userId) {
    userId = this.checkString(userId)
    if(userId.length > 10 || userId.length < 5){
        throw new Error("userId must be between 5 - 10 characters")
    }
    return userId
  },
  checkPassword(password) {
    password = this.checkString(password)
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
    
  },
  checkName(name){
    name = this.checkString(name)
    if(name.length > 25 || name.length < 2){
        throw "name must be between 2 - 25 characters"
    }
    const regex = /\d/;
    if(regex.test(name)){
        throw "name cannot contain numbers"
    }
    return name
  },
  checkDOB(dob){
    let validDate = validateDate(dob);
    let currentDate = new Date()
    let dobDate = new Date(dob)
    let currentYear = currentDate.getFullYear()
    let currentMonth = currentDate.getMonth() + 1
    let currentDay = currentDate.getDate()
    let dobSplit = dob.split("-")
    let dobYear = Number(dobSplit[2])
    let dobMonth = Number(dobSplit[0])
    let dobDay = Number(dobSplit[1])
    
    const diffInMilliseconds = currentDate.getTime() - dobDate.getTime();
    const ageInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

    const age = Math.floor(ageInYears);
    console.log(age)

    if(age < 13){
      throw "User must be at least 13 years in age"
    }
    else if(age > 120){
      throw "Woah there! Age must be within livible range and therefore less than 120 years old"
    }
    return dob
  }
};




export default exportedMethods;
