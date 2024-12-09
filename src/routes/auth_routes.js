import e, {Router} from 'express';
const router = Router();
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";


router.route('/').get(async (req, res) => {
    console.log("Hello World");
      res.redirect('/intro');
  });
  

  router
  .route('/intro')
  .get(async (req, res) => {
    res.render('layouts/intro', {title: "Sign Up"});
  });

  router
  .route('/signup')
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      showAuthenticatedPage(req, res);
    } else {
      res.render('layouts/sign_up_layout');
    }
  })

  router
  .route('/auth/login')
  .post(async (req, res) => {
    const userCollection = await users();
    const user = await userCollection.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).send("User not found");
      return;
    } else {
      const passwordMatch = await bcrypt.compare(req.body.password, user.password_hash);
      if (passwordMatch) {
        req.session.AuthenticationState = {
          username: user.username,
          _id: user._id,
        };
        res.render('layouts/homepage', user);
      } else {
        res.status(401).send("Password does not match");
      }
    }
  })


  export default router;  

