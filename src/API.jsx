import Axios from 'axios';

const API = Axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

export default API;
