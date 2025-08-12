
import api from './api';
import { Lesson } from '../types';

const API_URL = '/lessons';

export const getLessons = async (): Promise<Lesson[]> => {
  const response = await api.get(API_URL);
  return response.data as Lesson[];
};

export const getLesson = async (id: number): Promise<Lesson> => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data as Lesson;
};

export const createLesson = async (lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lesson> => {
  const response = await api.post(API_URL, lesson);
  return response.data as Lesson;
};

export const updateLesson = async (id: number, lesson: Partial<Lesson>): Promise<Lesson> => {
  const response = await api.patch(`${API_URL}/${id}`, lesson);
  return response.data as Lesson;
};

export const deleteLesson = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
