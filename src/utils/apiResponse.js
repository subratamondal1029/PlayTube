class ApiResponse {
  constructor(status, message = "success", data = {}) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.success = status < 400;
  }
}

export default ApiResponse;
