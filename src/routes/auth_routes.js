import { Router } from "express";

const router = Router();
import validation from "../utils/validation.js";
import userData from "../data/users.js";
import xss from 'xss';

router.route("/").get(async (req, res) => {
  return res.redirect("/intro");
});

router
  .route("/intro")
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      res.redirect("/homepage");
    } else {
      return res.render("intro", {
        title: "Sign Up",
        layout: "sign_up_layout",
      });
    }
  })
  .post(async (req, res) => {
    let user = xss(req.body);
    if (!user.email || !user.password) {
      return res.status(400).render("intro", {
        title: "Sign Up",
        layout: "sign_up_layout",
        error: "email and password must be supplied"
      });
    }

    try {
      user.email = validation.checkEmail(user.email);
      user.password = validation.checkPassword(user.password);
    } catch (e) {
      return res.status(400).render("intro", {
        title: "Sign Up",
        layout: "sign_up_layout",
        error: e.message,
      });
    }
    try {
      req.session.user = await userData.signInUserByEmail(
        user.email,
        user.password,
      );
      req.session.AuthenticationState = { user: req.session.user };

      res.redirect("/homepage");
    } catch (e) {
      return res.status(401).render("intro", {
        title: "Sign Up",
        layout: "sign_up_layout",
        error: e.message,
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
    let user = xss(req.body)
    try {
      user.firstName = validation.checkName(user.firstName);
      user.lastName = validation.checkName(user.lastName);
      user.userId = validation.checkUserId(user.userId);
      user.userId = user.userId.toLowerCase();
      user.password = validation.checkPassword(user.password);
      console.log(user.enterEmail);
      user.enterEmail = validation.checkEmail(user.enterEmail);
      user.confirmPassword = validation.checkPassword(user.confirmPassword);
      console.log(user.dob)
      user.dob = validation.checkDOB(user.dob)
      console.log(user.dob)
      if (user.password !== user.confirmPassword)
        throw new Error("Error: Passwords do not match");
    } catch (e) {
      console.log(e);
      return res.status(400).render("sign_up", {
        layout: "sign_up_layout", // added
      });
    }

    try {
      console.log("creating user...");
      const { registrationCompleted } = await userData.signUpUser(
        user.firstName,
        user.lastName,
        user.enterEmail,
        user.userId,
        user.password,
        user.dob,
      );
      if (registrationCompleted) {
        return res.redirect("/intro");
      }
    } catch (e) {
      console.log(e);
      return res.status(400).render("signupuser", { title: "signupuser" });
    }

    return res.status(500).render("signupuser", { title: "signupuser" });
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

export default router;
