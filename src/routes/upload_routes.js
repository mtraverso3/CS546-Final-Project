import { Router } from "express";
import { userData, videoData } from "../data/index.js";
import validation from "../utils/validation.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import multer from "multer";
import path from "path";

const router = Router();

//middleware to ensure user is logged i
const ensureAuthenticated = (req, res, next) => {
  console.log(req.session);
  if (req.session && req.session.AuthenticationState) {
    return next();
  } else {
    return res.status(401).redirect("/intro");
  }
};

//middleware to upload file, keeps original extension, and renames/puts the upload in "data/uploads/user_id/uuidv4.extension"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `data/uploads/${req.session.user._id}`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

router.get("/", ensureAuthenticated, async (req, res) => {
  return res.render("upload", {
    user: req.session.user,
  });
});

// two files, "video" and "thumbnail"
router.post(
  "/",
  ensureAuthenticated,
  multer({ storage: storage }).fields([
    {
      name: "video",
      maxCount: 1,
    },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    if (req.files && req.files.video && req.files.thumbnail) {
      try {
        const video = await videoData.addVideo(
          req.session.user._id,
          req.body.title,
          req.body.description,
          req.body.visibility === "private"
        );

        if (!video) throw new Error("Could not add video");

        //now we need to move the files to the correct location (from the temporary data/uploads/user_id/uuidv4.extension to data/media/user_id/video_id.extension)
        const videoPath = `data/media/${req.session.user._id}/${video._id}.mp4`;
        const thumbnailPath = `data/media/${req.session.user._id}/${video._id}.png`;

        //make sure the directories exist
        fs.mkdirSync(path.dirname(videoPath), { recursive: true });
        fs.mkdirSync(path.dirname(thumbnailPath), { recursive: true });

        fs.renameSync(req.files.video[0].path, videoPath);
        fs.renameSync(req.files.thumbnail[0].path, thumbnailPath);

        return res.status(200).redirect("/profile");
      } catch (e) {
        return res.status(400).redirect("/profile");
      }
    } else {
      return res.status(400).redirect("/profile");
    }
  }
);

export default router;
