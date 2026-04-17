import { apiRequest } from './apiClient';

export async function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: {
      role: payload.role,
      mail: payload.email,
      password: payload.password,
    },
  });
}

export async function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: {
      role: payload.role,
      mail: payload.email,
      password: payload.password,
      nom: payload.lastName,
      prenom: payload.firstName,
      tel: payload.phone,
      nom_entreprise: payload.companyName,
      adresse_entreprise: payload.hqAddress,
      code_postal_entreprise: payload.hqZipCode,
      ville_entreprise: payload.hqCity,
    },
  });
}
