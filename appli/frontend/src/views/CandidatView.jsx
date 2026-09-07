import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, BookOpen, Briefcase, GraduationCap, Mail, Phone, ArrowLeft, User } from 'lucide-react';
import { getUtilisateurById } from '../services/utilisateurService';
import './CandidatView.scss';

export default function CandidatView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidat, setCandidat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getUtilisateurById(id)
      .then(setCandidat)
      .catch(() => setError('Impossible de charger le profil de ce candidat.'))
      .finally(() => setLoading(false));
  }, [id]);

  const contractLabel = (type) => {
    if (!type) return null;
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="candidat-page">
        <div className="candidat-card">
          <div className="candidat-loading">Chargement du profil...</div>
        </div>
      </div>
    );
  }

  if (error || !candidat) {
    return (
      <div className="candidat-page">
        <div className="candidat-card">
          <p className="candidat-error">{error || 'Candidat introuvable.'}</p>
          <button className="candidat-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidat-page">
      <div className="candidat-card">

        <button className="candidat-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="candidat-header">
          <div className="candidat-avatar">
            <User size={36} />
          </div>
          <div className="candidat-identity">
            <h1 className="candidat-name">{candidat.prenom} {candidat.nom}</h1>
            {candidat.formation && (
              <p className="candidat-formation">{candidat.formation}</p>
            )}
            {candidat.contract_type && (
              <span className="candidat-badge">{contractLabel(candidat.contract_type)}</span>
            )}
          </div>
        </div>

        {candidat.bio && (
          <div className="candidat-section">
            <p className="candidat-bio">{candidat.bio}</p>
          </div>
        )}

        <div className="candidat-section">
          <h2 className="candidat-section-title">Formation</h2>
          <div className="candidat-infos">
            {candidat.study_level && (
              <div className="candidat-info-item">
                <GraduationCap size={16} />
                <span>{candidat.study_level}</span>
              </div>
            )}
            {candidat.study_place && (
              <div className="candidat-info-item">
                <BookOpen size={16} />
                <span>{candidat.study_place}</span>
              </div>
            )}
            {candidat.contract_type && (
              <div className="candidat-info-item">
                <Briefcase size={16} />
                <span>Recherche : {contractLabel(candidat.contract_type)}</span>
              </div>
            )}
            {candidat.city && (
              <div className="candidat-info-item">
                <MapPin size={16} />
                <span>{candidat.city}{candidat.zip_code ? ` (${candidat.zip_code})` : ''}</span>
              </div>
            )}
          </div>
        </div>

        <div className="candidat-section">
          <h2 className="candidat-section-title">Contact</h2>
          <div className="candidat-infos">
            {candidat.mail && (
              <div className="candidat-info-item">
                <Mail size={16} />
                <a href={`mailto:${candidat.mail}`}>{candidat.mail}</a>
              </div>
            )}
            {candidat.tel && (
              <div className="candidat-info-item">
                <Phone size={16} />
                <span>{candidat.tel}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
