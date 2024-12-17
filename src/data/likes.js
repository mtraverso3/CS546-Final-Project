import validation from "../utils/validation.js";
import {dislikes, likes, videos} from "../config/mongoCollections.js";
import { userData, videoData } from "./index.js";

const exportedMethods = {
  async addLike(videoId, userId) {
    //TODO: verify this

    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    // Ensure that the video and user exist
    const video = await videoData.getVideoById(videoId.toString()); // This will throw an error if the video does not exist
    const user = await userData.getUserById(userId.toString()); // This will throw an error if the user does not exist

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
      { $inc: { like_count: 1 } },
    );
    if (updatedInfo.modifiedCount === 0) {
      throw new Error("Could not increase video likes count");
    }

    return { like_count: video.like_count + 1 };
  },
  async removeLike(videoId, userId) {
    //TODO: verify this

    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    // Ensure that the video and user exist
    const video = await videoData.getVideoById(videoId.toString()); // This will throw an error if the video does not exist
    const user = await userData.getUserById(userId.toString()); // This will throw an error if the user does not exist

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
        like_count: { $gt: 0 },
      },
      { $inc: { like_count: -1 } },
    );

    if (updatedInfo.modifiedCount === 0) {
      throw new Error("Could not decrease video likes count");
    }

    return { like_count: video.like_count - 1 };
  },
  addDislike: async function (videoId, userId) {
    //TODO: verify this

    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    // Ensure that the video and user exist
    const video = await videoData.getVideoById(videoId.toString()); // This will throw an error if the video does not exist
    const user = await userData.getUserById(userId.toString()); // This will throw an error if the user does not exist

    const dislikeCollection = await dislikes();
    const newDislike = {
      video_id: videoId,
      user_id: userId,
    };

    const insertInfo = await dislikeCollection.insertOne(newDislike);
    if (insertInfo.insertedCount === 0)
      throw new Error("Could not add dislike");

    const videoCollection = await videos();
    const updatedInfo = await videoCollection.updateOne(
      { _id: videoId },
      { $inc: { dislike_count: 1 } },
    );
    if (updatedInfo.modifiedCount === 0) {
      throw new Error("Could not increase video dislikes count");
    }

    return { dislike_count: video.dislike_count + 1 };
  },
  removeDislike: async function (videoId, userId) {
    //TODO: verify this

    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    // Ensure that the video and user exist
    const video = await videoData.getVideoById(videoId.toString()); // This will throw an error if the video does not exist
    const user = await userData.getUserById(userId.toString()); // This will throw an error if the user does not exist

    const dislikeCollection = await dislikes();
    const deletionInfo = await dislikeCollection.deleteOne({
      video_id: videoId,
      user_id: userId,
    });

    if (deletionInfo.deletedCount === 0) {
      throw new Error(
        `Could not delete dislike for video with id of ${videoId}`,
      );
    }

    const videoCollection = await videos();
    const updatedInfo = await videoCollection.updateOne(
        {
            _id: videoId,
            dislike_count: { $gt: 0 },
        },
        { $inc: { dislike_count: -1 } },
    );

    return { dislike_count: video.dislike_count - 1 };
  },
  async getLikesCount(videoId) {
    //TODO: verify this

    videoId = validation.checkId(videoId, "Video ID");

    const video = await videoData.getVideoById(videoId); // This will throw an error if the video does not exist

    return { like_count: video.like_count };
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
  async hasUserLikedVideo(videoId, userId) {
    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    const likeCollection = await likes();
    const like = await likeCollection.findOne({
      video_id: videoId,
      user_id: userId,
    });

    return !!like;
  },
  async hasUserDislikedVideo(videoId, userId) {
    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    const dislikeCollection = await dislikes();
    const dislike = await dislikeCollection.findOne({
      video_id: videoId,
      user_id: userId,
    });

    return !!dislike;
  },

  async toggleLike(videoId, userId) {
    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    const hasLiked = await this.hasUserLikedVideo(
      videoId.toString(),
      userId.toString(),
    );
    if (hasLiked) {
      const { like_count } = await this.removeLike(
        videoId.toString(),
        userId.toString(),
      );
      return { like_count: like_count, is_liked: false };
    } else {
      const { like_count } = await this.addLike(
        videoId.toString(),
        userId.toString(),
      );
      return { like_count: like_count, is_liked: true };
    }
  },
  async toggleDislike(videoId, userId) {
    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    const hasDisliked = await this.hasUserDislikedVideo(
      videoId.toString(),
      userId.toString(),
    );
    if (hasDisliked) {
      const { dislike_count } = await this.removeDislike(
        videoId.toString(),
        userId.toString(),
      );
      return { dislike_count: dislike_count, is_disliked: false };
    } else {
      const { dislike_count } = await this.addDislike(
        videoId.toString(),
        userId.toString(),
      );
      return { dislike_count: dislike_count, is_disliked: true };
    }
  },
};

export default exportedMethods;
