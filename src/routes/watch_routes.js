import router from "./internal_routes.js";
import { commentsData, userData, videoData, likesData } from "../data/index.js";
import * as fs from "node:fs";
import { mediaConfig } from "../config/settings.js";
import * as path from "path";
import middlewares from "../utils/middleware.js";

router
  .route("/:id")
  .get(
    middlewares.ensureAuthenticated,
    middlewares.videoOwnerOnlyIfPrivate,
    async (req, res) => {
      try {
        const video = await videoData.getVideoById(req.params.id);
        let user = req.session.AuthenticationState.user;
        let initials = user.firstName[0] + user.lastName[0];

        await videoData.addView(req.params.id); // increment the view count

        let comments = await commentsData.getCommentsByVideoId(req.params.id);

        comments = await Promise.all(
          comments.map(async (comment) => {
            comment.publishedAt = comment.created_at.toDateString();

            const user = await userData.getUserById(comment.user_id.toString());
            if (!user) {
              comment.username = "Deleted User";
              comment.userInitials = "DU";
              return comment;
            }
            comment.username = user.username;
            comment.userInitials = user.first_name[0] + user.last_name[0];

            return comment;
          }),
        );

        res.render("watch", {
          user: req.session.AuthenticationState.user,
          initials: initials,
          video: video,
          comments: comments,
        });
      } catch (e) {
        return res.status(400).redirect("/homepage");
      }
    },
  );

// route for the <video> element's src attribute (i.e this is the route that will serve the video file)
router
  .route("/video/:id")
  .get(
    middlewares.ensureAuthenticated,
    middlewares.videoOwnerOnlyIfPrivate,
    async (req, res) => {
      try {
        const video = await videoData.getVideoById(req.params.id);

        const range = req.headers.range;

        const videoPath = `${mediaConfig.uploadDir}/${video.owner_id}/${video._id}.mp4`;

        const videoSize = fs.statSync(videoPath).size;
        const chunkSize = 1e6;

        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + chunkSize, videoSize - 1);

        const contentLength = end - start + 1;

        const headers = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
        };

        res.writeHead(206, headers);

        const stream = fs.createReadStream(videoPath, { start, end });

        return stream.pipe(res);
      } catch (e) {
        return res.redirect("/homepage");
      }
    },
  );

// route for the video thumbnail
router
  .route("/thumbnail/:id")
  .get(
    middlewares.ensureAuthenticated,
    middlewares.videoOwnerOnlyIfPrivate,
    async (req, res) => {
      try {
        const video = await videoData.getVideoById(req.params.id);
        const thumbnailPath = `${mediaConfig.uploadDir}/${video.owner_id}/${video._id}.png`;

        // return res.sendFile(thumbnailPath); //path must be absolute or specify root to res.sendFile
        return res.sendFile(path.resolve(thumbnailPath));
      } catch (e) {
        return res.status(404);
      }
    },
  );

router
  .route("/like/:id")
  .post(
    middlewares.ensureAuthenticated,
    middlewares.videoOwnerOnlyIfPrivate,
    async (req, res) => {
      try {
        const video = await videoData.getVideoById(req.params.id);
        const user = req.session.user;
        const like = await likesData.toggleLike(video._id.toString(), user._id);

        return res
          .status(200)
          .json({ like_count: like.like_count, is_liked: like.is_liked });
      } catch (e) {
        return res.status(400).json({ error: e.message });
      }
    },
  );

//now one for dislike
router
  .route("/dislike/:id")
  .post(
    middlewares.ensureAuthenticated,
    middlewares.videoOwnerOnlyIfPrivate,
    async (req, res) => {
      try {
        const video = await videoData.getVideoById(req.params.id);
        const user = req.session.AuthenticationState.user;
        const like = await likesData.toggleDislike(
          video._id.toString(),
          user._id,
        );

        return res.status(200).json({
          dislike_count: like.dislike_count,
          is_disliked: like.is_disliked,
        });
      } catch (e) {
        return res.status(400).json({ error: e.message });
      }
    },
  );

export default router;
