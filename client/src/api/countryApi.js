import axiosClient from "./axiosClient";

const countryApi = {
    getAll: () => {
        const url = '/country';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/country/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/country/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/country';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/country';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/country/${id}`;
        return axiosClient.delete(url);
    },
}

export default countryApi;