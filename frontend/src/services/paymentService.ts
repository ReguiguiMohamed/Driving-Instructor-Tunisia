
import api from './api';
import { Payment } from '../types';

const API_URL = '/payments';

export const getPayments = async (): Promise<Payment[]> => {
  const response = await api.get(API_URL);
  return response.data as Payment[];
};

export const getPayment = async (id: number): Promise<Payment> => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data as Payment;
};

export const createPayment = async (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
  const response = await api.post(API_URL, payment);
  return response.data as Payment;
};

export const updatePayment = async (id: number, payment: Partial<Payment>): Promise<Payment> => {
  const response = await api.patch(`${API_URL}/${id}`, payment);
  return response.data as Payment;
};

export const deletePayment = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
