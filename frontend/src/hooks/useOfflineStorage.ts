import { useCallback, useEffect, useState } from 'react';
import { getItem, setItem } from '../services/storage';

/**
 * Hybrid online/offline data handler.
 * Stores API data in IndexedDB when online and
 * retrieves cached data when offline.
 */
export const useOfflineStorage = <T>(
  key: string,
  fetcher: () => Promise<T>
) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  const syncData = useCallback(async () => {
    if (isOnline) {
      const data = await fetcher();
      await setItem(key, data);
    }
  }, [isOnline, fetcher, key]);

  const getData = useCallback(async (): Promise<T> => {
    if (isOnline) {
      const data = await fetcher();
      await setItem(key, data);
      return data;
    }
    const cached = await getItem<T>(key);
    return cached ?? ([] as unknown as T);
  }, [isOnline, fetcher, key]);

  return { isOnline, syncData, getData };
};

export default useOfflineStorage;

