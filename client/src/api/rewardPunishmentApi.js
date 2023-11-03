import axiosClient from "./axiosClient";

const rewardPunishmentApi = {
    getAll: () => {
        const url = '/reward-punishment';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/reward-punishment/${id}`;
        return axiosClient.get(url);
    },
    employeeGetList: (data) => {
        const url = '/reward-punishment/filter';
        return axiosClient.post(url, data);
    },
    adminGetList: (data) => {
        const url = '/reward-punishment/admin/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/reward-punishment';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/reward-punishment';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/reward-punishment/${id}`;
        return axiosClient.delete(url);
    },
}

export default rewardPunishmentApi;