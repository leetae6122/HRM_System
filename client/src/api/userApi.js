import axiosClient from "./axiosClient";

const userApi = {
    getUserProfile: () => {
        const url = '/user';
        return axiosClient.get(url);
    },
    changePassword: (data) => {
        const url = '/user/change-password';
        return axiosClient.patch(url, data);
    },
    getList: (data) => {
        const url = '/user/admin/filter';
        return axiosClient.post(url, data);
    },
}

export default userApi;