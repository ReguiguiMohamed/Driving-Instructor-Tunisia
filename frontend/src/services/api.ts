
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://drivinginstructorapp-production.up.railway.app',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});

export default instance;
