import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  
  // Clean the URL: remove trailing slashes, then append /api if missing
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const instance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

export default instance;
