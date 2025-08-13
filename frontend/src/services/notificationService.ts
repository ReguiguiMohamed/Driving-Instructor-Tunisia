import api from './api';
import type { Notification as AppNotification } from '../types';

const API_URL = '/notifications';

export const getNotifications = async (): Promise<AppNotification[]> => {
  const response = await api.get(API_URL);
  return response.data as AppNotification[];
};

export const getPendingNotifications = async (): Promise<AppNotification[]> => {
  const response = await api.get(API_URL);
  return (response.data as AppNotification[] || []).filter((n: AppNotification) => !n.isSent);
};

export const createNotification = async (
  notification: Omit<AppNotification, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AppNotification> => {
  const response = await api.post(API_URL, notification);
  return response.data as AppNotification;
};

export const updateNotification = async (
  id: number,
  notification: Partial<AppNotification>
): Promise<AppNotification> => {
  const response = await api.patch(`${API_URL}/${id}`, notification);
  return response.data as AppNotification;
};

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};

export const markNotificationAsSent = async (id: number): Promise<AppNotification> => {
  const response = await api.patch(`${API_URL}/${id}`, { isSent: true });
  return response.data as AppNotification;
};