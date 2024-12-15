import e, { Router } from "express";
const router = Router();
import { users, videos } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import validation from "../utils/validation.js";
import userData from "../data/users.js"

const getUserByEmail = async (email) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) throw new Error("User not found");
  return user;
};

router.route("/").get(async (req, res) => {
  return res.redirect("/intro");
});

router.route("/intro").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    res.redirect("/homepage");
  } else {
    return res.render("intro", {
      title: "Sign Up",
      layout: "sign_up_layout", // added
    });
  }
});

router
  .route("/signup")
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      res.redirect("/homepage");
    } else {
      res.render("sign_up", {
        layout: "sign_up_layout", // added
      });
    }
  })
  .post(async (req, res) => {
    console.log("here1")
    let user = req.body
    try {
      user.firstName = validation.checkName(user.firstName);
      user.lastName = validation.checkName(user.lastName);
      user.userId = validation.checkUserId(user.userId);
      user.userId = user.userId.toLowerCase()
      user.password = validation.checkPassword(user.password);
      console.log(user.enterEmail)
      user.enterEmail = validation.checkEmail(user.enterEmail)
      user.confirmPassword = validation.checkPassword(user.confirmPassword);
      if (user.password !== user.confirmPassword) throw new Error('Error: Passwords do not match');
    
    } catch (e) {
      console.log(e)
      return res.status(400).render('sign_up', {title: "signupuser"});
    }
    
    try {
      user.age = 18
      user.profilePicture = "N/A"
      console.log("creating user...")
      const {registrationCompleted} = await userData.signUpUser(user.firstName, user.lastName, user.enterEmail, user.userId, user.password, user.age, user.profilePicture);
      if (registrationCompleted) {
        return res.redirect('/intro');
      }
    } catch (e) {
      console.log(e)
      return res.status(400).render('signupuser', {title: "signupuser"});
    }
    
    return res.status(500).render('signupuser', {title: "signupuser"});
    
  });


router
  .route("/auth/logout")
  .post(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      req.session.destroy();
    }
    return res.redirect("/intro");
  })
  .get(async (req, res) => {
    return res.redirect("/intro");
  });

  

router.route("/auth/login").post(async (req, res) => {
  let user = req.body
  if (!user.email || !user.password) {
    return res.status(400).render('intro', {title: "signinuser"});
  }

  try {
    user.email = validation.email(user.email);
    user.userId = user.userId.toLowerCase();
    user.password = validation.checkPassword(user.password);
  } catch (e) {
    return res.status(400).render('intro', {title: "signinuser"});
  }
  try {
    req.session.user = await userData.signInUser(user.userId, user.password);
    
    res.redirect("/homepage");
    
  } catch (e) {
    return res.status(401).redirect("/intro");
  }
});

router.route("/homepage").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    const v = {}; //await videos.getVideoByOwner( req.session.AuthenticationState.user._id)
    res.render("homepage", {
      layout: "main", // added
      user: req.session.AuthenticationState.user,
    });
  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/profile").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    res.render("profile", {
      layout: "main", // added
      user: req.session.AuthenticationState.user,
    });
  } else {
    return res.status(401).redirect("/intro");
  }
});

router
  .route("/settings")
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      return res.render("settings", {
        layout: "main", // added
        user: req.session.AuthenticationState.user,
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  })
  .post(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      users.updateUserPatch(req.session.AuthenticationState.user._id, req.body);
      res.render("settings", {
        layout: "main", // added
        user: req.session.AuthenticationState.user,
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  });

export default router;