import axios from "axios";

const API_URL = "https://todo-backend-6c6i.onrender.com/users";

const getUserByUsername = async (username) => {
  const res = await axios.get(`${API_URL}?username=${username}`);
  return res.data[0];
};

export const createUser = async ({ username, password }) => {
  const res = await axios.post(API_URL, { username, password, role: "user" });
  return res.data;
};

export default getUserByUsername;
