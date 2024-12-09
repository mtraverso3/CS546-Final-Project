import e, { Router } from 'express';
const router = Router();
import { users, videos } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import validation from "../utils/validation.js";

const getUserByEmail = async (email) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) throw new Error("User not found");
  return user;
};

router.route("/").get(async (req, res) => {
  console.log("Hello World");
  res.redirect("/intro");
});

router.route("/intro").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    res.redirect("/homepage");
  } else {
    return res.render("intro", {
      title: "Sign Up",
      layout: "sign_up_layout",
    });
  }
});

router.route("/signup").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    res.redirect("/homepage");
  } else {
    res.render("sign_up", {
      layout: "sign_up_layout",
    });
  }
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

router.route("/homepage").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    const v = {}; //await videos.getVideoByOwner( req.session.AuthenticationState.user._id)
    // Updated to use correct path
    res.render("homepage", {
      layout: "main",
      user: req.session.AuthenticationState.user,
    });
  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/profile").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    // Updated to use correct path
    res.render("profile", {
      layout: "main",
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
      // Updated to use correct path
      return res.render("settings", {
        layout: "main",
        user: req.session.AuthenticationState.user,
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  })
  .post(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      users.updateUserPatch(req.session.AuthenticationState.user._id, req.body);
      // Updated to use correct path
      res.render("settings", {
        layout: "main",
        user: req.session.AuthenticationState.user,
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  });

export default router;
