// let firstName = document.getElementById('firstName');
// let lastName = document.getElementById('lastName');
// let userId = document.getElementById('userId');
// let confirmPassword = document.getElementById('confirmPassword');
// let favoriteQuote = document.getElementById('favoriteQuote');
// let fontColor = document.getElementById('fontColor');
// let backgroundColor = document.getElementById('backgroundColor');
// let role = document.getElementById('role');

// (function(){

//     const validateString = (strVal, varName) =>{
//         console.log(strVal)
//         if (!strVal) throw `Error: You must supply a ${varName}!`;
//         if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
//         strVal = strVal.trim();
//         if (strVal.length === 0)
//             throw `Error: ${varName} cannot be an empty string or string with just spaces`;
//         if (!isNaN(strVal))
//             throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
//         return strVal;
//     }
//     const checkName = (name) =>{
//         name = validateString(name)
//         if(name.length > 25 || name.length < 2){
//             throw "name must be between 2 - 25 characters"
//         }
//         const regex = /\d/;
//         if(regex.test(name)){
//             throw "name cannot contain numbers"
//         }
//         return name
//     }

//     const checkUserId = (userId) => {
//         userId = validateString(userId)
//         if(userId.length > 10 || userId.length < 5){
//             throw "UserID must be between 5 - 10 characters"
//         }
//         return userId
//     }

//     function checkEmail(email) {
//         email = validateString(email, "email")
//         const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//         if(!regex.test(email)){
//             throw "email must be a valid email of the form: example@domain.com"
//         }
//         return email;
//     }
//     const checkPassword = (password) => {
//         console.log("in password check")
//         password = validateString(password)
//         if(password.length < 8){
//             throw "Password must be at least 8 characters long"
//         }
//         let regex1 = /[A-Z]/
//         let regex2 = /[^A-Za-z0-9]/
//         let regex3 = /\d/
//         if(!regex1.test(password)){
//             throw "Password must have at least 1 Uppercase letter"
//         }
//         if(!regex2.test(password)){
//             throw "Password must contain at least 1 special character"
//         }
//         if(!regex3.test(password)){
//             throw "Password must have at least 1 number"
//         }
//         return password
        
//     }
//     console.log("javascript")

//     let errorDiv = document.getElementById('error-div');


//     let firstName = document.getElementById('firstName');
//     let lastName = document.getElementById('lastName');
//     let userId = document.getElementById('userId');
//     let enterEmail = document.getElementById('enterEmail');
//     let password = document.getElementById('password');
//     let confirmPassword = document.getElementById('confirmPassword');

//     let rememberMe = document.getElementById('remember-me');
//     let email = document.getElementById('email');

//     let search_container = document.getElementById('search-container')
//     let header = document.getElementById('header-actions')

//     let signUpForm = document.getElementById('signup-form');
//     let loginForm = document.getElementById('login-form');


//     if (signUpForm) {
//         let errors = [];
//         //errorDiv.hidden = true;
//         //errorDiv.innerHTML = '';
//         signUpForm.addEventListener('submit', (event) => {
//             event.preventDefault();
        
//             errors = [];
//             errorDiv.classList.add('hidden');
//             errorDiv.innerHTML = '';
//             try {
//                 firstName.value = checkName(firstName.value);
//             } catch (e) {
//                 errors.push(e);
//             }
//             try {
//                 lastName.value = checkName(lastName.value);
//             } catch (e) {
//                 errors.push(e);
//             }
//             try {
//                 userId.value = checkUserId(userId.value);
//                 console.log(userId.value)
//                 userId.value = userId.value.toLowerCase();
//             } catch (e) {
//                 errors.push(e);
//             }
//             try {
//                 password.value = checkPassword(password.value);
//             } catch (e) {
//                 errors.push(e);
//             }
//             try {
//                 confirmPassword.value = checkPassword(confirmPassword.value);
//             } catch (e) {
//                 errors.push(e);
//             }
//             if (password.value !== confirmPassword.value) {
//                 errors.push('Error: Password and Confirm Password must match');
//             }
//             if(errors.length > 0) {
//                 event.preventDefault()
//                 let myUL = document.createElement('ul');
//                 for (let i = 0; i < errors.length; i++) {
//                     let myLi = document.createElement('li');
//                     myLi.classList.add('error');
//                     myLi.innerHTML = errors[i];
//                     myUL.appendChild(myLi);
//                 }
//                 errorDiv.appendChild(myUL);
//                 errorDiv.classList.remove('hidden');
//                 errorDiv.hidden = false
//             }
//         });
//     }

//     if (loginForm) {
//         let errors = [];
//         console.log("login form")

//         //errorDiv.hidden = true;
//         //errorDiv.innerHTML = '';

//         loginForm.addEventListener('submit', (event) => {
//             console.log("event listener")

//             errors = [];
//             errorDiv.classList.add('hidden');
//             errorDiv.innerHTML = '';
//             try {
//                 console.log("in email try")
//                 email.value = checkEmail(email.value);
//                 email.value = email.value.toLowerCase();
//             } catch (e) {
//                 console.log("Error found")
//                 errors.push(e);
//             }
//             try {
//                 console.log("in password try")

//                 password.value = checkPassword(password.value);
//             } catch (e) {
//                 console.log("error found")
//                 errors.push(e);
//             }
//             if(errors.length > 0) {

//                 event.preventDefault()
//                 let myUL = document.createElement('ul');
//                 for (let i = 0; i < errors.length; i++) {
//                     let myLi = document.createElement('li');
//                     myLi.classList.add('error');
//                     myLi.innerHTML = errors[i];
//                     myUL.appendChild(myLi);
//                 }
//                 errorDiv.appendChild(myUL);
//                 errorDiv.classList.remove('hidden');
//                 errorDiv.hidden = false
//             }
//         });
//     }
// })




(function () {
    function validateDate(dateValue, responseType = "string", dateFormat = null) {
        // Validate input parameters
        if (typeof dateValue !== "string") {
          throw new Error("dateValue must be a string.");
        }
      
        if (typeof responseType !== "string" || !["string", "boolean"].includes(responseType)) {
          throw new Error("responseType must be 'string' or 'boolean'.");
        }
      
        if (dateFormat !== null && typeof dateFormat !== "string") {
          throw new Error("dateFormat must be a string.");
        }
      
        // Throw an exception for empty dateValue
        if (dateValue.trim() === "") {
          throw new Error("dateValue cannot be empty.");
        }
      
        let responses = responseSetter(responseType);
      
        return dateValidator(dateValue, responses, dateFormat);
      }
      
      // TODO- This function returns different response types(String or boolean) which might be an anti pattern. Investigate and make necessary changes
      function responseSetter(responseType) {
        switch (responseType) {
          case "string":
            return ["Invalid Format", "Invalid Date", "Valid Date"];
          case "boolean":
            return [false, false, true];
      
          default:
            return ["Invalid Format", "Invalid Date", "Valid Date"];
        }
      }
      
      function daysInMonth(year, month) {
        const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
        return (month === 2 && year % 4 === 0) ? 29 : days[month - 1];
      }
      
      function getAllIndexes(arr, val) {
        var indexes = [];
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === val) indexes.push(i);
        }
      
        return indexes;
      }
      
      function isLeapYear(year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) && year >= 1753;
      }
      
      function dateValidator(dateValue, responses, dateFormat) {
        if (dateValue) {
          if (!dateFormat) {
            dateFormat = dateValue.includes("-") ? "yyyy-mm-dd" : "mm/dd/yyyy";
          }
      
          const dateSeparator = /[^dmy]/i.exec(dateFormat)[0]; // Extract the separator character
      
          if (!dateValue.includes(dateSeparator)) {
            return responses[0];
          }
      
          if (dateFormat.length > 10 || dateFormat.length < 6) return responses[0];
      
          const formatSplit = dateValue.includes("-") ? dateFormat.split("-") : dateFormat.split("/");
          let wrongFormat = formatSplit
            .map((formatPart) => /([dmy])\1/i.test(formatPart))
            .filter((rightFormat) => !rightFormat);
      
          if (wrongFormat.length > 0) return responses[0];
      
          // let dateSeparator = dateValue.includes("-") ? "-" : "/";
      
          let formatRegex = new RegExp(
            `(\\d{${formatSplit[0].length}})(${dateSeparator})(\\d{${formatSplit[1].length}})(${dateSeparator})(\\d{${formatSplit[2].length}})`
          );
      
          let dayPosition = getAllIndexes(
            formatSplit,
            formatSplit.filter((formatPart) => /[d]/i.test(formatPart))[0]
          );
          let monthPosition = getAllIndexes(
            formatSplit,
            formatSplit.filter((formatPart) => /[m]/i.test(formatPart))[0]
          );
          let yearPosition = getAllIndexes(
            formatSplit,
            formatSplit.filter((formatPart) => /[y]/i.test(formatPart))[0]
          );
      
          if (dayPosition.length !== 1 || monthPosition.length !== 1 || yearPosition.length !== 1) {
            return responses[0];
          }
      
          if (formatRegex.test(dateValue)) {
            const dateSplit = dateValue.split(dateSeparator);
            const day = Number(dateSplit[dayPosition]);
            const month = Number(dateSplit[monthPosition]);
            const year = Number(dateSplit[yearPosition]);
      
            // Check for invalid dates
            if (
              month <= 0 ||
              month > 12 ||
              day <= 0 ||
              day > daysInMonth(year, month) ||
              year < 1753 ||
              (month === 2 && day === 29 && !isLeapYear(year))
            ) {
              return responses[1];
            }
          } else {
            return responses[0];
          }
        }
      
        return responses[2];
      }
    validateString = (strVal, varName) =>{
        console.log(strVal)
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
            throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
    }
    checkDOB = (dob) => {
        let validDate = validateDate(dob);
        let currentDate = new Date()
        let dobDate = new Date(dob)
        console.log(dobDate)

        let currentYear = currentDate.getFullYear()
        let currentMonth = currentDate.getMonth() + 1
        let currentDay = currentDate.getDate()
        let dobSplit = dob.split("/")
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
    checkName = (name) =>{
        name = validateString(name)
        if(name.length > 25 || name.length < 2){
            throw "name must be between 2 - 25 characters"
        }
        const regex = /\d/;
        if(regex.test(name)){
            throw "name cannot contain numbers"
        }
        return name
    }

    checkUserId = (userId) => {
        userId = validateString(userId)
        if(userId.length > 10 || userId.length < 5){
            throw "UserID must be between 5 - 10 characters"
        }
        return userId
    }

    checkEmail = (email) => {
        email = validateString(email, "email")
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!regex.test(email)){
            throw "email must be a valid email of the form: example@domain.com"
        }
        return email;
    }
    checkPassword = (password) => {
        console.log("in password check")
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
    
    let signUpForm = document.getElementById('signup-form');
    let loginForm = document.getElementById('login-form');
  
    if (loginForm) {
      // We can store references to our elements; it's better to
      // store them once rather than re-query the DOM traversal each time
      // that the event runs.
      let email = document.getElementById('email');
      let password = document.getElementById('password');
  
      let errorDiv = document.getElementById('error-div');
      let errorTextElement = errorDiv.getElementsByClassName('text-goes-here')[0];
  
  
      // We can take advantage of functional scoping; our event listener has access to its outer functional scope
      // This means that these variables are accessible in our callback
      loginForm.addEventListener('submit', (event) => {
  
        try {
          // hide containers by default
          errorDiv.classList.add('hidden');
  
          // Values come from inputs as strings, no matter what :(
          let userEmail = email.value;
          let userPassword = password.value;
          
          userEmail = checkEmail(userEmail)
          userPassword = checkPassword(userPassword)
  
        } catch (e) {
          //const message = typeof e === 'string' ? e : e.message;
          event.preventDefault();

          errorTextElement.textContent = e;
          errorDiv.classList.remove('hidden');
        }
      });
    }
    if (signUpForm) {
        console.log("im here")
        // We can store references to our elements; it's better to
        // store them once rather than re-query the DOM traversal each time
        // that the event runs.
        let firstName = document.getElementById('firstName');
        let lastName = document.getElementById('lastName');
        let userId = document.getElementById('userId');
        let enterEmail = document.getElementById('enterEmail');
        let password = document.getElementById('password');
        let confirmPassword = document.getElementById('confirmPassword');
        let dob = document.getElementById('dob')
        
        let errorDiv = document.getElementById('error-div');
        let errorTextElement = errorDiv.getElementsByClassName('text-goes-here')[0];
    
        
        // We can take advantage of functional scoping; our event listener has access to its outer functional scope
        // This means that these variables are accessible in our callback
        signUpForm.addEventListener('submit', (event) => {
    
          try {
            // hide containers by default
            errorDiv.classList.add('hidden');
    
            // Values come from inputs as strings, no matter what :(
            let userEmail = enterEmail.value;
            let userPassword = password.value;
            let name1 = firstName.value
            let name2 = lastName.value
            let id = userId.value
            let confirm = confirmPassword.value
            let date_of_birth = dob.value

            
            userEmail = checkEmail(userEmail)
            userPassword = checkPassword(userPassword)
            date_of_birth = checkDOB(date_of_birth)
            confirm = checkPassword(confirm)
            if (confirm !== userPassword) {
                throw 'Error: Password and Confirm Password must match';
            }
            name1 = checkName(name1)
            name2 = checkName(name2)
            id = checkUserId(id)
          } catch (e) {
            //const message = typeof e === 'string' ? e : e.message;
            event.preventDefault();

            errorTextElement.textContent = e;
            errorDiv.classList.remove('hidden');
          }
        });
      }
  })();
  
