import e, { Router } from "express";

const router = Router();
import { users, videos } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import validation from "../utils/validation.js";
import userData from "../data/users.js";
import {videoData} from "../data/index.js";

const getAllVideosMatching = async (search) => {
  const videoCollection = await videos();
  const videoList = await videoCollection
    .find({ title: { $regex: search, $options: "i" } })
    .toArray();
  return videoList;
};

const getUserByEmail = async (email) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) throw new Error("User not found");
  return user;
};

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
    let user = req.body;
    if (!user.email || !user.password) {
      return res.status(400).render("intro", {
        title: "Sign Up",
        layout: "sign_up_layout",
      });
    }

    try {
      user.email = validation.checkEmail(user.email);
      user.password = validation.checkPassword(user.password);
    } catch (e) {
      return res.status(400).render("intro", {
        title: "Sign Up",
        layout: "sign_up_layout",
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
      return res.status(401).redirect("/intro");
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
    let user = req.body;
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

router
  .route("/search")
  .post(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      const v = await getAllVideosMatching(req.body.search);
      console.log(req.session.AuthenticationState.user)
      let user = req.session.AuthenticationState.user
      let initials = user.firstName[0] + user.lastName[0]

      res.render("homepage", {
        user: req.session.AuthenticationState.user,
        videos: v,
        initials: initials
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  })
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      console.log(req.session.AuthenticationState.user)
      let user = req.session.AuthenticationState.user
      let initials = user.firstName[0] + user.lastName[0]
      res.render("homepage", { user: req.session.AuthenticationState.user, initials: initials });
    } else {
      return res.status(401).redirect("/intro");
    }
  });

router.route("/homepage").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {

    try {
        const v = await videoData.getAllVideos();
        console.log(req.session.AuthenticationState.user)
        let user = req.session.AuthenticationState.user
        let initials = user.firstName[0] + user.lastName[0]
        res.render("homepage", {
          user: req.session.AuthenticationState.user,
          initials: initials,
          videos: v,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).redirect("/intro");
    }


  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/profile").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    console.log(req.session.AuthenticationState.user)
    let user = req.session.AuthenticationState.user
    let initials = user.firstName[0] + user.lastName[0]
    res.render("profile", { user: req.session.AuthenticationState.user, initials: initials });
  } else {
    return res.status(401).redirect("/intro");
  }
});

router
  .route("/settings")
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      console.log(req.session.AuthenticationState.user)
      let user = req.session.AuthenticationState.user
      let initials = user.firstName[0] + user.lastName[0]
      return res.render("settings", {
        user: req.session.AuthenticationState.user,
        initials: initials
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  })
  .post(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      users.updateUserPatch(req.session.AuthenticationState.user._id, req.body);
      console.log(req.session.AuthenticationState.user)
      let user = req.session.AuthenticationState.user
      let initials = user.firstName[0] + user.lastName[0]
      res.render("settings", { user: req.session.AuthenticationState.user, initials: initials });
    } else {
      return res.status(401).redirect("/intro");
    }
  });

export default router;
