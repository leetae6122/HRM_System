import axiosClient from "./axiosClient";

const leaveApi = {
    countLeave: () => {
        const url = '/leave/count';
        return axiosClient.get(url);
    },
    getAll: () => {
        const url = '/leave/admin';
        return axiosClient.get(url);
    },
    filterAll: (data) => {
        const url = '/leave/filter-all';
        return axiosClient.post(url, data);
    },
    getById: (id) => {
        const url = `/leave/${id}`;
        return axiosClient.get(url);
    },
    employeeGetList: (data) => {
        const url = '/leave/filter';
        return axiosClient.post(url, data);
    },
    adminGetList: (data) => {
        const url = '/leave/admin/filter';
        return axiosClient.post(url, data);
    },
    employeeCreate: (data) => {
        const url = '/leave';
        return axiosClient.post(url, data);
    },
    employeeUpdate: (data) => {
        const url = '/leave';
        return axiosClient.patch(url, data);
    },
    adminCreate: (data) => {
        const url = '/leave/admin';
        return axiosClient.post(url, data);
    },
    adminUpdate: (data) => {
        const url = '/leave/admin';
        return axiosClient.patch(url, data);
    },
    delete: (id) => {
        const url = `/leave/${id}`;
        return axiosClient.delete(url);
    },
}

export default leaveApi;