import axiosClient from "./axiosClient";

const salaryApi = {
    getAll: () => {
        const url = '/salary';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/salary/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/salary/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/salary';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/salary';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/salary/${id}`;
        return axiosClient.delete(url);
    },
}

export default salaryApi;