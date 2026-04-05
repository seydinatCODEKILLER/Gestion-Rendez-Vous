import TokenGenerator from "../config/jwt.js";
import HttpError from "../exceptions/http-error.exception.js";

const tokenGenerator = new TokenGenerator();

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError("Non authentifié. Token manquant.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = tokenGenerator.verify(token);

    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof HttpError) {
      next(err);
    } else {
      next(new HttpError(err.message, 401));
    }
  }
};

export default authenticate;
