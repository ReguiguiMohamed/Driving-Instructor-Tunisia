
import api from './api';
import { Student } from '../types';

const API_URL = '/students';

export const getStudents = async (): Promise<Student[]> => {
  const response = await api.get(API_URL);
  return response.data as unknown as Student[];
};

export const getStudent = async (id: number): Promise<Student> => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data as unknown as Student;
};

export const createStudent = async (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> => {
  const response = await api.post(API_URL, student);
  return response.data as unknown as Student;
};

export const updateStudent = async (id: number, student: Partial<Student>): Promise<Student> => {
  const response = await api.patch(`${API_URL}/${id}`, student);
  return response.data as unknown as Student;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
