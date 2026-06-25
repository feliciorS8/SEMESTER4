import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATA_KEYS = [
  'umkm_products',
  'umkm_transactions',
  'umkm_expenses',
  'umkm_profile',
  'umkm_cashiers',
  'umkm_active_cashier_id',
  'umkm_categories',
];

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('umkm_kasir.db');
  }
  const db = await dbPromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_storage (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `);
  return db;
}

const Storage = {
  async getItem(key) {
    const db = await getDb();
    const row = await db.getFirstAsync('SELECT value FROM app_storage WHERE key = ?;', key);
    return row?.value ?? null;
  },

  async setItem(key, value) {
    const db = await getDb();
    await db.runAsync(
      'INSERT INTO app_storage (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value;',
      key,
      value,
    );
  },

  async removeItem(key) {
    const db = await getDb();
    await db.runAsync('DELETE FROM app_storage WHERE key = ?;', key);
  },

  async multiRemove(keys) {
    const db = await getDb();
    await db.withExclusiveTransactionAsync(async (txn) => {
      for (const key of keys) {
        await txn.runAsync('DELETE FROM app_storage WHERE key = ?;', key);
      }
    });
  },
};

export async function migrateAsyncStorageToSQLite() {
  try {
    const marker = await Storage.getItem('umkm_sqlite_migrated');
    if (marker === 'true') return;

    for (const key of DATA_KEYS) {
      const sqliteValue = await Storage.getItem(key);
      if (sqliteValue !== null) continue;

      const oldValue = await AsyncStorage.getItem(key);
      if (oldValue !== null) {
        await Storage.setItem(key, oldValue);
      }
    }

    await Storage.setItem('umkm_sqlite_migrated', 'true');
  } catch (error) {
    console.log('SQLite migration skipped:', error);
  }
}

export default Storage;
