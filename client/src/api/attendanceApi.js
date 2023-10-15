import axiosClient from "./axiosClient";

const attendanceApi = {
    getAll: () => {
        const url = '/attendance/admin';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/attendance/${id}`;
        return axiosClient.get(url);
    },
    employeeGetList: (data) => {
        const url = '/attendance/filter';
        return axiosClient.post(url, data);
    },
    adminGetList: (data) => {
        const url = '/attendance/admin/filter';
        return axiosClient.post(url, data);
    },
    employeeCreate: (data) => {
        const url = '/attendance';
        return axiosClient.post(url, data);
    },
    employeeUpdate: (data) => {
        const url = '/attendance';
        return axiosClient.patch(url, data);
    },
    adminUpdate: (data) => {
        const url = '/attendance/admin';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/attendance/${id}`;
        return axiosClient.delete(url);
    },
}

export default attendanceApi;