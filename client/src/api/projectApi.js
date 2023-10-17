import axiosClient from "./axiosClient";

const projectApi = {
    countProject: () => {
        const url = '/project/count';
        return axiosClient.get(url);
    },
    getAll: () => {
        const url = '/project';
        return axiosClient.get(url);
    },
    filterAll: (data) => {
        const url = '/project/filter-all';
        return axiosClient.post(url, data);
    },
    getById: (id) => {
        const url = `/project/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/project/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/project';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/project';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/project/${id}`;
        return axiosClient.delete(url);
    },
}

export default projectApi;