export const cleanBodyMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = Object.fromEntries(
      Object.entries(req.body).filter(([_, v]) => v !== undefined && v !== "")
    );
  }
  next();
};