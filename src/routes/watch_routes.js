import router from "./internal_routes.js";
import { videoData } from "../data/index.js";
import * as fs from "node:fs";
import {mediaConfig} from "../config/settings.js";

router.route("/:id").get(async (req, res) => {
  if (req.session && req.session.AuthenticationState) {
    try {
      const video = await videoData.getVideoById(req.params.id);
      // console.log(req.session.AuthenticationState.user);
      let user = req.session.AuthenticationState.user;
      let initials = user.firstName[0] + user.lastName[0];
      res.render("watch", {
        user: req.session.AuthenticationState.user,
        initials: initials,
        video: video,
      });
    } catch (e) {
      return res.status(400).redirect("/homepage");
    }
  } else {
    return res.status(401).redirect("/intro");
  }
});

// route for the <video> element's src attribute (i.e this is the route that will serve the video file)
router.route("/video/:id").get(async (req, res) => {
  console.log("video route");
  if (req.session && req.session.AuthenticationState) {
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
      return res.status(400).redirect("/homepage");
    }
  } else {
    return res.status(401).redirect("/intro");
  }
});

export default router;
