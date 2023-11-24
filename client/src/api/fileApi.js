import axiosClient from "./axiosClient";

const fileApi = {
    exportExcelDate: (data) => {
        const url = '/file/excel/date';
        return axiosClient.post(url, data, { responseType: 'arraybuffer' });
    },

    exportExcelEmployee: (data) => {
        const url = '/file/excel/employee';
        return axiosClient.post(url, data, { responseType: 'arraybuffer' });
    },

    exportExcelMonthStatistics: (data) => {
        const url = '/file/excel/month-statistics';
        return axiosClient.post(url, data, { responseType: 'arraybuffer' });
    },
}

export default fileApi;