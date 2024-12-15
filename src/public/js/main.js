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

            
            userEmail = checkEmail(userEmail)
            userPassword = checkPassword(userPassword)
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
  