export class Product {
  #id;
  #name;
  #price;

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
  get price() {
    return this.#price;
  }
  set price(price) {
    this.#price = price;
  }
}
