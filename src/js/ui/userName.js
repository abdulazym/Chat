export default class UserName{
    constructor(element) {
        this.element = element;
    }

    set(name) {
        this.element.textContent = name;
    }

    get() {
    return this.name;
  }
}