export default class ValidationException extends Error {
    name = 'ValidationException';
    fields = {};
  
    constructor(axiosConfig) {
      super('ValidationError');
      this.fields = axiosConfig.response.data.errors;
    }
  
    static isShape = axiosConfig => {
      return (
        axiosConfig.response &&
        axiosConfig.response.data &&
        axiosConfig.response.data.errors
      );
    };
    static create = error => {
      return Promise.reject(new ValidationException(error));
    };
  }
  