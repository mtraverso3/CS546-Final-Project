import validation from "../utils/validation.js";
import { likes, videos } from "../config/mongoCollections.js";
import { userData, videoData } from "./index.js";

const exportedMethods = {
  async addLike(videoId, userId) {
    //TODO: verify this

    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    // Ensure that the video and user exist
    const video = await videoData.getVideoById(videoId); // This will throw an error if the video does not exist
    const user = await userData.getUserById(userId); // This will throw an error if the user does not exist

    const likeCollection = await likes();
    const newLike = {
      video_id: videoId,
      user_id: userId,
    };
    const insertInfo = await likeCollection.insertOne(newLike);
    if (insertInfo.insertedCount === 0) throw new Error("Could not add like");

    const videoCollection = await videos();
    const updatedInfo = await videoCollection.updateOne(
        { _id: videoId },
        { $inc: { likes_count: 1 } }
        );
    if (updatedInfo.modifiedCount === 0) {
        throw new Error("Could not increase video likes count");
    }

    return { likes_count: video.likes_count + 1 };
  },
  async removeLike(videoId, userId) {
    //TODO: verify this

    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    // Ensure that the video and user exist
    const video = await videos.getVideoById(videoId); // This will throw an error if the video does not exist
    const user = await userData.getUserById(userId); // This will throw an error if the user does not exist

    const likeCollection = await likes();
    const deletionInfo = await likeCollection.deleteOne({
      video_id: videoId,
      user_id: userId,
    });

    if (deletionInfo.deletedCount === 0) {
      throw new Error(`Could not delete like for video with id of ${videoId}`);
    }

    //TODO: decrease video likes count
    const videoCollection = await videos();
    const updatedInfo = await videoCollection.updateOne(
        {
            _id: videoId,
            likes_count: { $gt: 0 }
        },
        { $inc: { likes_count: -1 } }
    );

    if (updatedInfo.modifiedCount === 0) {
        throw new Error("Could not decrease video likes count");
    }

    return { likes_count: video.likes_count - 1 };
  },
  async getLikesCount(videoId) {
    //TODO: verify this

    videoId = validation.checkId(videoId, "Video ID");

    const video = await videos.getVideoById(videoId); // This will throw an error if the video does not exist

    return { likes_count: video.likes_count };
  },
  async getVideosLikedByUserId(userId) {
    //TODO: verify this
    userId = validation.checkId(userId, "User ID");

    const user = await userData.getUserById(userId); // This will throw an error if the user does not exist

    const likeCollection = await likes();
    const likeList = await likeCollection.find({ user_id: userId }).toArray();

    //return the videoIDs of the videos liked by the user
    return likeList.map((like) => like.video_id.toString());
  },
};

export default exportedMethods;
