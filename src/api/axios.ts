import * as axios from 'axios';

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 8000,
});

export default instance;
