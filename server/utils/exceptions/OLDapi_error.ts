export default class ApiError extends Error {
  status;
  errors;
  code;

  constructor(status: number, code: any, message: any, errors = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован', '');
  }

  static BadRequest(message: any, errors = []) {
    return new ApiError(400, { ...message }, errors);
  }
}
