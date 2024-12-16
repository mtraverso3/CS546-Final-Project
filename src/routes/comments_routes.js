import { Router } from "express";
import { videoData, commentsData } from "../data/index.js";
import path from "path";

const router = Router();

//middleware to ensure user is logged in
const ensureAuthenticated = (req, res, next) => {
  console.log(req.session);
  if (req.session && req.session.AuthenticationState) {
    return next();
  } else {
    return res.status(401).redirect("/intro");
  }
};

//post comment to a video via form submission (video id is in the param, comment is a form input with id 'comment')
router.post("/upload/:id", ensureAuthenticated, async (req, res) => {
  try {
    const video = await videoData.getVideoById(req.params.id);
    if (!video) throw new Error("Video not found");

    const user = req.session.AuthenticationState.user;
    const comment = await commentsData.addComment(
      req.params.id,
      user._id,
      req.body.comment,
    );
    if (!comment) throw new Error("Could not add comment");

    return res.status(200).redirect(`/watch/${req.params.id}`);
  } catch (e) {
    return res.status(400).redirect(`/watch/${req.params.id}`);
  }
});

export default router;
