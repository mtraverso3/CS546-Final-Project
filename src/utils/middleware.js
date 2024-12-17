import { videoData } from "../data/index.js";

const middlewares = {
  logRequest: (req, res, next) => {
    console.log(
      `[${new Date().toUTCString()}] ${req.method} ${req.originalUrl}`,
    );
    next();
  },
  ensureAuthenticated(req, res, next) {
    if (req.session && req.session.AuthenticationState) {
      return next();
    } else {
      return res.status(401).redirect("/intro");
    }
  },
  async videoOwnerOnlyIfPrivate(req, res, next) {
    // if the video_id is private, only the owner can view it
    try {
      if (req.session && req.session.AuthenticationState) {
        const video = await videoData.getVideoById(req.params.id);
        if (video.private === false) {
          return next();
        } else if (
          req.session.AuthenticationState.user._id === video.owner_id.toString()
        ) {
          return next();
        } else {
          return res.status(401).redirect("/intro");
        }
      } else {
        return res.status(401).redirect("/intro");
      }
    } catch (e) {
      return res.status(404).redirect("/intro");
    }
  },
};

export default middlewares;
