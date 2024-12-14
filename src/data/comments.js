import validation from "../utils/validation.js";
import { comments } from "../config/mongoCollections.js";

//we will skip updateComment for now
const exportedMethods = {
  async addComment(videoId, userId, comment) {
    //TODO: verify this
    videoId = validation.checkId(videoId, "Video ID");
    userId = validation.checkId(userId, "User ID");
    comment = validation.checkString(comment, "Comment");

    const commentCollection = await comments();
    const newComment = {
      video_id: videoId,
      user_id: userId,
      text: comment,
      created_at: new Date(),
    };
    const newInsertInformation = await commentCollection.insertOne(newComment);

    if (newInsertInformation.insertedCount === 0) {
      throw new Error("Could not add comment");
    }

    return await this.getCommentById(
      newInsertInformation.insertedId.toString(),
    );
  },
  async getCommentById(id) {
    //TODO: verify this
    id = validation.checkId(id, "ID");
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: id });
    if (!comment) throw new Error("Comment not found");
    return comment;
  },
  async getAllComments() {
    //TODO: verify this
    const commentCollection = await comments();
    return await commentCollection.find({}).toArray();
  },
  async getCommentsByVideoId(videoId) {
    //TODO: verify this
    videoId = validation.checkId(videoId, "Video ID");
    const commentCollection = await comments();
    return await commentCollection.find({ video_id: videoId }).toArray();
  },
  async removeComment(commentId) {
    //TODO: verify this
    commentId = validation.checkId(commentId, "Comment ID");
    const commentCollection = await comments();
    const deletionInfo = await commentCollection.deleteOne({ _id: commentId });
    if (deletionInfo.deletedCount === 0) {
      throw new Error(`Could not delete comment with id of ${commentId}`);
    }

    return { commentId: commentId, deleted: true };
  },
};

export default exportedMethods;
