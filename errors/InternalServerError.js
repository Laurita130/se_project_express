const { INTERNAL_SERVER_ERROR } = require("../utils/errors");

class InternalServerError extends Error {
  constructor(message = "An error has occurred on the server.") {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;