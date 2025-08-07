
import axios from 'axios';
import { Lesson } from '../types';

const API_URL = '/lessons';

export const getLessons = async (): Promise<Lesson[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getLesson = async (id: number): Promise<Lesson> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createLesson = async (lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lesson> => {
  const response = await axios.post(API_URL, lesson);
  return response.data;
};

export const updateLesson = async (id: number, lesson: Partial<Lesson>): Promise<Lesson> => {
  const response = await axios.patch(`${API_URL}/${id}`, lesson);
  return response.data;
};

export const deleteLesson = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
