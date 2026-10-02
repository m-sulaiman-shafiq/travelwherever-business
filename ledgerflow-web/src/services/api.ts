import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  return response.data;
};

export const getMyExpenses = async () => {
  const response = await api.get('/expenses/my');
  return response.data;
};

export const createExpense = async (data: {
  category: string;
  accountId: string;
  description?: string;
  amount: number;
  vatAmount: number;
  currency: string;
  expenseDate: string;
}) => {
  const response = await api.post('/expenses', data);
  return response.data;
};

export const getCompanyExpenses = async () => {
  const response = await api.get('/expenses');
  return response.data;
};

export const getSummary = async () => {
  const response = await api.get('/expenses/summary');
  return response.data;
};

export const approveExpense = async (id: string) => {
  const response = await api.patch(`/expenses/${id}/approve`);
  return response.data;
};

export const rejectExpense = async (id: string) => {
  const response = await api.patch(`/expenses/${id}/reject`);
  return response.data;
};
export const getTeamMembers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createEmployee = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post('/users', data);
  return response.data;
};
export const getAccounts = async () => {
  const response = await api.get('/accounts');
  return response.data;
};

export const createAccount = async (data: {
  name: string;
  type: string;
  code?: string;
}) => {
  const response = await api.post('/accounts', data);
  return response.data;
};

export const getExpenseAccounts = async () => {
  const response = await api.get('/accounts');
  return response.data.filter(
    (account: { type: string }) => account.type === 'EXPENSE',
  );
};

export default api;
