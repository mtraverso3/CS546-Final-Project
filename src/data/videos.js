import { videos, comments } from "../config/mongoCollections.js";
import validation from "../utils/validation.js";

const exportedMethods = {
  async getVideoById(id) {
    //TODO: verify this
    id = validation.checkId(id);
    const videoCollection = await videos();
    const video = await videoCollection.findOne({ _id: id });
    if (!video) throw new Error("Video not found");
    return video;
  },
  async getAllVideos() {
    //TODO: verify this
    const videoCollection = await videos();
    return await videoCollection.find({}).toArray();
  },
  async addVideo(owner_id, title, description, isPrivate, file_path) {
    //TODO: verify this
    owner_id = validation.checkId(owner_id, "Owner ID");
    title = validation.checkString(title, "Title");
    description = validation.checkString(description, "Description");
    isPrivate = validation.checkBoolean(isPrivate, "Private");
    file_path = validation.checkString(file_path, "File Path");

    const newVideo = {
      owner_id: owner_id,
      title: title,
      description: description,
      private: isPrivate,
      whitelisted_users: [],
      file_path: file_path,
      created_at: new Date(),
      like_count: 0,
      dislike_count: 0,
    };

    const videoCollection = await videos();
    const newInsertInformation = await videoCollection.insertOne(newVideo);
    if (newInsertInformation.insertedCount === 0)
      throw new Error("Could not add video");
    const newId = newInsertInformation.insertedId;
    return await this.getVideoById(newId.toString());
  },
  async updateVideo(id, updatedVideo) {
    //TODO: verify this
    id = validation.checkId(id);
    const videoCollection = await videos();
    const updatedVideoData = {};

    if (updatedVideo.title) {
      updatedVideoData.title = validation.checkString(
        updatedVideo.title,
        "Title",
      );
    }

    if (updatedVideo.description) {
      updatedVideoData.description = validation.checkString(
        updatedVideo.description,
        "Description",
      );
    }

    if (updatedVideo.isPrivate) {
      updatedVideoData.private = validation.checkBoolean(
        updatedVideo.isPrivate,
        "Private",
      );
    }

    if (updatedVideo.whitelisted_users) {
      updatedVideoData.whitelisted_users = validation.checkStringArray(
        updatedVideo.whitelisted_users,
        "Whitelisted Users",
      );
    }

    if (updatedVideo.file_path) {
      updatedVideoData.file_path = validation.checkString(
        updatedVideo.file_path,
        "File Path",
      );
    }

    const updatedInfo = await videoCollection.updateOne(
      { _id: id },
      { $set: updatedVideoData },
    );
    if (updatedInfo.modifiedCount === 0) {
      throw new Error("Could not update video successfully");
    }

    return await this.getVideoById(id);
  },
  async removeVideo(id) {
    //TODO: verify this (especially its dependencies)
    id = validation.checkId(id);
    const videoCollection = await videos();
    const deletionInfo = await videoCollection.deleteOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw new Error(`Could not delete video with id of ${id}`);
    }

    const commentCollection = await comments();
    const deletionInfoComments = await commentCollection.deleteMany({
      video_id: id,
    });

    return { videoId: id, deleted: true };
  },
  async addWhitelistedUser(videoId, userId) {
    //TODO: verify this
    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    const videoCollection = await videos();
    const updatedInfo = await videoCollection.updateOne(
      { _id: videoId },
      { $addToSet: { whitelisted_users: userId } },
    );
    if (updatedInfo.modifiedCount === 0) {
      throw new Error("Could not add whitelisted user");
    }

    return await this.getVideoById(videoId);
  },
  async removeWhitelistedUser(videoId, userId) {
    //TODO: verify this
    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");

    const videoCollection = await videos();
    const updatedInfo = await videoCollection.updateOne(
      { _id: videoId },
      { $pull: { whitelisted_users: userId } },
    );
    if (updatedInfo.modifiedCount === 0) {
      throw new Error("Could not remove whitelisted user");
    }

    return await this.getVideoById(videoId);
  },
  async removeAllWhitelistedUsers(videoId) {
    //TODO: verify this
    videoId = validation.checkId(videoId);

    const videoCollection = await videos();
    const updatedInfo = await videoCollection.updateOne(
      { _id: videoId },
      { $set: { whitelisted_users: [] } },
    );
    if (updatedInfo.modifiedCount === 0) {
      throw new Error("Could not remove all whitelisted users");
    }

    return await this.getVideoById(videoId);
  },
  async getWhitelistedUsers(videoId) {
    //TODO: verify this
    videoId = validation.checkId(videoId);

    const videoCollection = await video();
    const video = await videoCollection.findOne({ _id: videoId });
    if (!video) throw new Error("Video not found");

    return video.whitelisted_users;
  },
  async getVideoByOwner(ownerId) {
    //TODO: verify this
    ownerId = validation.checkId(ownerId, "Owner ID");

    const videoCollection = await videos();
    return await videoCollection.find({ owner_id: ownerId }).toArray();
  },
};

export default exportedMethods;
