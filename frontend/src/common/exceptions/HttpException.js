import ValidationException from './ValidationException';

/**
 * A custom exception class
 */

export default class HttpException extends Error {
  statusCode = 0;

  constructor(axiosError) {
    super('HttpException');
    this.dispatchError(axiosError);
  }

  dispatchError(error) {
    if (error.response) {
      this.statusCode = error.response.status;
      this.message = error.response.data
        ? JSON.stringify(error.response.data)
        : error;
    } else {
      this.statusCode = error.status;
      if (error.name === 'a0.credential_manager.invalid') {
        // Refresh token expired
        this.message = JSON.stringify(error);
      }
    }
  }

  static create = error => {
    if (ValidationException.isShape(error)) {
      return ValidationException.create(error);
    }
    return Promise.reject(new HttpException(error));
  };
}
