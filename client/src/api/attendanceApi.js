import axiosClient from "./axiosClient";

const attendanceApi = {
    countAttendance: () => {
        const url = '/attendance/count';
        return axiosClient.get(url);
    },
    getAll: () => {
        const url = '/attendance/admin';
        return axiosClient.get(url);
    },
    filterAll: (data) => {
        const url = '/attendance/filter-all';
        return axiosClient.post(url, data);
    },
    getById: (id) => {
        const url = `/attendance/${id}`;
        return axiosClient.get(url);
    },
    getCurrentAttendance:() => {
        const url = '/attendance/current';
        return axiosClient.get(url);
    },
    employeeGetList: (data) => {
        const url = '/attendance/filter';
        return axiosClient.post(url, data);
    },
    managerGetList: (data) => {
        const url = '/attendance/manager/filter';
        return axiosClient.post(url, data);
    },
    adminGetList: (data) => {
        const url = '/attendance/admin/filter';
        return axiosClient.post(url, data);
    },
    logInAttendance: (data) => {
        const url = '/attendance';
        return axiosClient.post(url, data);
    },
    logOutAttendance: (data) => {
        const url = '/attendance';
        return axiosClient.patch(url, data);
    },
    managerUpdate: (data) => {
        const url = '/attendance/manager';
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