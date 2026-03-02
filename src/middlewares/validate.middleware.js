import { error } from '../utils/reponse.utils.js';
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error?.errors || result.error?.issues || [];

    const messages = issues.map(e => e.message).join(', ') || 'Données invalides';

    return error(res, messages, 400);
  }

  req.body = result.data;
  next();
};

export default validate;