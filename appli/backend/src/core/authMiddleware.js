import { AppError } from './AppError.js';
import { verifyAuthToken } from './jwt.js';

// Middleware Express : exige un Authorization: Bearer <token> valide et expose
// l'utilisateur authentifié sur req.auth = { id, role, email }.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  try {
    req.auth = verifyAuthToken(token);
    next();
  } catch (error) {
    next(new AppError('Authentification requise ou invalide.', 401, error.message));
  }
}
