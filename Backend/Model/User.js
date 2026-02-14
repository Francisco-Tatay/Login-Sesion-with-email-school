export class User {
  #id;
  #name;
  #email;
  #password;

  get id() {
    return this.#id;
  }
  set id(id) {
    this.#id = id;
  }
  get name() {
    return this.#name;
  }
  set name(name) {
    this.#name = name;
  }
  get email() {
    return this.#email;
  }
  set email(email) {
    this.#email = email;
  }
  get password() {
    return this.#password;
  }
  set password(password) {
    this.#password = password;
  }
    static generateNewPassword(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-+";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return newPassword;
  }

}
