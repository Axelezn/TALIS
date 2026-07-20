import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../../core/AppError.js';
import { AuthPayloadEntity } from '../entities/AuthPayloadEntity.js';

export class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async register(data) {
    const payload = new AuthPayloadEntity({
      role: data.role,
      mail: data.mail,
      password: data.password,
    }).toJSON();

    const role = payload.role;
    const mail = payload.mail;
    const password = payload.password;

    if (role !== 'etudiant' && role !== 'entreprise') {
      throw new AppError('role doit valoir etudiant ou entreprise.', 400);
    }

    if (!mail) {
      throw new AppError('mail est obligatoire.', 400);
    }

    if (!password || password.length < 8) {
      throw new AppError('Le mot de passe doit contenir au moins 8 caractères.', 400);
    }

    const emailAlreadyUsed = await this.#emailExists(mail);
    if (emailAlreadyUsed) {
      throw new AppError('Cette adresse email est déjà utilisée.', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (role === 'etudiant') {
      const createdUser = await this.authRepository.createUserAccount({
        nom: data.nom || null,
        prenom: data.prenom || null,
        ddn: data.ddn || null,
        mail,
        password_hash: passwordHash,
        tel: data.tel || null,
        certif: 0,
        id_document: null,
        address: data.address || null,
        city: data.city || null,
        zip_code: data.zip_code || null,
        study_level: data.study_level || null,
        study_place: data.study_place || null,
        formation: data.formation || null,
        contract_type: data.contract_type || null,
        bio: data.bio || null,
        id_photo_document: null,
      });

      return {
        role: 'etudiant',
        user: createdUser,
      };
    }

    const entrepriseId = await this.authRepository.createEntreprise({
      nom: data.nom_entreprise || null,
      adresse_complete: data.adresse_entreprise || null,
      numero_rue: null,
      code_postal: data.code_postal_entreprise ? Number(data.code_postal_entreprise) : null,
      ville: data.ville_entreprise || null,
      certif: 0,
    });

    const createdRecruteur = await this.authRepository.createRecruteurAccount({
      id_entreprise: entrepriseId,
      nom: data.nom || null,
      prenom: data.prenom || null,
      ddn: data.ddn || null,
      mail,
      password_hash: passwordHash,
      tel: data.tel || null,
      certif: 0,
      id_document: null,
      id_offre: null,
      bio: data.bio || null,
      company_name: data.company_name || null,
      sector: data.sector || null,
      job_title: data.job_title || null,
      linkedin: data.linkedin || null,
      id_photo_document: null,
    });

    return {
      role: 'entreprise',
      user: createdRecruteur,
    };
  }

  async login(data) {
    const payload = new AuthPayloadEntity({
      role: data.role,
      mail: data.mail,
      password: data.password,
    }).toJSON();

    const role = payload.role;
    const mail = payload.mail;
    const password = payload.password;

    if (role !== 'etudiant' && role !== 'entreprise') {
      throw new AppError('role doit valoir etudiant ou entreprise.', 400);
    }

    if (!mail || !password) {
      throw new AppError('mail et password sont obligatoires.', 400);
    }

    const account = role === 'etudiant'
      ? await this.authRepository.findUserByEmail(mail)
      : await this.authRepository.findRecruteurByEmail(mail);

    if (!account || !account.password_hash) {
      throw new AppError('Identifiants invalides.', 401);
    }

    const isValidPassword = await bcrypt.compare(password, account.password_hash);
    if (!isValidPassword) {
      throw new AppError('Identifiants invalides.', 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT_SECRET est manquant dans la configuration serveur.', 500);
    }

    const token = jwt.sign(
      {
        sub: account.id,
        role: account.role,
        email: account.mail,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    let photo = null;
    if (account.id_photo_document) {
      try {
        const doc = await this.authRepository.findDocumentById(account.id_photo_document);
        if (doc && doc.path) {
          photo = `http://localhost:3000/${doc.path}`;
        }
      } catch (err) {
        console.warn('Could not resolve photo path on login:', err);
      }
    }

    return {
      token,
      user: {
        id: account.id,
        role: account.role,
        nom: account.nom,
        prenom: account.prenom,
        mail: account.mail,
        id_entreprise: account.id_entreprise || null,
        id_photo_document: account.id_photo_document || null,
        photo,
      },
    };
  }

  async #emailExists(mail) {
    const [user, recruteur] = await Promise.all([
      this.authRepository.findUserByEmail(mail),
      this.authRepository.findRecruteurByEmail(mail),
    ]);

    return Boolean(user || recruteur);
  }
}
