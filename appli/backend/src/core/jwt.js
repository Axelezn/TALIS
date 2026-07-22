import jwt from 'jsonwebtoken';

// Décode et vérifie un token émis par AuthService.login (payload : { sub, role, email }).
// Lève si le token est absent, invalide, expiré, ou si JWT_SECRET n'est pas configuré.
export function verifyAuthToken(token) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET est manquant dans la configuration serveur.');
  }

  if (!token) {
    throw new Error('Token manquant.');
  }

  const payload = jwt.verify(token, jwtSecret);

  return {
    id: payload.sub,
    role: payload.role,
    email: payload.email,
  };
}
