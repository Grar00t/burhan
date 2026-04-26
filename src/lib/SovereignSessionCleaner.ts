// Sovereign Session Cleaner for HAVEN
// Ensures all local data is wiped after a session ends.
// Built by أبو خوارزم — Sulaiman Alshammari

export class SovereignSessionCleaner {
  static async wipe() {
    // Clear IndexedDB
    const dbs = await window.indexedDB.databases();
    dbs.forEach(db => {
      if (db.name) window.indexedDB.deleteDatabase(db.name);
    });

    // Clear LocalStorage
    localStorage.clear();

    // Clear SessionStorage
    sessionStorage.clear();

    // Clear Caches
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(key => caches.delete(key)));

    console.log("Sovereign Session Wiped Successfully.");
  }
}
