// IndexedDB based mock API for offline usage
// Provides a minimal axios-like interface with get/post/patch/delete methods

import { getItem, setItem } from './storage';

export type RecordData = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

const parseUrl = (url: string): { collection: string; id: number | null } => {
  const parts = url.split('/').filter(Boolean);
  const collection = parts[0];
  const maybeId = parts.length > 1 ? Number(parts[1]) : NaN;
  return { collection, id: Number.isFinite(maybeId) ? maybeId : null };
};

const load = async (collection: string): Promise<RecordData[]> => {
  return (await getItem<RecordData[]>(collection)) ?? [];
};

const save = async (collection: string, data: RecordData[]): Promise<void> => {
  await setItem(collection, data);
};

const delay = (ms = 50) => new Promise((res) => setTimeout(res, ms));

const api = {
  get: async (url: string) => {
    const { collection, id } = parseUrl(url);
    const data = await load(collection);
    await delay();
    if (id === null) {
      return { data };
    }
    return { data: data.find((item) => item.id === id) };
  },
  post: async (url: string, payload: any) => {
    const { collection } = parseUrl(url);
    const data = await load(collection);
    const item: RecordData = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    data.push(item);
    await save(collection, data);
    await delay();
    return { data: item };
  },
  patch: async (url: string, payload: any) => {
    const { collection, id } = parseUrl(url);
    const data = await load(collection);
    const idx = data.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error('Item not found');
    data[idx] = { ...data[idx], ...payload, updatedAt: new Date().toISOString() };
    await save(collection, data);
    await delay();
    return { data: data[idx] };
  },
  delete: async (url: string) => {
    const { collection, id } = parseUrl(url);
    const data = await load(collection);
    const filtered = data.filter((item) => item.id !== id);
    await save(collection, filtered);
    await delay();
    return { data: null };
  },
};

export default api;
