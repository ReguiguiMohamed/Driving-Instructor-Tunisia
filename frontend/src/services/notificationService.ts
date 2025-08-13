import api from './api';
import type { Notification } from '../types';

const API_URL = '/notifications';

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get(API_URL);
  return response.data as Notification[];
};

export const getPendingNotifications = async (): Promise<Notification[]> => {
  const response = await api.get(API_URL);
  return (response.data as Notification[] || []).filter((n: Notification) => !n.isSent);
};

export const createNotification = async (
  notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Notification> => {
  const response = await api.post(API_URL, notification);
  return response.data as Notification;
};

export const updateNotification = async (
  id: number,
  notification: Partial<Notification>
): Promise<Notification> => {
  const response = await api.patch(`${API_URL}/${id}`, notification);
  return response.data as Notification;
};

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};

export const markNotificationAsSent = async (id: number): Promise<Notification> => {
  const response = await api.patch(`${API_URL}/${id}`, { isSent: true });
  return response.data as Notification;
};