import axiosClient from "./axiosClient";

const authApi = {
    login: (data) => {
        const url = '/auth/login';
        return axiosClient.post(url, data, {
            headers: { "Authorization": `Bearer` }
        });
    },

    logout: () => {
        const url = '/auth/logout';
        return axiosClient.post(url);
    },

    refreshToken: (token) => {
        const url = '/auth/refresh-token';
        return axiosClient.post(url, {}, {
            headers: { "Authorization": `Bearer ${token}` }
        });
    },

    forgotPassword: (data) => {
        const url = '/auth/forgot-password';
        return axiosClient.post(url, data, {
            headers: { "Authorization": `Bearer` }
        });
    },

    resetPassword: (data) => {
        const url = '/auth/reset-password';
        return axiosClient.post(url, data, {
            headers: { "Authorization": `Bearer` }
        });
    },
}

export default authApi;