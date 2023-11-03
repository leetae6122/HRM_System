import axiosClient from "./axiosClient";

const allowanceApi = {
    getAll: () => {
        const url = '/allowance';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/allowance/${id}`;
        return axiosClient.get(url);
    },
    employeeGetList: (data) => {
        const url = '/allowance/filter';
        return axiosClient.post(url, data);
    },
    adminGetList: (data) => {
        const url = '/allowance/admin/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/allowance';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/allowance';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/allowance/${id}`;
        return axiosClient.delete(url);
    },
}

export default allowanceApi;