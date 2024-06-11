interface UUIDEntry {
  id: string;
  value: string;
}

export const useAnonymousUser = () => {
  const supabase = useSupabaseClient();
  const dbName = 'arcana-db';
  const storeName = 'uuid-store';
  const dbVersion = 1;
  const dbRef = ref<IDBDatabase | null>(null);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event: Event) => {
        dbRef.value = (event.target as IDBOpenDBRequest).result;
        resolve(dbRef.value);
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  };

  const getUUID = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if (!dbRef.value) {
        openDB().then(() => getUUID().then(resolve).catch(reject));
        return;
      }

      const transaction = dbRef.value.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get('uuid');

      request.onsuccess = (event: Event) => {
        const result = (event.target as IDBRequest).result as
          | UUIDEntry
          | undefined;
        resolve(result ? result.value : null);
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  };

  const setUUID = (uuid: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!dbRef.value) {
        openDB().then(() => setUUID(uuid).then(resolve).catch(reject));
        return;
      }

      const transaction = dbRef.value.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ id: 'uuid', value: uuid });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  };

  const createAnonymousUser = async (): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error('Error creating anonymous user:', error);
      return null;
    }
    return data.user?.id ?? null;
  };

  const getOrCreateAnonymousUser = async (): Promise<string> => {
    let uuid = await getUUID();
    if (!uuid) {
      const anonymousUserId = await createAnonymousUser();
      if (!anonymousUserId) {
        throw new Error('Unable to create or retrieve anonymous user ID');
      }
      uuid = anonymousUserId;
      await setUUID(uuid);
    }
    return uuid;
  };

  return { getOrCreateAnonymousUser };
};
