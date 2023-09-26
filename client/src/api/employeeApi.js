import axiosClient from "./axiosClient";

const employeeApi = {
    getAll: () => {
        const url = '/employee';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/employee/${id}`;
        return axiosClient.get(url);
    },
    getList: (data) => {
        const url = '/employee/admin/filter';
        return axiosClient.post(url, data);
    },
    updatePersonal:(data) => {
        const url = '/employee';
        return axiosClient.patch(url, data);
    },
    create: (data) => {
        const url = '/employee/admin';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/employee/admin';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/employee/${id}`;
        return axiosClient.delete(url);
    },
}

export default employeeApi;