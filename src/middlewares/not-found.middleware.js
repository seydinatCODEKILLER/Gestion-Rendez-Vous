import { error } from "../utils/reponse.utils.js";

const notFound = (req, res, next) => {
  return error(res, `Route ${req.originalUrl} introuvable`, 404);
};

export default notFound;