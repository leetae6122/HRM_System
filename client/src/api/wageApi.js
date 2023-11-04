import axiosClient from "./axiosClient";

const wageApi = {
    getAll: () => {
        const url = '/wage';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/wage/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/wage/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/wage';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/wage';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/wage/${id}`;
        return axiosClient.delete(url);
    },
}

export default wageApi;