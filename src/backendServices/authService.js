import axios from "axios";

class Authservice {
  constructor() {}

  async getCurrentUser() {
    try {
      const userData = await axios.get("/api/v1/users/current-user");
      return userData.data.data;
    } catch (error) {
      if (error.response.status === 401) {
        try {
          await axios.post("/api/v1/users/refresh-accessToken");
          const userData = await this.getCurrentUser();
          return userData;
        } catch (error) {
          throw error.response.data.message || error.response.statusText;
        }
      } else {
        throw error.response.data.message || error.response.statusText;
      }
    }
  }

  async login(loginInfo) {
    try {
      const response = await axios.post("/api/v1/users/login", loginInfo);
      return response.data.data;
    } catch (error) {
      throw error.response.data.message || error.response.statusText;
    }
  }

  async register(userInfo) {
    try {
      const response = await axios.post("/api/v1/users/register", userInfo);
      return await this.login({
        username: userInfo.username,
        password: userInfo.password,
      });
    } catch (error) {
      throw error.response.data.message || error.response.statusText;
    }
  }
}

export const authService = new Authservice();
