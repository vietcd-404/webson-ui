import axios from "axios";
import { APP_BASE_URL } from "../configs/constans";

const instance = axios.create({
  baseURL: APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
