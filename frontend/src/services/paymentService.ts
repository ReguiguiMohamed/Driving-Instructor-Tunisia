
import axios from 'axios';
import { Payment } from '../types';

const API_URL = '/payments';

export const getPayments = async (): Promise<Payment[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPayment = async (id: number): Promise<Payment> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createPayment = async (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
  const response = await axios.post(API_URL, payment);
  return response.data;
};

export const updatePayment = async (id: number, payment: Partial<Payment>): Promise<Payment> => {
  const response = await axios.patch(`${API_URL}/${id}`, payment);
  return response.data;
};

export const deletePayment = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
