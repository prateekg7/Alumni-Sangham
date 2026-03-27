class ApiResponse {
  constructor(statusCode, data = null, message = "Success", meta = undefined) {
    this.statusCode = statusCode;
    this.success = statusCode < 400; // true for success responses
    this.message = message;

    if (data !== null) {
      this.data = data;
    }

    if (meta !== undefined) {
      this.meta = meta;
    }
  }
}

export default ApiResponse;