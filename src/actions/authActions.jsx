import axios from "axios";

const REGISTER_URL = "/api/auth/register";
const LOGIN_URL = "/api/auth/pro/login";

export async function handleRegister(data) {
  return await axios.post(REGISTER_URL, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
}

export async function handleLogin(data) {
  return await axios.post(LOGIN_URL, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
}
