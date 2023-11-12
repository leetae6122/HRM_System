import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Modal, Row } from 'antd';
import { toast } from 'react-toastify';
import qrCodeApi from 'api/qrcodeApi';
import dayjs from 'dayjs';
import CreateQRCodeForm from './CreateQRCodeForm';
import io from 'socket.io-client';
import employeeApi from 'api/employeeApi';

ModalTimekeeper.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalTimekeeper.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

function ModalTimekeeper(props) {
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const socket = io(import.meta.env.VITE_API_URL);

  const handleCreateQRCode = async (values) => {
    try {
      setConfirmLoading(true);
      const data = {
        attendanceDate: dayjs(),
        shiftId: values.shiftId,
      };
      const response = await qrCodeApi.createQRCode(data);
      setQrCodeDataUrl(response.data);
      socket.on('check-in', async (employeeId) => {
        if (employeeId) {
          const employee = (await employeeApi.getById(employeeId)).data;
          if (employee.id && employee.firstName) {
            toast.info(
              `${employee.id}-${employee.firstName} ${
                employee.lastName
              } took attendance at ${dayjs().format('DD/MM/YYYY HH:mm:ss')}`,
              {
                position: 'top-right',
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
              },
            );
          }
        }
        const response = await qrCodeApi.createQRCode(data);
        setQrCodeDataUrl(response.data);
      });
      setConfirmLoading(false);
    } catch (error) {
      toast.error(error);
      setConfirmLoading(false);
    }
  };

  const handleStopCreateQRCode = () => {
    toggleShowModal();
    socket.disconnect();
  };

  return (
    <>
      <Modal
        title={'QR Code Timekeeper'}
        open={openModal}
        onCancel={handleStopCreateQRCode}
        footer={null}
        maskClosable={false}
      >
        {qrCodeDataUrl ? (
          <Row justify={'center'} align={'middle'}>
            <Col>
              <img
                style={{ margin: 'auto' }}
                src={qrCodeDataUrl}
                alt="QR Code"
              />
            </Col>
            <Col span={24}>
              <Button
                htmlType="submit"
                type="primary"
                danger
                onClick={() => handleStopCreateQRCode()}
                style={{
                  marginTop: 20,
                  width: '100%',
                  height: 40,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                Stop
              </Button>
            </Col>
          </Row>
        ) : (
          <CreateQRCodeForm
            onSubmit={handleCreateQRCode}
            loading={confirmLoading}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalTimekeeper;
