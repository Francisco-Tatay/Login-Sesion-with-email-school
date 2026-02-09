class User {
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
  get password(){
    return this.#password;
  }
  set password(password){
    this.#password = password;
  }
  
}
