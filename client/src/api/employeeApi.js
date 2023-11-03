import axiosClient from "./axiosClient";
import FormData from 'form-data';

const employeeApi = {
    countEmployee: () => {
        const url = '/employee/count';
        return axiosClient.get(url);
    },
    getAll: () => {
        const url = '/employee/admin';
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
    getEmployeeNotHaveUser: () => {
        const url = '/employee/admin/not-have-user';
        return axiosClient.get(url);
    },
    updatePersonal: (data) => {
        const url = '/employee';
        return axiosClient.patch(url, data);
    },
    create: (data) => {
        const url = '/employee/admin';
        const formData = new FormData();
        formData.append("avatar", data.avatar);
        delete data.avatar;
        for ( var key in data ) {
            formData.append(key, data[key]);
        }
        return axiosClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },
    update: (data) => {
        const url = '/employee/admin';
        const formData = new FormData();
        formData.append("avatar", data.avatar);
        delete data.avatar;
        for ( var key in data ) {
            formData.append(key, data[key]);
        }
        return axiosClient.patch(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },
    delete: (id) => {
        const url = `/employee/${id}`;
        return axiosClient.delete(url);
    },
    updateAvatar: (file) => {
        const url = `/employee/avatar`;
        const data = new FormData();
        data.append("avatar", file);
        return axiosClient.put(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }
}

export default employeeApi;