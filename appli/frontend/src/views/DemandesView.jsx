import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, MapPin, Calendar, Briefcase, Building, User, Mail, Inbox, MessageCircle } from 'lucide-react';
import { getDemandesByUser, getDemandesByEntreprise, updateDemandeStatut } from '../services/demandeService';
import { toast } from '../components/common/Toast/toast';
import ChatDrawer from '../components/chat/ChatDrawer';
import './DemandesView.scss';

const STATUTS_RECRUTEUR = ['En attente', 'Acceptée', 'Refusée'];

export default function DemandesView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [statutUpdating, setStatutUpdating] = useState(null);
  const [chatDemande, setChatDemande] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('talis_user');
    const storedToken = localStorage.getItem('talis_token');

    if (!rawUser || !storedToken) {
      navigate('/login');
      return;
    }

    try {
      setCurrentUser(JSON.parse(rawUser));
      setToken(storedToken);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;
    fetchDemandes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const isRecruiter = currentUser?.role === 'entreprise';

  const fetchDemandes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = isRecruiter
        ? await getDemandesByEntreprise(currentUser.id_entreprise, token)
        : await getDemandesByUser(currentUser.id, token);
      setDemandes(data || []);
    } catch (err) {
      console.error('Fetch demandes error:', err);
      setError('Impossible de charger le suivi des demandes. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (idDemande) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(idDemande)) {
        next.delete(idDemande);
      } else {
        next.add(idDemande);
      }
      return next;
    });
  };

  const handleStatusChange = async (idDemande, statut) => {
    setStatutUpdating(idDemande);
    try {
      await updateDemandeStatut(idDemande, statut, token);
      setDemandes((prev) => prev.map((d) => (d.id_demande === idDemande ? { ...d, demande: statut } : d)));
      toast.success(`Statut mis à jour : ${statut}.`);
    } catch (err) {
      toast.error(err.message || 'Une erreur est survenue lors de la mise à jour du statut.');
    } finally {
      setStatutUpdating(null);
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Non renseignée';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const statusClass = (statut) => {
    const normalized = (statut || '').toLowerCase();
    if (normalized === 'acceptée' || normalized === 'acceptee') return 'status-badge--success';
    if (normalized === 'refusée' || normalized === 'refusee') return 'status-badge--danger';
    return 'status-badge--pending';
  };

  return (
    <div className="demandes-container">
      <div className="demandes-inner">
      <h1 className="demandes-title">Panneau de contrôle</h1>
      <p className="demandes-subtitle">
        {isRecruiter
          ? 'Suivez les candidatures reçues sur les offres de votre entreprise.'
          : 'Suivez le statut de vos candidatures envoyées.'}
      </p>

      {loading && (
        <div className="empty-state">
          <div className="spinner"></div>
          <p>Chargement du suivi en cours...</p>
        </div>
      )}

      {!loading && error && (
        <div className="form-alert form-alert--error">
          <span>&#128682;</span>
          <div>{error}</div>
        </div>
      )}

      {!loading && !error && demandes.length === 0 && (
        <div className="empty-state">
          <Inbox size={40} className="empty-state__icon" />
          <h3>Aucune demande pour le moment</h3>
          <p>
            {isRecruiter
              ? 'Vous n\'avez reçu aucune candidature sur vos offres pour l\'instant.'
              : 'Vous n\'avez pas encore postulé à une offre. Rendez-vous sur la page Offres pour candidater.'}
          </p>
        </div>
      )}

      {!loading && !error && demandes.length > 0 && (
        <div className="demandes-panel">
          <div className="demande-row demande-row--header">
            <span className="col col--titre">Nom offre</span>
            <span className="col col--info">{isRecruiter ? 'Candidat' : 'Localisation'}</span>
            <span className="col col--date">Date d'envoie</span>
            <span className="col col--statut">Statut</span>
            <span className="col col--chevron"></span>
          </div>

          {demandes.map((demande) => {
            const isExpanded = expandedIds.has(demande.id_demande);
            return (
              <div key={demande.id_demande} className={`demande-row ${isExpanded ? 'is-expanded' : ''}`}>
                <button
                  type="button"
                  className="demande-row__summary"
                  onClick={() => toggleExpanded(demande.id_demande)}
                  aria-expanded={isExpanded}
                >
                  <span className="col col--titre">{demande.titre || 'Offre supprimée'}</span>
                  <span className="col col--info">
                    {isRecruiter
                      ? `${demande.candidat_prenom || ''} ${demande.candidat_nom || ''}`.trim() || 'Candidat inconnu'
                      : demande.localisation || 'Non renseignée'}
                  </span>
                  <span className="col col--date">{formatDateDisplay(demande.date_envoi)}</span>
                  <span className="col col--statut">
                    <span className={`status-badge ${statusClass(demande.demande)}`}>{demande.demande}</span>
                  </span>
                  <span className="col col--chevron">
                    <ChevronDown size={18} className="chevron-icon" />
                  </span>
                </button>

                {isExpanded && (
                  <div className="demande-row__details">
                    <div className="detail-item">
                      <Briefcase size={15} />
                      <span>Type de contrat : {demande.type || 'Non renseigné'}</span>
                    </div>
                    {isRecruiter ? (
                      <div className="detail-item">
                        <Mail size={15} />
                        <span>Email du candidat : {demande.candidat_mail || 'Non renseigné'}</span>
                      </div>
                    ) : (
                      demande.entreprise && (
                        <div className="detail-item">
                          <Building size={15} />
                          <span>Entreprise : {demande.entreprise}</span>
                        </div>
                      )
                    )}
                    {!isRecruiter && demande.localisation && (
                      <div className="detail-item">
                        <MapPin size={15} />
                        <span>Localisation : {demande.localisation}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <Calendar size={15} />
                      <span>Envoyée le : {formatDateDisplay(demande.date_envoi)}</span>
                    </div>

                    <button
                      type="button"
                      className="chat-trigger-btn"
                      onClick={() => setChatDemande(demande)}
                    >
                      <MessageCircle size={16} /> Discuter avec {isRecruiter ? 'le candidat' : "l'entreprise"}
                    </button>

                    {isRecruiter && (
                      <div className="detail-actions">
                        <span className="detail-actions__label">
                          <User size={14} /> Mettre à jour le statut :
                        </span>
                        <div className="detail-actions__buttons">
                          {STATUTS_RECRUTEUR.map((statut) => (
                            <button
                              key={statut}
                              type="button"
                              className={`status-pill ${demande.demande === statut ? 'status-pill--active' : ''} ${statusClass(statut)}`}
                              disabled={statutUpdating === demande.id_demande}
                              onClick={() => handleStatusChange(demande.id_demande, statut)}
                            >
                              {statut}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>

      {chatDemande && (
        <ChatDrawer
          key={chatDemande.id_demande}
          demande={chatDemande}
          isRecruiter={isRecruiter}
          currentUser={currentUser}
          token={token}
          onClose={() => setChatDemande(null)}
        />
      )}
    </div>
  );
}
