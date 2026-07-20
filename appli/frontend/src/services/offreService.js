import { apiRequest } from './apiClient';

export async function getOffres() {
  return apiRequest('/offres', {
    method: 'GET',
  });
}
export async function getOffreById(idOffre) {
  return apiRequest(`/offres/${idOffre}`, {
    method: 'GET',
  });
}
export async function createOffre(payload, token) {
  return apiRequest('/offres', {
    method: 'POST',
    body: {
      type: payload.type,
      titre: payload.titre,
      date_send: payload.date_send,
      date_stop: payload.date_stop,
      remuneration: payload.remuneration ? Number(payload.remuneration) : null,
      description: payload.description,
      entreprise: payload.entreprise,
    },
    token,
  });
}
export async function updateOffre(idOffre, payload, token) {
  return apiRequest(`/offres/${idOffre}`, {
    method: 'PUT',
    body: {
      type: payload.type,
      titre: payload.titre,
      date_send: payload.date_send,
      date_stop: payload.date_stop,
      remuneration: payload.remuneration ? Number(payload.remuneration) : null,
      description: payload.description,
      entreprise: payload.entreprise,
    },
    token,
  });
}
export async function deleteOffre(idOffre, token) {
  return apiRequest(`/offres/${idOffre}`, {
    method: 'DELETE',
    token,
  });
}
