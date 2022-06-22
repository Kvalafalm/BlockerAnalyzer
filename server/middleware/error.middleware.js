/* const ApiError = require('../utils/exceptions/api_error'); */
import ApiError from '../utils/exceptions/api_error.js';
const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message.toString(), errors: err.errors });
  }
  console.log(err);
  return res.status(500).json({ message: 'Непредвиденная ошибка' });
};
export default errorMiddleware;
