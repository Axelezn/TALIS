import { apiRequest } from './apiClient';

export async function getEntrepriseById(idEntreprise) {
  return apiRequest(`/entreprises/${idEntreprise}`, {
    method: 'GET',
  });
}
