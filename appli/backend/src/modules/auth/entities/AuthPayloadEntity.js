import { toOptionalString } from '../../../core/validators.js';

export class AuthPayloadEntity {
  #role;
  #mail;
  #password;

  constructor(data = {}) {
    this.#role = toOptionalString(data.role, 'role', 20);
    this.#mail = toOptionalString(data.mail, 'mail', 100);
    this.#password = toOptionalString(data.password, 'password', 255);
  }

  toJSON() {
    return {
      role: this.#role,
      mail: this.#mail,
      password: this.#password,
    };
  }
}
