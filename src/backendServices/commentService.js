import axios from "axios";

class CommentService {
  constructor() {}
  async getVideoComments(videoId, page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `/api/v1//comment/v/${videoId}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error) {
      throw error.response.data.message || error.response.statusText;
    }
  }

  async addComment(videoId, tweetId, content) {
    try {
      const response = await axios.post(`/api/v1/comment/create`, {
        videoId,
        tweetId,
        content,
      });

      return response.data.data;
    } catch (error) {
      throw error.response.data.message || error.response.statusText;
    }
  }

  async deleteComment(commentId) {
    try {
      const response = await axios.delete(
        `/api/v1/comment/delete/${commentId}`
      );
      return response.data.data;
    } catch (error) {
      throw error.response.data.message || error.response.statusText;
    }
  }

  async updateComment(commentId, content) {
    try {
      const response = await axios.patch(
        `/api/v1/comment/update/${commentId}`,
        {
          content,
        }
      );
      return response.data.data;
    } catch (error) {
      throw error.response.data.message || error.response.statusText;
    }
  }
}

export const commentService = new CommentService();
