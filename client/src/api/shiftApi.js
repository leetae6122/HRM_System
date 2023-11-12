import axiosClient from "./axiosClient";

const shiftApi = {
    getAll: () => {
        const url = '/shift';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/shift/${id}`;
        return axiosClient.get(url);
    },
    getCurrentShiftList: () => {
        const url = '/shift/current/list';
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/shift/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/shift';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/shift';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/shift/${id}`;
        return axiosClient.delete(url);
    },
}

export default shiftApi;