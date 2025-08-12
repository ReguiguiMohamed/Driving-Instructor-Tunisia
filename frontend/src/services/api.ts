// Local storage based mock API for offline usage
// Provides a minimal axios-like interface with get/post/patch/delete methods

export type RecordData = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

const parseUrl = (url: string): { collection: string; id: number | null } => {
  const parts = url.split('/').filter(Boolean);
  const collection = parts[0];
  const id = parts.length > 1 ? parseInt(parts[1], 10) : null;
  return { collection, id };
};

const load = (collection: string): RecordData[] => {
  const raw = localStorage.getItem(collection);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RecordData[];
  } catch {
    return [];
  }
};

const save = (collection: string, data: RecordData[]): void => {
  localStorage.setItem(collection, JSON.stringify(data));
};

const delay = (ms = 50) => new Promise((res) => setTimeout(res, ms));

const api = {
  get: async (url: string) => {
    const { collection, id } = parseUrl(url);
    const data = load(collection);
    await delay();
    if (id === null) {
      return { data };
    }
    return { data: data.find((item) => item.id === id) };
  },
  post: async (url: string, payload: any) => {
    const { collection } = parseUrl(url);
    const data = load(collection);
    const item: RecordData = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    data.push(item);
    save(collection, data);
    await delay();
    return { data: item };
  },
  patch: async (url: string, payload: any) => {
    const { collection, id } = parseUrl(url);
    const data = load(collection);
    const idx = data.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error('Item not found');
    data[idx] = { ...data[idx], ...payload, updatedAt: new Date().toISOString() };
    save(collection, data);
    await delay();
    return { data: data[idx] };
  },
  delete: async (url: string) => {
    const { collection, id } = parseUrl(url);
    const data = load(collection);
    const filtered = data.filter((item) => item.id !== id);
    save(collection, filtered);
    await delay();
    return { data: null };
  },
};

export default api;
