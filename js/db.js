/* ================================================
   js/db.js — LocalStorage Database Layer
   ================================================ */

const DB = {
  /* Generic get/set */
  get(key, defaultVal = null) {
    try {
      const v = localStorage.getItem('iiq_' + key);
      return v !== null ? JSON.parse(v) : defaultVal;
    } catch { return defaultVal; }
  },

  set(key, value) {
    try { localStorage.setItem('iiq_' + key, JSON.stringify(value)); }
    catch (e) { console.error('DB.set error:', e); }
  },

  remove(key) {
    try { localStorage.removeItem('iiq_' + key); }
    catch {}
  },

  /* Convenience accessors */
  users()      { return this.get('users', []); },
  interviews() { return this.get('interviews', []); },
  recordings() { return this.get('recordings', []); },

  /* Save an interview record */
  saveInterview(record) {
    const arr = this.interviews();
    arr.push(record);
    this.set('interviews', arr);
  },

  /* Save a recording */
  saveRecording(record) {
    const arr = this.recordings();
    arr.push(record);
    this.set('recordings', arr);
  },

  /* Auth helpers */
  getToken()       { return this.get('token', null); },
  setToken(token)  { this.set('token', token); },
  clearToken()     { this.remove('token'); },

  getCurrentUser()      { return this.get('currentUser', null); },
  setCurrentUser(user)  { this.set('currentUser', user); },
  clearCurrentUser()    { this.remove('currentUser'); },
};
