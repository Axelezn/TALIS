import { apiRequest } from './apiClient';

export async function getUtilisateurs() {
  return apiRequest('/utilisateurs', { method: 'GET' });
}

export async function getUtilisateurById(id) {
  return apiRequest(`/utilisateurs/${id}`, { method: 'GET' });
}
