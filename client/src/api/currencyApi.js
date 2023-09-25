import axiosClient from "./axiosClient";

const currencyApi = {
    getAll: () => {
        const url = '/currency';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/currency/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/currency/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/currency';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/currency';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/currency/${id}`;
        return axiosClient.delete(url);
    },
}

export default currencyApi;