import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronDown, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building, 
  User, 
  Mail, 
  Inbox, 
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);
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

  const filteredDemandes = demandes.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (isRecruiter) {
      return `${d.candidat_prenom || ''} ${d.candidat_nom || ''}`.toLowerCase().includes(q)
        || (d.candidat_mail || '').toLowerCase().includes(q)
        || (d.titre || '').toLowerCase().includes(q);
    }
    return (d.titre || '').toLowerCase().includes(q)
      || (d.entreprise || '').toLowerCase().includes(q)
      || (d.type || '').toLowerCase().includes(q)
      || (d.localisation || '').toLowerCase().includes(q);
  });

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

  const getStatusConfig = (statut) => {
    const normalized = (statut || '').toLowerCase();
    if (normalized === 'acceptée' || normalized === 'acceptee') {
      return {
        className: 'status-badge--success',
        icon: <CheckCircle2 size={13} aria-hidden="true" focusable="false" />,
        ariaLabel: `Statut : ${statut}`
      };
    }
    if (normalized === 'refusée' || normalized === 'refusee') {
      return {
        className: 'status-badge--danger',
        icon: <XCircle size={13} aria-hidden="true" focusable="false" />,
        ariaLabel: `Statut : ${statut}`
      };
    }
    return {
      className: 'status-badge--pending',
      icon: <Clock size={13} aria-hidden="true" focusable="false" />,
      ariaLabel: `Statut : ${statut || 'En attente'}`
    };
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

        {!loading && !error && (
          <div className="demandes-search" role="search">
            <label htmlFor="demandes-search-input" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              {isRecruiter ? 'Filtrer les candidats ou les offres' : 'Filtrer vos candidatures par offre ou entreprise'}
            </label>
            <input
              id="demandes-search-input"
              type="search"
              className="demandes-search__input"
              placeholder={isRecruiter ? 'Rechercher un candidat, une offre...' : 'Rechercher une offre, une entreprise...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {loading && (
          <div className="empty-state" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true"></div>
            <p>Chargement du suivi en cours...</p>
          </div>
        )}

        {!loading && error && (
          <div className="form-alert form-alert--error" role="alert">
            <span aria-hidden="true">&#128682;</span>
            <div>{error}</div>
          </div>
        )}

        {!loading && !error && filteredDemandes.length === 0 && (
          <div className="empty-state">
            <Inbox size={40} className="empty-state__icon" aria-hidden="true" focusable="false" />
            <h3>{searchQuery.trim() ? 'Aucun résultat' : 'Aucune demande pour le moment'}</h3>
            <p>
              {searchQuery.trim()
                ? `Aucune correspondance pour « ${searchQuery} ».`
                : isRecruiter
                  ? 'Vous n\'avez reçu aucune candidature sur vos offres pour l\'instant.'
                  : 'Vous n\'avez pas encore postulé à une offre. Rendez-vous sur la page Offres pour candidater.'}
            </p>
          </div>
        )}

        {!loading && !error && filteredDemandes.length > 0 && (
          <div className="demandes-panel" role="region" aria-label="Liste de vos candidatures">
            <div className="demande-row demande-row--header" aria-hidden="true">
              <span className="col col--titre">Nom offre</span>
              <span className="col col--info">{isRecruiter ? 'Candidat' : 'Localisation'}</span>
              <span className="col col--date">Date d'envoi</span>
              <span className="col col--statut">Statut</span>
              <span className="col col--chevron"></span>
            </div>

            {filteredDemandes.map((demande) => {
              const isExpanded = expandedIds.has(demande.id_demande);
              const statusCfg = getStatusConfig(demande.demande);
              const detailsId = `demande-details-${demande.id_demande}`;

              return (
                <div key={demande.id_demande} className={`demande-row ${isExpanded ? 'is-expanded' : ''}`}>
                  <button
                    type="button"
                    className="demande-row__summary"
                    onClick={() => toggleExpanded(demande.id_demande)}
                    aria-expanded={isExpanded}
                    aria-controls={detailsId}
                  >
                    <span className="col col--titre">{demande.titre || 'Offre supprimée'}</span>
                    <span className="col col--info">
                      {isRecruiter
                        ? `${demande.candidat_prenom || ''} ${demande.candidat_nom || ''}`.trim() || 'Candidat inconnu'
                        : demande.localisation || 'Non renseignée'}
                    </span>
                    <span className="col col--date">{formatDateDisplay(demande.date_envoi)}</span>
                    <span className="col col--statut">
                      <span className={`status-badge ${statusCfg.className}`} aria-label={statusCfg.ariaLabel}>
                        {statusCfg.icon}
                        <span>{demande.demande || 'En attente'}</span>
                      </span>
                    </span>
                    <span className="col col--chevron" aria-hidden="true">
                      <ChevronDown size={18} className="chevron-icon" focusable="false" />
                    </span>
                  </button>

                  {isExpanded && (
                    <div id={detailsId} className="demande-row__details">
                      <div className="detail-item">
                        <Briefcase size={15} aria-hidden="true" focusable="false" />
                        <span>Type de contrat : {demande.type || 'Non renseigné'}</span>
                      </div>
                      {isRecruiter ? (
                        <div className="detail-item">
                          <Mail size={15} aria-hidden="true" focusable="false" />
                          <span>Email du candidat : {demande.candidat_mail || 'Non renseigné'}</span>
                        </div>
                      ) : (
                        demande.entreprise && (
                          <div className="detail-item">
                            <Building size={15} aria-hidden="true" focusable="false" />
                            <span>Entreprise : {demande.entreprise}</span>
                          </div>
                        )
                      )}
                      {!isRecruiter && demande.localisation && (
                        <div className="detail-item">
                          <MapPin size={15} aria-hidden="true" focusable="false" />
                          <span>Localisation : {demande.localisation}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <Calendar size={15} aria-hidden="true" focusable="false" />
                        <span>Envoyée le : {formatDateDisplay(demande.date_envoi)}</span>
                      </div>

                      <button
                        type="button"
                        className="chat-trigger-btn"
                        onClick={() => setChatDemande(demande)}
                        aria-label={`Ouvrir la discussion avec ${isRecruiter ? (demande.candidat_prenom || 'le candidat') : (demande.entreprise || "l'entreprise")}`}
                      >
                        <MessageCircle size={16} aria-hidden="true" focusable="false" /> Discuter avec {isRecruiter ? 'le candidat' : "l'entreprise"}
                      </button>

                      {isRecruiter && (
                        <div className="detail-actions">
                          <span className="detail-actions__label" id={`label-statut-${demande.id_demande}`}>
                            <User size={14} aria-hidden="true" focusable="false" /> Mettre à jour le statut :
                          </span>
                          <div
                            className="detail-actions__buttons"
                            role="group"
                            aria-labelledby={`label-statut-${demande.id_demande}`}
                          >
                            {STATUTS_RECRUTEUR.map((statut) => {
                              const btnCfg = getStatusConfig(statut);
                              const isCurrent = demande.demande === statut;
                              return (
                                <button
                                  key={statut}
                                  type="button"
                                  className={`status-pill ${isCurrent ? 'status-pill--active' : ''} ${btnCfg.className}`}
                                  disabled={statutUpdating === demande.id_demande}
                                  aria-pressed={isCurrent}
                                  onClick={() => handleStatusChange(demande.id_demande, statut)}
                                >
                                  {btnCfg.icon}
                                  <span>{statut}</span>
                                </button>
                              );
                            })}
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