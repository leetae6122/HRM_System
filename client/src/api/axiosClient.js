import axios from 'axios';
// import queryString from 'query-string';
import Cookies from "universal-cookie";
import { toast } from 'react-toastify';

const cookies = new Cookies();

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'content-type': 'application/json',
        "Access-Control-Allow-Credentials": true,
    },
    // paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    if (!config.headers.Authorization) {
        const accessToken = cookies.get('access_token');
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    config.url = `/api${config.url}`
    // Handle token here ...
    return config;
})

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    // Handle errors
    console.log(error.response);
    if (error.response.status === 401) {
        window.location.replace('/auth/login')
    }
    toast.error(error.response.data.message.toString());
    throw error;
});
export default axiosClient;