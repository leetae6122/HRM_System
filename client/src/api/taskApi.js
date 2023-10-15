import axiosClient from "./axiosClient";

const taskApi = {
    getAll: () => {
        const url = '/task';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/task/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/task/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/task';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/task';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/task/${id}`;
        return axiosClient.delete(url);
    },
}

export default taskApi;