import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  FileText, 
  Send, 
  Filter, 
  Upload, 
  ArrowLeft, 
  User, 
  MapPin, 
  ChevronRight, 
  Building 
} from 'lucide-react';
import { getOffres, createOffre, updateOffre, deleteOffre } from '../services/offreService';
import { getEntrepriseById } from '../services/entrepriseService';
import { createDemande } from '../services/demandeService';
import Button from '../components/common/Button/Button';
import { toast } from '../components/common/Toast/toast';
import './OffresView.scss';

export default function OffresView() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [recruiterEntreprise, setRecruiterEntreprise] = useState(null);

  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    if (q) setSearchQuery(q);
    if (type && ['Stage', 'Alternance', 'Tous'].includes(type)) setSelectedType(type);
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState('list');
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applyForm, setApplyForm] = useState({ cvUploaded: false, lmText: '' });

  const [formOffer, setFormOffer] = useState({
    id_offre: null,
    titre: '',
    type: 'Stage',
    remuneration: '',
    date_send: '',
    date_stop: '',
    description: '',
    id_entreprise: null,
  });

  useEffect(() => {
    const syncUser = () => {
      const storedToken = localStorage.getItem('talis_token');
      const rawUser = localStorage.getItem('talis_user');
      setToken(storedToken);
      if (storedToken && rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          setCurrentUser(parsed);
          setFormOffer((prev) => ({
            ...prev,
            id_entreprise: prev.id_entreprise || parsed.id_entreprise || null,
          }));
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'entreprise' && currentUser?.id_entreprise) {
      getEntrepriseById(currentUser.id_entreprise)
        .then((entreprise) => setRecruiterEntreprise(entreprise))
        .catch((err) => {
          console.error('Fetch recruiter entreprise error:', err);
          toast.error('Impossible de récupérer les informations de votre entreprise.');
          setRecruiterEntreprise(null);
        });
    } else {
      setRecruiterEntreprise(null);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchOffers();
  }, [activeTab]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id || offres.length === 0) return;
    const found = offres.find((o) => String(o.id_offre) === id);
    if (found) setSelectedOffre(found);
  }, [searchParams, offres]);

  const fetchOffers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOffres();
      setOffres(data || []);
    } catch (err) {
      console.error('Fetch offers error:', err);
      setError('Impossible de charger les offres. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const availableTypes = ['Tous', 'Stage', 'Alternance'];

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formOffer.titre.trim()) {
      toast.error('Le titre de l\'offre est obligatoire.');
      return;
    }
    if (!formOffer.type) {
      toast.error('Le type d\'offre est obligatoire.');
      return;
    }
    if (formOffer.date_send && formOffer.date_stop && new Date(formOffer.date_stop) < new Date(formOffer.date_send)) {
      toast.error('La date de fin doit être supérieure ou égale à la date de début.');
      return;
    }
    if (!formOffer.description.trim()) {
      toast.error('La description détaillée est obligatoire.');
      return;
    }
    if (!formOffer.id_entreprise) {
      toast.error('Impossible de déterminer votre entreprise. Reconnectez-vous puis réessayez.');
      return;
    }

    try {
      if (activeTab === 'edit' && formOffer.id_offre) {
        await updateOffre(formOffer.id_offre, formOffer, token);
        toast.success('L\'offre a été mise à jour avec succès !');
      } else {
        await createOffre(formOffer, token);
        toast.success('L\'offre a été publiée avec succès !');
      }

      resetForm();
      setActiveTab('list');
    } catch (err) {
      console.error('Submit offer error:', err);
      toast.error(err.message || 'Une erreur est survenue lors de l\'enregistrement.');
    }
  };

  const resetForm = () => {
    setFormOffer({
      id_offre: null,
      titre: '',
      type: 'Stage',
      remuneration: '',
      date_send: '',
      date_stop: '',
      description: '',
      id_entreprise: currentUser?.id_entreprise || null,
    });
  };

  const startEditOffer = (offre) => {
    const formatDateInput = (dateStr) => {
      if (!dateStr) return '';
      try {
        const d = new Date(dateStr);
        return d.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };

    setFormOffer({
      id_offre: offre.id_offre,
      titre: offre.titre || '',
      type: offre.type || 'Stage',
      remuneration: offre.remuneration || '',
      date_send: formatDateInput(offre.date_send),
      date_stop: formatDateInput(offre.date_stop),
      description: offre.description || '',
      id_entreprise: offre.id_entreprise || currentUser?.id_entreprise || null,
    });
    setActiveTab('edit');
    setSelectedOffre(null);
  };

  const handleDeleteOffer = async (idOffre) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.')) {
      return;
    }

    try {
      await deleteOffre(idOffre, token);
      toast.success('Offre supprimée avec succès.');
      fetchOffers();
      if (selectedOffre?.id_offre === idOffre) {
        setSelectedOffre(null);
      }
    } catch (err) {
      toast.error(err.message || 'Une erreur est survenue lors de la suppression.');
    }
  };

  const handleMockCVUpload = () => {
    setApplyForm((prev) => ({ ...prev, cvUploaded: true }));
  };

  const submitCandidature = async (e) => {
    e.preventDefault();
    if (!applyForm.cvUploaded) {
      toast.warning('Veuillez sélectionner un CV (PDF ou DOCX).');
      return;
    }
    if (!currentUser?.id) {
      toast.error('Vous devez être connecté en tant que candidat pour postuler.');
      return;
    }

    try {
      await createDemande({ id_user: currentUser.id, id_offre: selectedOffre.id_offre }, token);
      toast.success('Votre candidature a bien été envoyée ! Vous pouvez suivre son statut dans l\'onglet "Demandes".');
      setIsApplying(false);
      setSelectedOffre(null);
      setApplyForm({ cvUploaded: false, lmText: '' });
    } catch (err) {
      console.error('Submit candidature error:', err);
      toast.error(
        err.message === 'Une demande existe déjà pour ce user et cette offre.'
          ? 'Vous avez déjà postulé à cette offre.'
          : (err.message || 'Une erreur est survenue lors de l\'envoi de votre candidature.')
      );
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Non définie';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const isRecruiter = currentUser?.role === 'entreprise';

  const filteredOffres = offres.filter((item) => {
    const matchesSearch =
      item.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'Tous' || item.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="offres-container" id="offers-main-view">
      <div className="offres-inner">
        {/* En-tête de section */}
        <section className="offres-hero" id="offers-banner">
          <div className="offres-hero__content">
            <span className="badge-category purple">PORTAIL TALIS</span>
            <h1 className="offres-hero__title">
              {isRecruiter ? 'Tableau des Recruteurs' : 'Opportunités Exceptionnelles'}
            </h1>
            <p className="offres-hero__subtitle">
              {isRecruiter
                ? 'Publiez et gérez vos offres de Stage, d\'Alternance et d\'Emploi pour trouver vos futurs talents.'
                : 'Trouvez le stage, l\'alternance, ou le poste idéal pour propulser votre carrière avec Talis.'}
            </p>

            <div className="offres-hero__nav" id="offers-navbar-panel">
              {isRecruiter && (
                <div className="recruiter-controls">
                  {activeTab === 'list' ? (
                    <Button
                      variant="primary"
                      id="btn-nav-create-offer"
                      onClick={() => { resetForm(); setActiveTab('create'); }}
                    >
                      <Plus size={18} className="btn-icon" aria-hidden="true" focusable="false" /> Publier une offre
                    </Button>
                  ) : (
                    <Button
                      variant="accent"
                      id="btn-nav-view-offers"
                      onClick={() => setActiveTab('list')}
                    >
                      <ArrowLeft size={18} className="btn-icon" aria-hidden="true" focusable="false" /> Voir les offres
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Espace de travail principal */}
        <div className="workspace-layout">
          {/* Création / Modification offre (Recruteur) */}
          {(activeTab === 'create' || activeTab === 'edit') && isRecruiter && (
            <div className="form-wrapper animate-fade-in" id="offer-form-workspace">
              <div className="form-card">
                <div className="form-card__header">
                  <h2>{activeTab === 'edit' ? "Modifier l'offre" : "Créer une nouvelle offre d'emploi"}</h2>
                  <p>Complétez les informations suivantes pour diffuser votre annonce.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="offre-form" id="recruiter-post-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="form-titre">Intitulé du poste *</label>
                      <input
                        type="text"
                        id="form-titre"
                        name="titre"
                        placeholder="e.g. Concepteur Développeur d'Applications"
                        value={formOffer.titre}
                        onChange={(e) => setFormOffer({ ...formOffer, titre: e.target.value })}
                        required
                        aria-required="true"
                      />
                    </div>

                    <div className="form-group">
                      <label id="label-readonly-company">Entreprise</label>
                      <div className="readonly-field" aria-labelledby="label-readonly-company">
                        <Building size={16} aria-hidden="true" focusable="false" />
                        <span>
                          {recruiterEntreprise?.nom
                            ? `${recruiterEntreprise.nom}${recruiterEntreprise.ville ? ` — ${recruiterEntreprise.ville}` : ''}`
                            : 'Chargement…'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="form-type">Type de contrat *</label>
                      <select
                        id="form-type"
                        name="type"
                        value={formOffer.type}
                        onChange={(e) => setFormOffer({ ...formOffer, type: e.target.value })}
                        className="custom-select"
                        required
                        aria-required="true"
                      >
                        <option value="Stage">Stage</option>
                        <option value="Alternance">Alternance</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="form-remuneration">Rémunération mensuelle brute (€)</label>
                      <div className="input-with-icon">
                        <span className="input-icon-prefix">
                          <DollarSign size={16} aria-hidden="true" focusable="false" />
                        </span>
                        <input
                          type="number"
                          id="form-remuneration"
                          name="remuneration"
                          placeholder="e.g. 1100"
                          value={formOffer.remuneration}
                          onChange={(e) => setFormOffer({ ...formOffer, remuneration: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="form-date-send">Date d'embauche / publication</label>
                      <input
                        type="date"
                        id="form-date-send"
                        name="date_send"
                        value={formOffer.date_send}
                        onChange={(e) => setFormOffer({ ...formOffer, date_send: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="form-date-stop">Date de clôture</label>
                      <input
                        type="date"
                        id="form-date-stop"
                        name="date_stop"
                        value={formOffer.date_stop}
                        onChange={(e) => setFormOffer({ ...formOffer, date_stop: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="form-description">Description complète de l'opportunité *</label>
                    <textarea
                      id="form-description"
                      name="description"
                      rows="8"
                      placeholder="Présentez les missions principales, le profil recherché, l'environnement de travail et les avantages de ce poste..."
                      value={formOffer.description}
                      onChange={(e) => setFormOffer({ ...formOffer, description: e.target.value })}
                      required
                      aria-required="true"
                    ></textarea>
                  </div>

                  <div className="form-actions-bar">
                    <Button
                      variant="accent"
                      id="btn-cancel-post"
                      onClick={() => { resetForm(); setActiveTab('list'); }}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      id="btn-submit-post"
                    >
                      {activeTab === 'edit' ? 'Enregistrer les modifications' : 'Publier l\'annonce'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Consultation et liste des offres */}
          {activeTab === 'list' && (
            <div className="list-wrapper animate-fade-in" id="offers-list-universe">
              {/* Panneau de recherche et filtres accessible */}
              <div className="filter-panel" id="offers-search-filter-panel" role="search">
                <div className="search-bar-wrapper">
                  <label
                    htmlFor="search-input-offers"
                    className="sr-only"
                    style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
                  >
                    Rechercher par mot-clé, titre de poste ou technologies
                  </label>
                  <Search size={18} className="search-icon" aria-hidden="true" focusable="false" />
                  <input
                    type="search"
                    placeholder="Rechercher par mot-clé, titre de poste ou technologies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="search-input-offers"
                  />
                </div>

                <div className="scrollable-filters-row">
                  <span className="filters-label" id="filter-contract-label">
                    <Filter size={14} className="filter-prefix" aria-hidden="true" focusable="false" /> Contrat :
                  </span>
                  <div className="pills-container" role="group" aria-labelledby="filter-contract-label">
                    {availableTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`pill ${selectedType === type ? 'pill--active' : ''}`}
                        onClick={() => setSelectedType(type)}
                        aria-pressed={selectedType === type}
                        id={`pill-filter-${type}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* État de chargement */}
              {loading && (
                <div className="empty-state" role="status" aria-live="polite" id="loading-spinner-view">
                  <div className="spinner" aria-hidden="true"></div>
                  <p>Chargement des opportunités en cours...</p>
                </div>
              )}

              {/* État d'erreur */}
              {!loading && error && (
                <div className="form-alert form-alert--error shadow-soft max-width-600 center-margin" role="alert">
                  <span aria-hidden="true">&#128682;</span>
                  <div>{error}</div>
                </div>
              )}

              {/* Grille des offres */}
              {!loading && !error && (
                <>
                  {filteredOffres.length === 0 ? (
                    <div className="empty-state" id="empty-state-fallback">
                      <Briefcase size={48} className="empty-state__icon text-light" aria-hidden="true" focusable="false" />
                      <h3>Aucune offre ne correspond à vos critères</h3>
                      <p>Réessayez en modifiant vos mots-clés ou le filtre de recherche de contrat.</p>
                      <Button variant="accent" onClick={() => { setSearchQuery(''); setSelectedType('Tous'); }}>
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  ) : (
                    <div className="offers-grid" id="offers-cards-grid" role="region" aria-label="Liste des opportunités">
                      {filteredOffres.map((offre) => {
                        const lowerType = (offre.type || '').toLowerCase();
                        const typeClass =
                          lowerType === 'stage'
                            ? 'green'
                            : lowerType === 'alternance'
                            ? 'purple'
                            : lowerType === 'cdi'
                            ? 'accent'
                            : 'dark';

                        return (
                          <div
                            key={offre.id_offre}
                            className="job-card"
                            tabIndex="0"
                            role="button"
                            aria-label={`Consulter l'offre ${offre.titre} chez ${offre.entreprise || 'Entreprise anonyme'}`}
                            onClick={() => setSelectedOffre(offre)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedOffre(offre);
                              }
                            }}
                            id={`job-card-${offre.id_offre}`}
                          >
                            <div className="job-card__header">
                              <span className={`badge-category ${typeClass}`}>
                                {offre.type || 'Stage'}
                              </span>

                              {isRecruiter && (
                                <div
                                  className="action-buttons-overlay"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    className="action-btn action-btn--edit"
                                    aria-label={`Modifier l'offre ${offre.titre}`}
                                    onClick={() => startEditOffer(offre)}
                                    id={`edit-btn-${offre.id_offre}`}
                                  >
                                    <Edit size={14} aria-hidden="true" focusable="false" />
                                  </button>
                                  <button
                                    type="button"
                                    className="action-btn action-btn--delete"
                                    aria-label={`Supprimer l'offre ${offre.titre}`}
                                    onClick={() => handleDeleteOffer(offre.id_offre)}
                                    id={`delete-btn-${offre.id_offre}`}
                                  >
                                    <Trash2 size={14} aria-hidden="true" focusable="false" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <h3 className="job-card__title">{offre.titre}</h3>

                            {offre.entreprise && (
                              <div className="job-card__company">
                                <Building size={14} className="company-icon" aria-hidden="true" focusable="false" />
                                <span>{offre.entreprise}</span>
                              </div>
                            )}

                            <div className="job-card__metadata">
                              {offre.localisation && (
                                <div className="meta-item">
                                  <MapPin size={14} aria-hidden="true" focusable="false" />
                                  <span>{offre.localisation}</span>
                                </div>
                              )}
                              {offre.remuneration && (
                                <div className="meta-item">
                                  <DollarSign size={14} aria-hidden="true" focusable="false" />
                                  <span>{offre.remuneration} € / mois</span>
                                </div>
                              )}
                              <div className="meta-item">
                                <Calendar size={14} aria-hidden="true" focusable="false" />
                                <span>Clôture le {formatDateDisplay(offre.date_stop)}</span>
                              </div>
                            </div>

                            <p className="job-card__snippet">
                              {offre.description && offre.description.length > 140
                                ? `${offre.description.substring(0, 140)}...`
                                : offre.description || 'Aucune description fournie.'}
                            </p>

                            <div className="job-card__footer">
                              <span className="view-more-trigger" aria-hidden="true">
                                Consulter la fiche <ChevronRight size={14} focusable="false" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Panneau modale d'affichage / candidature */}
      {selectedOffre && (
        <div
          className="modal-backdrop show"
          onClick={() => { setSelectedOffre(null); setIsApplying(false); }}
          role="presentation"
        >
          <div
            className="modal-content side-drawer animate-slide-left"
            onClick={(e) => e.stopPropagation()}
            id={`offer-drawer-${selectedOffre.id_offre}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-offer-title"
          >
            <div className="drawer-header">
              <span className={`badge-category ${
                (selectedOffre.type || '').toLowerCase() === 'stage'
                  ? 'green'
                  : (selectedOffre.type || '').toLowerCase() === 'alternance'
                  ? 'purple'
                  : (selectedOffre.type || '').toLowerCase() === 'cdi'
                  ? 'accent'
                  : 'dark'
              }`}>
                {selectedOffre.type}
              </span>
              <button
                type="button"
                className="close-drawer"
                onClick={() => { setSelectedOffre(null); setIsApplying(false); }}
                aria-label="Fermer la fiche de l'offre"
                id="drawer-close-btn"
              >
                <X size={24} aria-hidden="true" focusable="false" />
              </button>
            </div>

            {!isApplying ? (
              <div className="drawer-body">
                <h2 id="drawer-offer-title" className="offer-detailed-title">{selectedOffre.titre}</h2>

                <div className="offer-tags-box">
                  {selectedOffre.entreprise && (
                    <div className="tag-element tag-element--primary">
                      <Building size={16} aria-hidden="true" focusable="false" />
                      <span>Entreprise : <strong>{selectedOffre.entreprise}</strong></span>
                    </div>
                  )}
                  <div className="tag-element">
                    <Briefcase size={16} aria-hidden="true" focusable="false" />
                    <span>Contrat : {selectedOffre.type}</span>
                  </div>
                  {selectedOffre.localisation && (
                    <div className="tag-element">
                      <MapPin size={16} aria-hidden="true" focusable="false" />
                      <span>Localisation : {selectedOffre.localisation}</span>
                    </div>
                  )}
                  {selectedOffre.remuneration && (
                    <div className="tag-element">
                      <DollarSign size={16} aria-hidden="true" focusable="false" />
                      <span>Gratification / Salaire : {selectedOffre.remuneration} € / mois</span>
                    </div>
                  )}
                  <div className="tag-element">
                    <Calendar size={16} aria-hidden="true" focusable="false" />
                    <span>Publié le : {formatDateDisplay(selectedOffre.date_send)}</span>
                  </div>
                  <div className="tag-element">
                    <Calendar size={16} aria-hidden="true" focusable="false" />
                    <span>Fin des candidatures : {formatDateDisplay(selectedOffre.date_stop)}</span>
                  </div>
                </div>

                <div className="offer-separator" aria-hidden="true"></div>

                <div className="offer-rich-description">
                  <h3>MISSIONS & DESCRIPTION</h3>
                  <div className="description-text">
                    {selectedOffre.description ? (
                      selectedOffre.description.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))
                    ) : (
                      <p>Aucune description détaillée n'a été spécifiée.</p>
                    )}
                  </div>
                </div>

                <div className="drawer-footer-actions">
                  {currentUser?.role === 'entreprise' ? (
                    <div className="recruiter-footer-actions">
                      <Button variant="primary" onClick={() => startEditOffer(selectedOffre)}>
                        <Edit size={16} className="btn-icon" aria-hidden="true" focusable="false" /> Modifier l'annonce
                      </Button>
                      <Button variant="accent" onClick={() => handleDeleteOffer(selectedOffre.id_offre)}>
                        <Trash2 size={16} className="btn-icon" aria-hidden="true" focusable="false" /> Supprimer
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      id="btn-trigger-apply"
                      size="lg"
                      onClick={() => setIsApplying(true)}
                    >
                      Postuler à cette offre <Send size={16} className="btn-icon-right" aria-hidden="true" focusable="false" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="drawer-body drawer-body--apply animate-fade-in" id="apply-interactive-space">
                <button
                  type="button"
                  className="back-to-offer"
                  onClick={() => setIsApplying(false)}
                >
                  <ArrowLeft size={16} aria-hidden="true" focusable="false" /> Retour à l'annonce
                </button>

                <h2 id="drawer-offer-title" className="offer-detailed-title">Postuler pour : {selectedOffre.titre}</h2>
                <p className="intro-text">
                  Détaillez votre candidature ci-dessous. Le recruteur la recevra directement avec votre profil TALIS.
                </p>

                <form onSubmit={submitCandidature} className="apply-form" id="student-submit-candidature">
                  <div className="author-prefill-card">
                    <span className="prefill-title">PROFIL COMPTE</span>
                    <div className="prefill-row">
                      <User size={16} className="text-light" aria-hidden="true" focusable="false" />
                      <span>
                        {currentUser
                          ? `${currentUser.prenom || ''} ${currentUser.nom || ''}`
                          : 'Candidat invité / non connecté'}
                      </span>
                    </div>
                    <div className="prefill-row">
                      <span>Email : {currentUser ? currentUser.mail : 'visiteur@talis.fr'}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label id="label-cv-upload">Votre Curriculum Vitae (CV) *</label>
                    <div
                      className={`upload-zone ${applyForm.cvUploaded ? 'upload-zone--uploaded' : ''}`}
                      onClick={handleMockCVUpload}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleMockCVUpload();
                        }
                      }}
                      tabIndex="0"
                      role="button"
                      aria-labelledby="label-cv-upload"
                      id="cv-upload-zone"
                    >
                      {applyForm.cvUploaded ? (
                        <div className="uploaded-file-details">
                          <FileText size={42} className="text-emerald" aria-hidden="true" focusable="false" />
                          <div className="file-info">
                            <span className="file-name">CV_Talis_Candidate.pdf</span>
                            <span className="file-size">1.2 MB • Prêt de démonstration</span>
                          </div>
                          <span className="change-btn">Changer</span>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <Upload size={36} className="upload-placeholder__icon" aria-hidden="true" focusable="false" />
                          <p className="upload-main-text">
                            Glissez-déposez votre CV ici, ou <span className="highlight">parcourez vos fichiers</span>
                          </p>
                          <p className="upload-sub-text">Formats acceptés : PDF, DOCX (Max 5Mo)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="lm-textarea">Lettre de motivation ou Note d'accompagnement *</label>
                    <textarea
                      id="lm-textarea"
                      rows="6"
                      value={applyForm.lmText}
                      onChange={(e) => setApplyForm({ ...applyForm, lmText: e.target.value })}
                      placeholder="Indiquez au recruteur vos motivations pour ce poste et vos disponibilités de début..."
                      required
                      aria-required="true"
                    ></textarea>
                  </div>

                  <div className="form-actions-bar">
                    <Button variant="accent" onClick={() => setIsApplying(false)}>
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      id="submit-cand-btn"
                      disabled={applyForm.cvUploaded === false}
                    >
                      Soumettre ma candidature
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}