import axiosClient from "./axiosClient";

const officeApi = {
    getAll: () => {
        const url = '/office';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/office/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/office/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/office';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/office';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/office/${id}`;
        return axiosClient.delete(url);
    },
}

export default officeApi;