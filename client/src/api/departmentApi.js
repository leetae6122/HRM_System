import axiosClient from "./axiosClient";

const departmentApi = {
    countEmployees: () => {
        const url = '/department/count-employees';
        return axiosClient.get(url);
    },
    getAll: () => {
        const url = '/department';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/department/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/department/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/department';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/department';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/department/${id}`;
        return axiosClient.delete(url);
    },
}

export default departmentApi;