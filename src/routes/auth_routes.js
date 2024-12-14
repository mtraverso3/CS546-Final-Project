import e, { Router } from 'express';
const router = Router();
import { users, videos } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import validation from "../utils/validation.js";

const getUserByEmail = async (email) => {
  //email = validation.checkId(email, "email");
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) throw new Error("User not found");
  return user;
}

router.route('/').get(async (req, res) => {
  return res.redirect('/intro');
});

router
  .route('/intro')
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      res.redirect("/homepage");
    } else {
      return res.render('layouts/intro', { title: "Sign Up" });
    }
  });

router
  .route('/signup')
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      res.redirect("/homepage");
    } else {
      res.render('layouts/sign_up_layout');
    }
  })

router
  .route('/auth/logout')
  .post(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      req.session.destroy();
    }
    return res.redirect("/intro");
  })
  .get(async (req, res) => {
    return res.redirect("/intro");
  })


router
  .route('/auth/login')
  .post(async (req, res) => {
    const user = await getUserByEmail(req.body.email);
    if (!user) {
      return res.status(401).send("User not found");
    } else {
      const passwordMatch = await bcrypt.compare(req.body.password, user.password_hash);
      if (passwordMatch) {
        req.session.AuthenticationState = {
          user: user,
        };
        res.redirect("/homepage");
      } else {
        return res.status(401).redirect("/intro");
      }
    }
  })


router
  .route('/homepage')
  .get(async (req, res) => {
    if ((req.session) && (req.session.AuthenticationState)) {
      const v = {}; //await videos.getVideoByOwner( req.session.AuthenticationState.user._id)

      res.render('layouts/homepage', { user: req.session.AuthenticationState.user});
    } else {
      return res.status(401).redirect("/intro");
    }
  })

router
  .route('/profile')
  .get(async (req, res) => {
    if ((req.session) && (req.session.AuthenticationState)) {
      res.render('layouts/profile', { user: req.session.AuthenticationState.user });
    } else {
      return res.status(401).redirect("/intro");
    }
  })


router
  .route('/settings')
  .get(async (req, res) => {
    if ((req.session) && (req.session.AuthenticationState)) {
      return res.render('layouts/settings', { user: req.session.AuthenticationState.user });
    } else {
      return res.status(401).redirect("/intro");
    }
  })
  .post(async (req, res) => {
    if ((req.session) && (req.session.AuthenticationState)) {
      users.updateUserPatch(req.session.AuthenticationState.user._id, req.body);
      res.render('layouts/settings', { user: req.session.AuthenticationState.user });
    } else {
      return res.status(401).redirect("/intro");
    }
  })



export default router;

