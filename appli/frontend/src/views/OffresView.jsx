import React, { useEffect, useState } from 'react';
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
  // Authentication status
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [recruiterEntreprise, setRecruiterEntreprise] = useState(null); // { nom, ville } de l'entreprise du recruteur connecté

  // Offers lists & filters state
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');

  // Interactive UI views state
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create' | 'edit'
  const [selectedOffre, setSelectedOffre] = useState(null); // for detail modal/drawer
  const [isApplying, setIsApplying] = useState(false); // mock apply process state
  const [applyForm, setApplyForm] = useState({ cvUploaded: false, lmText: '' });

  // Form states for creating & updating
  const [formOffer, setFormOffer] = useState({
    id_offre: null,
    titre: '',
    type: 'Stage', // Stage, Alternance, CDI, CDD as default
    remuneration: '',
    date_send: '',
    date_stop: '',
    description: '',
    id_entreprise: null,
  });

  // Sync user authentications
  useEffect(() => {
    const syncUser = () => {
      const storedToken = localStorage.getItem('talis_token');
      const rawUser = localStorage.getItem('talis_user');
      setToken(storedToken);
      if (storedToken && rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          setCurrentUser(parsed);
          setFormOffer(prev => ({
            ...prev,
            id_entreprise: prev.id_entreprise || parsed.id_entreprise || null
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

  // Fetch de l'entreprise du recruteur connecté, pour affichage en lecture seule dans le formulaire
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

  // Fetch all offers on mount or when active tab reverts to list
  useEffect(() => {
    fetchOffers();
  }, [activeTab]);

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

  // Type change helper
  const availableTypes = ['Tous', 'Stage', 'Alternance'];

  // Handle offer submission (create or update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Form inputs validation parameters
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

  // Open edit view
  const startEditOffer = (offre) => {
    // Format dates to YYYY-MM-DD for date inputs
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

  // Handle delete offer
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

  // Mock CV uploading handler for student interactions
  const handleMockCVUpload = () => {
    setApplyForm(prev => ({ ...prev, cvUploaded: true }));
  };

  // Submit real candidature (demande) to the backend
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

  // Format dates for display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Non définie';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Helper is recruiter
  const isRecruiter = currentUser?.role === 'entreprise';

  // Filters logic
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

      {/* 1. Header Section */}
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
                    <Plus size={18} className="btn-icon" /> Publier une offre
                  </Button>
                ) : (
                  <Button 
                    variant="accent" 
                    id="btn-nav-view-offers"
                    onClick={() => setActiveTab('list')}
                  >
                    <ArrowLeft size={18} className="btn-icon" /> Voir les offres
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Main Workspace */}
      <div className="workspace-layout">
        
        {/* --- VIEW 1 & 2: CREATE / EDIT OFFER FORM (Recruiter only) --- */}
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
                    />
                  </div>

                  <div className="form-group">
                    <label>Entreprise</label>
                    <div className="readonly-field">
                      <Building size={16} />
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
                    >
                      <option value="Stage">Stage</option>
                      <option value="Alternance">Alternance</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="form-remuneration">Rémunération mensuelle brute (€)</label>
                    <div className="input-with-icon">
                      <span className="input-icon-prefix"><DollarSign size={16} /></span>
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

        {/* --- VIEW 3: DISCOVERY & CONSULTING GRID (For everyone) --- */}
        {activeTab === 'list' && (
          <div className="list-wrapper animate-fade-in" id="offers-list-universe">
            
            {/* Search & filters panel */}
            <div className="filter-panel" id="offers-search-filter-panel">
              <div className="search-bar-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher par mot-clé, titre de poste ou technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="search-input-offers"
                />
              </div>

              <div className="scrollable-filters-row">
                <span className="filters-label"><Filter size={14} className="filter-prefix" /> Contrat :</span>
                <div className="pills-container">
                  {availableTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`pill ${selectedType === type ? 'pill--active' : ''}`}
                      onClick={() => setSelectedType(type)}
                      id={`pill-filter-${type}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* loading state */}
            {loading && (
              <div className="empty-state" id="loading-spinner-view">
                <div className="spinner"></div>
                <p>Chargement des opportunités en cours...</p>
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="form-alert form-alert--error shadow-soft max-width-600 center-margin">
                <span>&#128682;</span>
                <div>{error}</div>
              </div>
            )}

            {/* Normal loaded grid */}
            {!loading && !error && (
              <>
                {filteredOffres.length === 0 ? (
                  <div className="empty-state" id="empty-state-fallback">
                    <Briefcase size={48} className="empty-state__icon text-light" />
                    <h3>Aucune offre ne correspond à vos critères</h3>
                    <p>Réessayez en modifiant vos mots-clés ou le filtre de recherche de contrat.</p>
                    <Button variant="accent" onClick={() => { setSearchQuery(''); setSelectedType('Tous'); }}>
                      Réinitialiser les filtres
                    </Button>
                  </div>
                ) : (
                  <div className="offers-grid" id="offers-cards-grid">
                    {filteredOffres.map((offre) => {
                      const lowerType = (offre.type || '').toLowerCase();
                      const typeClass = lowerType === 'stage' ? 'green' 
                                      : lowerType === 'alternance' ? 'purple' 
                                      : lowerType === 'cdi' ? 'accent' 
                                      : 'dark';

                      return (
                        <div 
                          key={offre.id_offre} 
                          className="job-card"
                          onClick={() => setSelectedOffre(offre)}
                          id={`job-card-${offre.id_offre}`}
                        >
                          <div className="job-card__header">
                            <span className={`badge-category ${typeClass}`}>
                              {offre.type || 'Stage'}
                            </span>
                            
                            {/* Actions for recruiters of the offers */}
                            {isRecruiter && (
                              <div 
                                className="action-buttons-overlay" 
                                onClick={(e) => e.stopPropagation()} // avoid opening modal
                              >
                                <button 
                                  className="action-btn action-btn--edit" 
                                  title="Modifier l'offre"
                                  onClick={() => startEditOffer(offre)}
                                  id={`edit-btn-${offre.id_offre}`}
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  className="action-btn action-btn--delete" 
                                  title="Supprimer l'offre"
                                  onClick={() => handleDeleteOffer(offre.id_offre)}
                                  id={`delete-btn-${offre.id_offre}`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>

                          <h3 className="job-card__title">{offre.titre}</h3>
                          
                          {offre.entreprise && (
                            <div className="job-card__company">
                              <Building size={14} className="company-icon" />
                              <span>{offre.entreprise}</span>
                            </div>
                          )}

                          <div className="job-card__metadata">
                            {offre.localisation && (
                              <div className="meta-item">
                                <MapPin size={14} />
                                <span>{offre.localisation}</span>
                              </div>
                            )}
                            {offre.remuneration && (
                              <div className="meta-item">
                                <DollarSign size={14} />
                                <span>{offre.remuneration} € / mois</span>
                              </div>
                            )}
                            <div className="meta-item">
                              <Calendar size={14} />
                              <span>Clôture le {formatDateDisplay(offre.date_stop)}</span>
                            </div>
                          </div>

                          <p className="job-card__snippet">
                            {offre.description && offre.description.length > 140 
                              ? `${offre.description.substring(0, 140)}...` 
                              : offre.description || 'Aucune description fournie.'}
                          </p>

                          <div className="job-card__footer">
                            <span className="view-more-trigger">
                              Consulter la fiche <ChevronRight size={14} />
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

      {/* 4. MODAL: FULL OFFER CONSULTING & APPLICATION SIMULATION */}
      {selectedOffre && (
        <div className="modal-backdrop show" onClick={() => { setSelectedOffre(null); setIsApplying(false); }}>
          <div 
            className="modal-content side-drawer animate-slide-left" 
            onClick={(e) => e.stopPropagation()}
            id={`offer-drawer-${selectedOffre.id_offre}`}
          >
            
            {/* Header */}
            <div className="drawer-header">
              <span className={`badge-category ${
                (selectedOffre.type || '').toLowerCase() === 'stage' ? 'green' 
                : (selectedOffre.type || '').toLowerCase() === 'alternance' ? 'purple' 
                : (selectedOffre.type || '').toLowerCase() === 'cdi' ? 'accent' 
                : 'dark'
              }`}>
                {selectedOffre.type}
              </span>
              <button 
                className="close-drawer" 
                onClick={() => { setSelectedOffre(null); setIsApplying(false); }}
                aria-label="Fermer le panneau"
                id="drawer-close-btn"
              >
                <X size={24} />
              </button>
            </div>

            {/* Standard detail view */}
            {!isApplying ? (
              <div className="drawer-body">
                <h2 className="offer-detailed-title">{selectedOffre.titre}</h2>
                
                <div className="offer-tags-box">
                  {selectedOffre.entreprise && (
                    <div className="tag-element tag-element--primary">
                      <Building size={16} />
                      <span>Entreprise : <strong>{selectedOffre.entreprise}</strong></span>
                    </div>
                  )}
                  <div className="tag-element">
                    <Briefcase size={16} />
                    <span>Contrat : {selectedOffre.type}</span>
                  </div>
                  {selectedOffre.localisation && (
                    <div className="tag-element">
                      <MapPin size={16} />
                      <span>Localisation : {selectedOffre.localisation}</span>
                    </div>
                  )}
                  {selectedOffre.remuneration && (
                    <div className="tag-element">
                      <DollarSign size={16} />
                      <span>Gratification / Salaire : {selectedOffre.remuneration} € / mois</span>
                    </div>
                  )}
                  <div className="tag-element">
                    <Calendar size={16} />
                    <span>Publié le : {formatDateDisplay(selectedOffre.date_send)}</span>
                  </div>
                  <div className="tag-element">
                    <Calendar size={16} />
                    <span>Fin des candidatures : {formatDateDisplay(selectedOffre.date_stop)}</span>
                  </div>
                </div>

                <div className="offer-separator"></div>

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
                        <Edit size={16} className="btn-icon" /> Modifier l'annonce
                      </Button>
                      <Button variant="accent" onClick={() => handleDeleteOffer(selectedOffre.id_offre)}>
                        <Trash2 size={16} className="btn-icon" /> Supprimer
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="primary" 
                      id="btn-trigger-apply"
                      size="lg"
                      onClick={() => setIsApplying(true)}
                    >
                      Postuler à cette offre <Send size={16} className="btn-icon-right" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              /* MOCK INTERACTIVE CANDIDATURE LAYOUT (CV + COVER LETTER) */
              <div className="drawer-body drawer-body--apply animate-fade-in" id="apply-interactive-space">
                
                <button className="back-to-offer" onClick={() => setIsApplying(false)}>
                  <ArrowLeft size={16} /> Retour à l'annonce
                </button>

                <h2 className="offer-detailed-title">Postuler pour : {selectedOffre.titre}</h2>
                <p className="intro-text">
                  Détaillez votre candidature ci-dessous. Le recruteur la recevra directement avec votre profil TALIS.
                </p>

                <form onSubmit={submitCandidature} className="apply-form" id="student-submit-candidature">
                  
                  {/* Prefilled Profile Info */}
                  <div className="author-prefill-card">
                    <span className="prefill-title">PROFIL COMPTE</span>
                    <div className="prefill-row">
                      <User size={16} className="text-light" />
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

                  {/* 1. CV Uploading Field (Drag-and-drop & manual click interaction) */}
                  <div className="form-group">
                    <label>Votre Curriculum Vitae (CV) *</label>
                    <div 
                      className={`upload-zone ${applyForm.cvUploaded ? 'upload-zone--uploaded' : ''}`}
                      onClick={handleMockCVUpload}
                      id="cv-upload-zone"
                    >
                      {applyForm.cvUploaded ? (
                        <div className="uploaded-file-details">
                          <FileText size={42} className="text-emerald" />
                          <div className="file-info">
                            <span className="file-name">CV_Talis_Candidate.pdf</span>
                            <span className="file-size">1.2 MB • Prêt de démonstration</span>
                          </div>
                          <span className="change-btn">Changer</span>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <Upload size={36} className="upload-placeholder__icon" />
                          <p className="upload-main-text">Glissez-déposez votre CV ici, ou <span className="highlight">parcourez vos fichiers</span></p>
                          <p className="upload-sub-text">Formats acceptés : PDF, DOCX (Max 5Mo)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. Cover Letter text block */}
                  <div className="form-group">
                    <label htmlFor="lm-textarea">Lettre de motivation ou Note d'accompagnement *</label>
                    <textarea
                      id="lm-textarea"
                      rows="6"
                      value={applyForm.lmText}
                      onChange={(e) => setApplyForm({ ...applyForm, lmText: e.target.value })}
                      placeholder="Indiquez au recruteur vos motivations pour ce poste et vos disponibilités de début..."
                      required
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
