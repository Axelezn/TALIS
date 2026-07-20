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
      ddn: payload.ddn || null,
      nom_entreprise: payload.companyName,
      adresse_entreprise: payload.hqAddress,
      code_postal_entreprise: payload.hqZipCode,
      ville_entreprise: payload.hqCity,
      // Additional user fields
      address: payload.address,
      city: payload.city,
      zip_code: payload.zipCode,
      study_level: payload.studyLevel,
      study_place: payload.studyPlace,
      formation: payload.major,
      contract_type: payload.contractType,
      bio: payload.bio,
      // Additional partner fields
      company_name: payload.companyName,
      sector: payload.sector,
      job_title: payload.jobTitle,
      linkedin: payload.linkedin,
    },
  });
}
