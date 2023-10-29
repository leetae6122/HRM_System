import axiosClient from "./axiosClient";

const payrollApi = {
    getAll: () => {
        const url = '/payroll';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/payroll/${id}`;
        return axiosClient.get(url);
    },
    employeeGetList: (data) => {
        const url = '/payroll/filter';
        return axiosClient.post(url, data);
    },
    adminGetList: (data) => {
        const url = '/payroll/admin/filter';
        return axiosClient.post(url, data);
    },
    create: (data) => {
        const url = '/payroll';
        return axiosClient.post(url, data);
    },
    update: (data) => {
        const url = '/payroll';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/payroll/${id}`;
        return axiosClient.delete(url);
    },
}

export default payrollApi;