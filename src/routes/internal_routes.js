import { Router } from "express";
import { collectionData, userData, videoData } from "../data/index.js";
import validation from "../utils/validation.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { mediaConfig } from "../config/settings.js";

const router = Router();

const PAGE_SIZE = 3; // Number of videos per page

router
  .route("/search")
  .post(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      try {
        req.body.search = validation.checkString(req.body.search);

        const v = await videoData.getAllVideosMatching(req.body.search);
        const v2 = await videoData.getVideoByTag(req.body.search);
        let videoList = v.concat(v2)
        // console.log(req.session.AuthenticationState.user);
        let user = req.session.AuthenticationState.user;
        let initials = user.firstName[0] + user.lastName[0];

        res.render("homepage", {
          user: req.session.AuthenticationState.user,
          videos: videoList,
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
      const page = parseInt(req.query.page || "1", 10);
      const totalPages = Math.ceil(v.length / PAGE_SIZE);
      const startIndex = (page - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];

      v.forEach((video) => {
        video.publishedAt = video.created_at.toDateString();
      });

      res.render("homepage", {
        user: req.session.AuthenticationState.user,
        initials: initials,
        videos: v.slice(startIndex, endIndex),
        currentPage: page,
        totalPages,
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
    const userVideos = await videoData.getVideoByOwner(user._id);
    const userCollections = await collectionData.getCollectionsByOwner(user._id);
    res.render("profile", {
      user: req.session.AuthenticationState.user,
      initials: initials,
      videos: userVideos,
      playlists: userCollections,
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
          }
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

router.route("/following").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    try {
      const followedChannels = [];
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];

      res.render("following", {
        user: req.session.AuthenticationState.user,
        initials: initials,
        followedChannels: followedChannels,
      });
    } catch (e) {
      return res.status(400).redirect("/homepage");
    }
  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/playlists").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    try {
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];
      const playlists = await collectionData.getCollectionsByOwner(user._id);

      res.render("playlists", {
        user: req.session.AuthenticationState.user,
        initials: initials,
        playlists: playlists,
      });
    } catch (e) {
      return res.status(400).redirect("/homepage");
    }
  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/playlists/:id").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    let user = req.session.AuthenticationState.user;
    let initials = user.firstName[0] + user.lastName[0];
    // todo: get videos for the playlist/collection
    const collection = await collectionData.getCollectionById(req.params.id);

    const playlists = await collectionData.getCollectionsByOwner(user._id);
    const v = await videoData.getAllVideos();

    res.render("showplaylist", {
      user: req.session.AuthenticationState.user,
      initials: initials,
      playlist: collection.title,
      videos: v.filter((video) => collection.videos.includes(video._id.toString())),
    });
  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/comments").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    try {
      const comments = [];
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];

      res.render("yourcomments", {
        user: req.session.AuthenticationState.user,
        initials: initials,
        comments: comments,
      });
    } catch (e) {
      return res.status(400).redirect("/homepage");
    }
  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/likes").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    try {
      const likedVideos = [];
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];

      res.render("likedvideos", {
        user: req.session.AuthenticationState.user,
        initials: initials,
        likedVideos: likedVideos,
      });
    } catch (e) {
      return res.status(400).redirect("/homepage");
    }
  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/likes/:videoId").post(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    try {
      res.redirect(`/watch/${req.params.videoId}`);
    } catch (e) {
      return res.status(400).redirect("/homepage");
    }
  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/upload").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    let user = req.session.AuthenticationState.user;
    let initials = user.firstName[0] + user.lastName[0];
    return res.render("upload", {
      user: req.session.AuthenticationState.user,
      initials: initials,
    });
  } else {
    return res.status(401).redirect("/intro");
  }
});
router
  .route("/upload")
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];
      return res.render("upload", {
        user: req.session.AuthenticationState.user,
        initials: initials,
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  });


  router
  .route("/newcollection")
  .get(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];
      const v = await videoData.getAllVideos();

      return res.render("newcollection", {
        user: req.session.AuthenticationState.user,
        initials: initials,
        videos: v,
        allowcheckbox: true,
      });
    } else {
      return res.status(401).redirect("/intro");
    }
  }).post(async (req, res) => {
    if (req.session && req.session.AuthenticationState) {
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];
      try {
        const videos = [];
        for (const key in req.body) {
          if (key.startsWith('cv_')) {
            videos.push(key.slice(3)); 
          }
        }
        const newcol = await collectionData.createCollection(
          req.session.AuthenticationState.user._id,
          req.body.title,
          req.body.description,
          videos
        );
        return res.redirect("/playlists");
      } catch (e) {
        return res.status(400).render("newcollection", {
          user: req.session.AuthenticationState.user,
          initials: initials,
        });
      }
    } else {
      return res.status(401).redirect("/intro");
    }
  });

router.route("/edit-video/:id").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    try {
      const video = await videoData.getVideoById(req.params.id);
      const userId = req.session.AuthenticationState.user._id;

      if (!video || video.owner_id.toString() !== userId) {
        return res.status(403).send("Unauthorized");
      }

      res.render("editvideo", {
        video,
        user: req.session.AuthenticationState.user,
      });
    } catch (e) {
      return res.status(400).redirect("/profile");
    }
  } else {
    return res.status(401).redirect("/intro");
  }
});

router.route("/update-video/:id").post(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    try {
      const videoId = req.params.id;
      const userId = req.session.AuthenticationState.user._id;
      const { title, description } = req.body;

      const video = await videoData.getVideoById(videoId);
      if (!video || video.owner_id.toString() !== userId) {
        return res.status(403).send("Unauthorized");
      }

      await videoData.updateVideo(videoId, { title, description });

      res.redirect("/profile");
    } catch (e) {
      return res.status(400).redirect("/profile");
    }
  } else {
    return res.status(401).redirect("/intro");
  }
});

export default router;
