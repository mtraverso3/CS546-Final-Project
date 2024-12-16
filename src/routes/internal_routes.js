import { Router } from "express";
import { userData, videoData } from "../data/index.js";
import validation from "../utils/validation.js";

const router = Router();

router
  .route("/search")
  .post(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      try {
        req.body.search = validation.checkString(req.body.search);

        const v = await videoData.getAllVideosMatching(req.body.search);
        // console.log(req.session.AuthenticationState.user);
        let user = req.session.AuthenticationState.user;
        let initials = user.firstName[0] + user.lastName[0];

        res.render("homepage", {
          user: req.session.AuthenticationState.user,
          videos: v,
          initials: initials,
        });
      } catch (e) {
        return res.status(400).redirect("/homepage");
      }
    } else {
      return res.status(401).redirect("/intro");
    }
  })
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      // console.log(req.session.AuthenticationState.user);
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];
      res.render("homepage", {
        user: req.session.AuthenticationState.user,
        initials: initials,
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  });

router.route("/homepage").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    try {
      const v = await videoData.getAllVideos();
      // console.log(req.session.AuthenticationState.user);
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];
      res.render("homepage", {
        user: req.session.AuthenticationState.user,
        initials: initials,
        videos: v,
      });
    } catch (e) {
      return res.status(500).redirect("/intro");
    }
  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/profile").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    // console.log(req.session.AuthenticationState.user);
    let user = req.session.AuthenticationState.user;
    let initials = user.firstName[0] + user.lastName[0];
    res.render("profile", {
      user: req.session.AuthenticationState.user,
      initials: initials,
    });
  } else {
    return res.status(401).redirect("/intro");
  }
});

router
  .route("/settings")
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      console.log(req.session.AuthenticationState.user);
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];
      return res.render("settings", {
        user: req.session.AuthenticationState.user,
        initials: initials,
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  })
  .post(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];
      try {
        // todo: add validation new_password vs confirm_password
        // todo: add validation password
        req.session.user = await userData.updateUserPatch(
          req.session.AuthenticationState.user._id,
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            dob: req.body.dob,
            password: req.body.newPassword,
          },
        );

        const visibility = await userData.updateUserVisibilityPatch(
          req.session.AuthenticationState.user._id,
          {
            emailPublic: req.body.emailPublic,
            namePublic: req.body.namePublic,
            profilePublic: req.body.profilePublic,
          }
        );

      } catch (e) {
        return res.status(400).render("settings", {
          user: req.session.AuthenticationState.user,
          initials: initials,
          errorMessage: e.message,
        });
      }
      res.render("settings", {
        user: req.session.user,
        initials: initials,
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  });

export default router;
