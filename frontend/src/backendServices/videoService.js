import axios from "axios";

class VideoService {
  constructor() {}
  async getVideos({
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  }) {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        query,
        sortBy,
        sortType,
        userId,
      });

      const response = await axios.get(`/api/v1/v/?${params.toString()}`);

      return response.data.data;
    } catch (error) {
      throw error.response.data.message || error.response.statusText;
    }
  }

  async getVideo(videoId) {
    try {
      const response = await axios.get(`/api/v1/v/${videoId}`);
      return response.data.data;
    } catch (error) {
      throw error.response.data.message || error.response.statusText;
    }
  }
}

export const videoService = new VideoService();
