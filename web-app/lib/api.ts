import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getTests = async () => {
  const response = await api.get('/tests');
  return response.data;
};

export const getTestById = async (id: string) => {
  const response = await api.get(`/tests/${id}`);
  return response.data;
};

export const getFlashcardsDue = async (userId: string) => {
  const response = await api.get(`/flashcards/due?userId=${userId}`);
  return response.data;
};

export const reviewFlashcard = async (userId: string, flashcardId: string, rating: number) => {
  const response = await api.post('/flashcards/review', {
    userId,
    flashcardId,
    rating,
  });
  return response.data;
};

export async function getFlashcardStats(userId: string) {
  const res = await api.get(`/flashcards/stats?userId=${userId}`);
  return res.data;
}

export async function learnNewCards(userId: string, count: number = 10) {
  const res = await api.post(`/flashcards/${userId}/learn`, { count });
  return res.data;
};

// Test Sessions
export const startTestSession = async (userId: string, testId: string) => {
  const response = await api.post('/test-sessions/start', { userId, testId });
  return response.data;
};

export const submitTestSession = async (
  sessionId: string,
  answers: Array<{ questionId: string; selectedOption: string }>,
  durationTaken: number,
) => {
  const response = await api.post(`/test-sessions/${sessionId}/submit`, {
    answers,
    durationTaken,
  });
  return response.data;
};

export const getSessionResult = async (sessionId: string) => {
  const response = await api.get(`/test-sessions/${sessionId}/result`);
  return response.data;
};

export const getUserTestHistory = async (userId: string) => {
  const response = await api.get(`/test-sessions/history?userId=${userId}`);
  return response.data;
};

// Admin API functions
export const createTest = async (data: any) => {
  const response = await api.post('/tests', data);
  return response.data;
};

export const updateTest = async (id: string, data: any) => {
  const response = await api.patch(`/tests/${id}`, data);
  return response.data;
};

export const deleteTest = async (id: string) => {
  const response = await api.delete(`/tests/${id}`);
  return response.data;
};

export default api;
