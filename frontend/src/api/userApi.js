import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const login = async (username, password) => {
  const data = new URLSearchParams();
  data.append("username", username);
  data.append("password", password);

  const response = await axios.post(`${API_BASE_URL}/token`, data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

export const getUsers = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserById = async (id, token) => {
  const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createUser = async (user, token) => {
  const response = await axios.post(`${API_BASE_URL}/users`, user, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUser = async (id, userUpdate, token) => {
  const response = await axios.put(`${API_BASE_URL}/users/${id}`, userUpdate, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
