import axiosClient from "./axiosClient";

const userApi = {
    countUser: () => {
        const url = '/user/count';
        return axiosClient.get(url);
    },
    getUserProfile: () => {
        const url = '/user';
        return axiosClient.get(url);
    },
    changePassword: (data) => {
        const url = '/user/change-password';
        return axiosClient.patch(url, data);
    },
    getById: (id) => {
        const url = `/user/admin/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/user/admin/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/user/admin';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/user/admin';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/user/admin/${id}`;
        return axiosClient.delete(url);
    },
}

export default userApi;