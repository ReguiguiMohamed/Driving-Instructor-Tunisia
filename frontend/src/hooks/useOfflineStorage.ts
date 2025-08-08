import { useCallback, useEffect, useState } from 'react';

/**
 * Hybrid online/offline data handler.
 * Stores API data in localStorage when online and
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
      localStorage.setItem(key, JSON.stringify(data));
    }
  }, [isOnline, fetcher, key]);

  const getData = useCallback(async (): Promise<T> => {
    if (isOnline) {
      const data = await fetcher();
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    }
    const cached = localStorage.getItem(key);
    return cached ? (JSON.parse(cached) as T) : ([] as unknown as T);
  }, [isOnline, fetcher, key]);

  return { isOnline, syncData, getData };
};

export default useOfflineStorage;

