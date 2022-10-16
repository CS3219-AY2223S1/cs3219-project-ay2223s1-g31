import axios from "axios";

export default axios.create({
  baseURL: process.env.USER_SVC_URL || "http://localhost:8000/api/user",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
