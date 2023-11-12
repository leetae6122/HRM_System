import axiosClient from "./axiosClient";

const qrCodeApi = {
    createQRCode: (data) => {
        const url = '/qr-code';
        return axiosClient.post(url, data);
    },
    deleteQRCode: (id) => {
        const url = `/qr-code/${id}`;
        return axiosClient.delete(url);
    },
}

export default qrCodeApi;