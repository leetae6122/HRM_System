import axios from 'axios';
// import queryString from 'query-string';
import Cookies from "universal-cookie";
import { toast } from 'react-toastify';
import authApi from './authApi';
import jwtDecode from 'jwt-decode';

const cookies = new Cookies();

const checkExp = (tokenExp) => {
    const dateNow = new Date();
    return tokenExp > dateNow.getTime() / 1000;
};

const checkAccessToken = async () => {
    const accessToken = cookies.get('access_token');
    const refreshToken = cookies.get('refresh_token');
    if (accessToken) {
        const accessTokenExp = jwtDecode(accessToken).exp;
        if (checkExp(accessTokenExp)) {
            return true;
        }
    }
    if (refreshToken) {
        const refreshTokenExp = jwtDecode(refreshToken).exp;
        if (checkExp(refreshTokenExp)) {
            const response = await authApi.refreshToken(refreshToken);
            cookies.set('access_token', response.accessToken, { path: '/' });
            cookies.set('refresh_token', response.refreshToken, {
                path: '/',
            });
            return true;
        }
    }
    return false;
}

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'content-type': 'application/json',
        "Access-Control-Allow-Credentials": true,
    },
    // paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    console.log(config.headers.Authorization);
    if (!config.headers.Authorization) {
        const stillExpired = await checkAccessToken();
        if (!stillExpired) {
            window.location.replace('/auth/login');
        }
        const accessToken = cookies.get('access_token');
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    if(config.headers.Authorization === 'Bearer'){
        delete config.headers.Authorization
    }
    config.url = `/api${config.url}`
    // Handle token here ...
    return config;
})

axiosClient.interceptors.response.use(async (response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    // Handle errors
    if (error.response.status === 500) {
        if (error.response.data.message.toString() === 'jwt malformed') {
            window.location.replace('/auth/login');
            return;
        }
        toast.error(error.response.data.message ? error.response.data.message.toString() : error.response.statusText.toString());
        return;
    }
    // if (error.response.data.status === 401
    //     && error.response.data.message === 'Access Token expired'
    // ) {
    //     window.location.replace('/auth/login');
    // }
    toast.error(error.response.data.message.toString());
    throw error;
});
export default axiosClient;