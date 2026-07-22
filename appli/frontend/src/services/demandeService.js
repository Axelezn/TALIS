import { apiRequest } from './apiClient';

export async function getDemandesByUser(idUser, token) {
  return apiRequest(`/demandes/user/${idUser}`, {
    method: 'GET',
    token,
  });
}

export async function getDemandesByEntreprise(idEntreprise, token) {
  return apiRequest(`/demandes/entreprise/${idEntreprise}`, {
    method: 'GET',
    token,
  });
}

export async function createDemande(payload, token) {
  return apiRequest('/demandes', {
    method: 'POST',
    body: {
      id_user: payload.id_user,
      id_offre: payload.id_offre,
    },
    token,
  });
}

export async function updateDemandeStatut(idDemande, statut, token) {
  return apiRequest(`/demandes/${idDemande}`, {
    method: 'PUT',
    body: {
      demande: statut,
    },
    token,
  });
}
