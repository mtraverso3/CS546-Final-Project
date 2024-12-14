// let firstName = document.getElementById('firstName');
// let confirmPassword = document.getElementById('confirmPassword');
// let favoriteQuote = document.getElementById('favoriteQuote');
// let fontColor = document.getElementById('fontColor');
// let backgroundColor = document.getElementById('backgroundColor');
// let role = document.getElementById('role');

const validateString = (strVal, varName) =>{
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

function checkEmail(email) {
    email = validateString(email, "email")
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
}

let errorDiv = document.getElementById('error-div');
errorDiv.hidden = true;
errorDiv.innerHTML = '';

let rememberMe = document.getElementById('remember-me');
let email = document.getElementById('email');
let password = document.getElementById('password');

let search_container = document.getElementById('search-container')
let header = document.getElementById('header-actions')

let signUpForm = document.getElementById('signup-form');
let loginForm = document.getElementById('login-form');


// if (signUpForm) {
//     let errors = [];
//     signUpForm.addEventListener('submit', (event) => {
//         event.preventDefault();
    
//     errors = [];
//     errorDiv.classList.add('hidden');
//     errorDiv.innerHTML = '';
//     console.log("listening")
//     try {
//         firstName.value = checkName(firstName.value);
//     } catch (e) {
//         errors.push(e.message);
//     }
//     try {
//         lastName.value = checkName(lastName.value);
//     } catch (e) {
//         errors.push(e.message);
//     }
//     try {
//         userId.value = checkUserId(userId.value);
//         userId.value = userId.value.toLowerCase();
//     } catch (e) {
//         errors.push(e.message);
//     }
//     try {
//         password.value = checkPassword(password.value);
//     } catch (e) {
//         errors.push(e.message);
//     }
//     try {
//         confirmPassword.value = checkPassword(confirmPassword.value);
//     } catch (e) {
//         errors.push(e.message);
//     }
//     if (password.value !== confirmPassword.value) {
//         errors.push('Error: Password and Confirm Password must match');
//     }
//     try {
//         favoriteQuote.value = checkFavQuote(favoriteQuote.value);
//     } catch (e) {
//         errors.push(e.message);
//     }
//     const theme = {backgroundColor: backgroundColor.value, fontColor: fontColor.value}
//     try {
//         let themePreference = checkThemePref(theme);
//         backgroundColor.value = themePreference.backgroundColor;
//         fontColor.value = themePreference.fontColor;
//     } catch (e) {
//         errors.push(e.message);
//     }
//     try {
//         role.value = checkString(role.value);
//         role.value = role.value.toLowerCase();
//         if (role.value !== 'admin' && role.value !== 'user'){
//             errors.push('Role must be either "admin" or "user"')
//         } 
//     } catch (e) {
//         errors.push(e.message);
//     }
//     if(errors.length > 0) {
//         console.log("test a")
//         event.preventDefault()
//         let myUL = document.createElement('ul');
//         for (let i = 0; i < errors.length; i++) {
//             let myLi = document.createElement('li');
//             myLi.classList.add('error-div');
//             myLi.innerHTML = errors[i];
//             myUL.appendChild(myLi);
//           }
//           errorDiv.appendChild(myUL);

//         errorDiv.classList.remove('hidden');
//     }
//     });
// }

if (loginForm) {
    let errors = [];

    signUpForm.addEventListener('submit', (event) => {
    errors = [];
    errorDiv.classList.add('hidden');
    errorDiv.innerHTML = '';
    try {
        email.value = checkEmail(email.value);
        email.value = email.value.toLowerCase();
    } catch (e) {
        errors.push(e.message);
    }
    try {
        password.value = checkPassword(password.value);
    } catch (e) {
        errors.push(e.message);
    }
    if(errors.length > 0) {
        console.log("hitting this")
        event.preventDefault()
        let myUL = document.createElement('ul');
        for (let i = 0; i < errors.length; i++) {
            let myLi = document.createElement('li');
            myLi.classList.add('error');
            myLi.innerHTML = errors[i];
            myUL.appendChild(myLi);
        }
        errorDiv.appendChild(myUL);
        errorDiv.classList.remove('hidden');
        errorDiv.hidden = false
    }
    });
}
