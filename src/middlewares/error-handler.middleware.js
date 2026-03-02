import { error } from "../utils/reponse.utils.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  return error(res, message, statusCode);
};

export default errorHandler;