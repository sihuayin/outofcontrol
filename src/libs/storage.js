class LocalStore {
  constructor() {

  }

  get(key) {
    return localStorage.getItem(key);
  }

  set(key, value) {
    localStorage.setItem(key, value);
  }

  delete(key) {
    localStorage.removeItem(key);
  }
}

export default new LocalStore()