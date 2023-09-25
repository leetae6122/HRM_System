import axiosClient from "./axiosClient";

const positionApi = {
    getAll: () => {
        const url = '/position';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/position/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/position/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/position';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/position';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/position/${id}`;
        return axiosClient.delete(url);
    },
}

export default positionApi;