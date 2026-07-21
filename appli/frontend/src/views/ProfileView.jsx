import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/common/InputField/InputField';
import { apiRequest } from '../services/apiClient';
import { toast } from '../components/common/Toast/toast';
import { Camera, User, FileText, CheckCircle2, AlertCircle, Building, Phone, Mail, MapPin, GraduationCap, Loader2 } from 'lucide-react';
import './ProfileView.scss';

export default function ProfileView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  // Profile Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ddn: '',
    address: '',
    city: '',
    zipCode: '',
    studyLevel: '',
    studyPlace: '',
    formation: '',
    contractType: 'alternance',
    companyName: '',
    sector: '',
    jobTitle: '',
    linkedin: '',
    bio: '',
  });

  // Base64 files to upload on Save
  const [avatar, setAvatar] = useState(null); // base64 string
  const [avatarName, setAvatarName] = useState('');
  
  const [cvFileBase64, setCvFileBase64] = useState(null);
  const [cvFileName, setCvFileName] = useState('');
  const [savedCvInfo, setSavedCvInfo] = useState(null); // { id_document, nom, path }

  // 'idle' | 'saving' | 'saved' | 'error'
  const [saveStatus, setSaveStatus] = useState('idle');
  const [dragOver, setDragOver] = useState(false);
  // Incrémenté pour rejouer une sauvegarde restée en attente avec un état
  // à jour (voir pendingSaveRef plus bas) une fois la sauvegarde en cours terminée.
  const [saveQueueTick, setSaveQueueTick] = useState(0);

  // Autosave doit rester désarmé tant que le profil initial n'est pas
  // entièrement chargé, sinon le peuplement du formulaire déclenche
  // lui-même une sauvegarde inutile juste après le montage.
  const autosaveArmedRef = useRef(false);
  const isSavingRef = useRef(false);
  // Marque qu'un changement est arrivé pendant une sauvegarde déjà en cours,
  // pour ne pas le perdre : on relance dès que la sauvegarde en cours finit.
  const pendingSaveRef = useRef(false);

  // Load and sync user profile from DB/localStorage on mount
  useEffect(() => {
    async function loadUserProfile() {
      const rawUser = localStorage.getItem('talis_user');
      const token = localStorage.getItem('talis_token');
      
      if (!rawUser || !token) {
        navigate('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(rawUser);
        setCurrentUser(parsedUser);
        
        let dbUser = parsedUser;
        let dbDoc = null;

        // Fetch up-to-date data from real backend if connected
        if (parsedUser.id && token) {
          try {
            const apiPath = parsedUser.role === 'etudiant' 
              ? `/utilisateurs/${parsedUser.id}` 
              : `/recruteurs/${parsedUser.id}`;
            
            const apiUser = await apiRequest(apiPath, { token });
            // Merge local roles and backend data
            dbUser = { ...parsedUser, ...apiUser };
            dbUser.id = parsedUser.id;
            dbUser.role = parsedUser.role;

            // Fetch linked CV file info from document table if present
            if (dbUser.id_document) {
              try {
                dbDoc = await apiRequest(`/documents/${dbUser.id_document}`, { token });
                setSavedCvInfo(dbDoc);
                setCvFileName(dbDoc.nom);
              } catch (docErr) {
                console.warn('Could not fetch linked CV document info', docErr);
              }
            }

            // Fetch linked photo file info from document table if present
            if (dbUser.id_photo_document) {
              try {
                const photoDoc = await apiRequest(`/documents/${dbUser.id_photo_document}`, { token });
                if (photoDoc && photoDoc.path) {
                  dbUser.photo = `http://localhost:3000/${photoDoc.path}`;
                }
              } catch (photoErr) {
                console.warn('Could not fetch linked photo document info', photoErr);
              }
            }

            // Sync fresh profile back to local storage and state for seamless navbar display
            localStorage.setItem('talis_user', JSON.stringify(dbUser));
            setCurrentUser(dbUser);
            window.dispatchEvent(new Event('storage'));
          } catch (apiErr) {
            console.warn('Real-time backend load failed, using stored copy', apiErr);
          }
        }

        updateFormValues(dbUser, dbDoc);
      } catch (e) {
        console.error('Failed to parse user storage', e);
      }
    }

    loadUserProfile().then(() => {
      // Armé sur un tick séparé : le peuplement du formulaire ci-dessus a
      // déjà été traité par React à ce moment-là, donc l'effet d'autosave
      // ne se déclenchera qu'à partir d'une vraie modification utilisateur.
      setTimeout(() => {
        autosaveArmedRef.current = true;
      }, 0);
    });
  }, []);

  const updateFormValues = (user, doc) => {
    // Check role to load corresponding parameters (handling both snake_case and camelCase parameters)
    setFormData({
      firstName: user.prenom || '',
      lastName: user.nom || '',
      email: user.mail || '',
      phone: user.tel || '',
      ddn: user.ddn ? (typeof user.ddn === 'string' ? user.ddn.substring(0, 10) : new Date(user.ddn).toISOString().substring(0, 10)) : '',
      address: user.address || '',
      city: user.city || '',
      zipCode: user.zip_code || user.zipCode || '',
      studyLevel: user.study_level || user.studyLevel || '',
      studyPlace: user.study_place || user.studyPlace || '',
      formation: user.formation || '',
      contractType: user.contract_type || user.contractType || 'alternance',
      companyName: user.company_name || user.companyName || '',
      sector: user.sector || '',
      jobTitle: user.job_title || user.jobTitle || '',
      linkedin: user.linkedin || '',
      bio: user.bio || '',
    });

    if (user.photo) {
      setAvatar(user.photo);
    } else {
      setAvatar(null);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert files to base64
  const handlePhotoUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
      setAvatarName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Seuls les fichiers PDF sont acceptés.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (readEvent) => {
        setCvFileBase64(readEvent.target.result);
        setCvFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload document files to backend and save profile to Database.
  // Appelé automatiquement par l'autosave (voir effet plus bas), plus besoin
  // de bouton "Enregistrer" manuel. La garde anti-chevauchement est gérée
  // par l'appelant (l'effet d'autosave), pas ici.
  const saveProfile = async () => {
    isSavingRef.current = true;
    setSaveStatus('saving');
    const token = localStorage.getItem('talis_token');

    try {
      let linkedDocId = currentUser.id_document || null;

      // 1. Process CV Upload First if a new file is loaded in memory
      if (cvFileBase64) {
        try {
          const docRow = await apiRequest('/documents', {
            method: 'POST',
            body: {
              nom: cvFileName,
              fileData: cvFileBase64
            },
            token
          });
          linkedDocId = docRow.id_document;
          setSavedCvInfo(docRow);
          setCvFileBase64(null); // Clear pending upload queue
          console.log('[Upload success] Stored file row in Table Document:', docRow);
        } catch (uploadErr) {
          console.error('File upload failed', uploadErr);
          toast.error("Échec de l'intégration du fichier CV dans la table document.");
          setSaveStatus('error');
          isSavingRef.current = false;
          return;
        }
      }

      // 2. Process Avatar Photo Upload if modified and supported
      let photoPathOrBase64 = avatar;
      let linkedPhotoDocId = currentUser.id_photo_document || null;
      if (avatar && avatar.startsWith('data:image/')) {
        try {
          const photoRow = await apiRequest('/documents', {
            method: 'POST',
            body: {
              nom: avatarName || 'photo_profil.png',
              fileData: avatar
            },
            token
          });
          linkedPhotoDocId = photoRow.id_document;
          photoPathOrBase64 = photoRow.path ? `http://localhost:3000/${photoRow.path}` : avatar;
          console.log('[Upload success] Stored avatar photo in Table Document:', photoRow);
        } catch (photoUploadErr) {
          console.warn('Avatar could not be saved to server, falling back to local storage', photoUploadErr);
        }
      }

      // 3. Update the matching profile in MySQL database (Student / Recruiter)
      const updatedUserCopy = {
        ...currentUser,
        prenom: formData.firstName,
        nom: formData.lastName,
        mail: formData.email,
        tel: formData.phone,
        ddn: formData.ddn,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        studyLevel: formData.studyLevel,
        studyPlace: formData.studyPlace,
        formation: formData.formation,
        contractType: formData.contractType,
        companyName: formData.companyName,
        sector: formData.sector,
        jobTitle: formData.jobTitle,
        linkedin: formData.linkedin,
        bio: formData.bio,
        id_document: linkedDocId,
        id_photo_document: linkedPhotoDocId,
        photo: photoPathOrBase64
      };

      if (token && token !== 'mock_talis_jwt_token_for_demo') {
        const updatePayload = currentUser.role === 'etudiant' ? {
          nom: formData.lastName,
          prenom: formData.firstName,
          ddn: formData.ddn || null,
          mail: formData.email,
          tel: formData.phone,
          certif: currentUser.certif || 0,
          id_document: linkedDocId,
          address: formData.address,
          city: formData.city,
          zip_code: formData.zipCode,
          study_level: formData.studyLevel,
          study_place: formData.studyPlace,
          formation: formData.formation,
          contract_type: formData.contractType,
          bio: formData.bio,
          id_photo_document: linkedPhotoDocId
        } : {
          id_entreprise: currentUser.id_entreprise,
          nom: formData.lastName,
          prenom: formData.firstName,
          ddn: formData.ddn || null,
          mail: formData.email,
          tel: formData.phone,
          certif: currentUser.certif || 0,
          id_document: linkedDocId,
          id_offre: currentUser.id_offre || null,
          bio: formData.bio,
          company_name: formData.companyName,
          sector: formData.sector,
          job_title: formData.jobTitle,
          linkedin: formData.linkedin,
          id_photo_document: linkedPhotoDocId
        };

        const apiPath = currentUser.role === 'etudiant' 
          ? `/utilisateurs/${currentUser.id}` 
          : `/recruteurs/${currentUser.id}`;

        await apiRequest(apiPath, {
          method: 'PUT',
          body: updatePayload,
          token
        });
      }

      // 4. Save to local application state
      localStorage.setItem('talis_user', JSON.stringify(updatedUserCopy));
      setCurrentUser(updatedUserCopy);

      // Notify parent components (like Navbar) to sync avatar updates
      window.dispatchEvent(new Event('storage'));
      setSaveStatus('saved');

    } catch (err) {
      console.error('Failed to update user profile in MySQL', err);
      toast.error(`Erreur de sauvegarde : ${err.message || "Impossible de joindre l'API"}`);
      setSaveStatus('error');
    } finally {
      isSavingRef.current = false;

      // Un changement est arrivé pendant cette sauvegarde : on relance tout
      // de suite avec les données à jour (via un nouveau rendu, pour éviter
      // de rappeler cette même closure figée sur l'ancien formData).
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false;
        setSaveQueueTick((n) => n + 1);
      }
    }
  };

  // Autosave événementiel : chaque modification du formulaire, de la photo
  // ou du CV déclenche la sauvegarde immédiatement, sans délai ni bouton
  // manuel. Si une sauvegarde est déjà en cours, le changement est mis en
  // attente et rejoué dès qu'elle se termine (voir pendingSaveRef ci-dessus).
  useEffect(() => {
    if (!autosaveArmedRef.current) return;

    if (isSavingRef.current) {
      pendingSaveRef.current = true;
      return;
    }

    saveProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, avatar, cvFileBase64, saveQueueTick]);

  if (!currentUser) return null;

  const initials = `${formData.firstName?.[0] || 'U'}${formData.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="profile-page" id="profile-view-root">
      
      <div className="profile-content">
        
        {/* Page Title & Autosave status */}
        <div className="profile-header">
          <div className="profile-header__top">
            <h1>Mon Profil Utilisateur</h1>
            <div className={`autosave-status autosave-status--${saveStatus}`}>
              {saveStatus === 'saving' && <><Loader2 size={14} className="spin" /> Enregistrement...</>}
              {saveStatus === 'saved' && <><CheckCircle2 size={14} /> Enregistré</>}
              {saveStatus === 'error' && <><AlertCircle size={14} /> Échec de l'enregistrement</>}
            </div>
          </div>
        </div>

        {/* Layout Grid columns */}
        <div className="profile-grid">
          
          {/* SIDEBAR */}
          <div className="profile-sidebar">
            
            {/* Interactive Avatar Image */}
            <div className={`avatar-drop-area ${dragOver ? 'dragover' : ''}`}
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 onDrop={handleDrop}>
              {avatar ? (
                <img src={avatar} alt="Avatar" referrerPolicy="no-referrer" />
              ) : (
                <div className="avatar-initials">{initials}</div>
              )}
              
              <label htmlFor="avatar-file-selector2" className="avatar-upload-btn">
                <Camera size={15} />
                <input 
                  type="file" 
                  id="avatar-file-selector2" 
                  accept="image/*" 
                  className="hidden-input"
                  style={{ display: 'none' }}
                  onChange={(e) => handlePhotoUpload(e.target.files[0])} 
                />
              </label>
            </div>

            <div className="sidebar-desc">
              <h3>{formData.firstName} {formData.lastName}</h3>
              <span className="role-badge">
                {currentUser.role === 'etudiant' ? 'Étudiant TALIS' : 'Compte Partenaire'}
              </span>

              <div className="sidebar-info-list">
                <div className="info-item">
                  <Mail size={14} />
                  <span>{formData.email || 'Pas d\'email'}</span>
                </div>
                {formData.phone && (
                  <div className="info-item">
                    <Phone size={14} />
                    <span>{formData.phone}</span>
                  </div>
                )}
                {formData.city && (
                  <div className="info-item">
                    <MapPin size={14} />
                    <span>{formData.city} ({formData.zipCode})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MAIN FORM CARD */}
          <div className="profile-main-card">
            <form onSubmit={(e) => e.preventDefault()}>
              
              {/* SECTION: Identity */}
              <div className="form-section">
                <h2 className="form-section__title">
                  <User size={18} /> Informations Personnelles
                </h2>
                
                <div className="form-section__grid">
                  <InputField 
                    label="Prénom"
                    name="firstName"
                    placeholder="Paul"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField 
                    label="Nom"
                    name="lastName"
                    placeholder="Durand"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-section__grid" style={{ marginTop: '15px' }}>
                  <InputField 
                    label="E-mail"
                    name="email"
                    type="email"
                    placeholder="paul.durand@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-section__grid" style={{ marginTop: '15px' }}>
                  <InputField 
                    label="Téléphone"
                    name="phone"
                    placeholder="06 00 00 00 00"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <InputField 
                    label="Date de naissance"
                    name="ddn"
                    type="date"
                    value={formData.ddn}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-textarea-group">
                  <label>Présentation (Bio)</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Parlez-nous en quelques phrases de vous-même, de vos hobbies et de votre projet professionnel..."
                  />
                </div>
              </div>

              {/* SECTION: Address */}
              <div className="form-section">
                <h2 className="form-section__title">
                  <MapPin size={18} /> Coordonnées Postales
                </h2>
                
                <InputField 
                  label="Adresse"
                  name="address"
                  placeholder="12 Passage des Érables"
                  value={formData.address}
                  onChange={handleInputChange}
                />

                <div className="form-section__grid" style={{ marginTop: '15px' }}>
                  <InputField 
                    label="Code Postal"
                    name="zipCode"
                    placeholder="33000"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                  <InputField 
                    label="Ville"
                    name="city"
                    placeholder="Bordeaux"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* SECTION: Student fields + CV upload */}
              {currentUser.role === 'etudiant' && (
                <div className="form-section">
                  <h2 className="form-section__title">
                    <GraduationCap size={18} /> Cursus et Curriculum Vitae
                  </h2>

                  <div className="form-section__grid">
                    <InputField 
                      label="Établissement / École"
                      name="studyPlace"
                      placeholder="TALIS Bordeaux"
                      value={formData.studyPlace}
                      onChange={handleInputChange}
                    />
                    <InputField 
                      label="Niveau académique"
                      name="studyLevel"
                      placeholder="Master 2 (Bac +5)"
                      value={formData.studyLevel}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-section__grid" style={{ marginTop: '15px' }}>
                    <InputField 
                      label="Intitulé Majeur / Formation"
                      name="formation"
                      placeholder="Développement Web"
                      value={formData.formation}
                      onChange={handleInputChange}
                    />
                    <div className="form-select-group">
                      <label>Contrat recherché</label>
                      <select 
                        name="contractType"
                        value={formData.contractType}
                        onChange={handleInputChange}
                      >
                        <option value="alternance">Alternance d'études / Apprentissage</option>
                        <option value="stage">Stage conventionné longue durée</option>
                      </select>
                    </div>
                  </div>

                  {/* CV Document Box */}
                  <div className="cv-upload-box">
                    <label className="cv-upload-box__label">
                      <FileText size={15} /> Intégration du CV (PDF de candidature)
                    </label>

                    {(cvFileBase64 || savedCvInfo) ? (
                      <div className="cv-upload-box__attached">
                        <div className="attached-info">
                          <FileText size={24} />
                          <div>
                            <p className="file-name">{cvFileName}</p>
                            {cvFileBase64 ? (
                              <span className="file-status">Nouveau CV attaché (en attente d'enregistrement)</span>
                            ) : (
                              <span className="file-status" style={{ color: '#16a34a' }}>CV enregistré dans la table `document` (ID: {savedCvInfo?.id_document})</span>
                            )}
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => {
                            setCvFileBase64(null);
                            setSavedCvInfo(null);
                            setCvFileName('');
                          }} 
                          className="btn-delete"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <div className="cv-upload-box__dropzone">
                        <input 
                          type="file" 
                          id="cv-file-uploader" 
                          accept=".pdf" 
                          style={{ display: 'none' }}
                          onChange={handleCvChange} 
                        />
                        <label htmlFor="cv-file-uploader" className="dropzone-label">
                          <span className="select-title">Sélectionner un fichier de CV</span>
                          <span className="select-subtitle">Cliquez ou déposez votre document en format PDF</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION: Recruiter fields */}
              {currentUser.role === 'entreprise' && (
                <div className="form-section">
                  <h2 className="form-section__title">
                    <Building size={18} /> Profil Recruteur &amp; Entreprise Partner
                  </h2>

                  <div className="form-section__grid">
                    <InputField 
                      label="Nom de l'entreprise"
                      name="companyName"
                      placeholder="TALIS Group"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                    <InputField 
                      label="Intitulé de votre Poste"
                      name="jobTitle"
                      placeholder="Directrice de Recrutement"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-section__grid" style={{ marginTop: '15px' }}>
                    <InputField 
                      label="Secteur d'Activité"
                      name="sector"
                      placeholder="Ressources Humaines"
                      value={formData.sector}
                      onChange={handleInputChange}
                    />
                    <InputField 
                      label="Lien LinkedIn Professionnel"
                      name="linkedin"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
