import PropTypes from 'prop-types';
import { Button, Col, Row, Skeleton } from 'antd';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import employeeApi from 'api/employeeApi';
import dayjs from 'dayjs';
import qrCodeApi from 'api/qrcodeApi';
import io from 'socket.io-client';
import { CloseCircleFilled } from '@ant-design/icons';

QRCodeTimekeeper.propTypes = {
  onClose: PropTypes.func,
  shiftId: PropTypes.number,
  refreshAttendanceList: PropTypes.func,
};

QRCodeTimekeeper.defaultProps = {
  onClose: null,
  shiftId: null,
  refreshAttendanceList: null,
};
function QRCodeTimekeeper(props) {
  const { onClose, shiftId, refreshAttendanceList } = props;
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [employeeIdCheckIn, setEmployeeIdCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    socket.on('check-in', (arr) => {
      if (arr) {
        setEmployeeIdCheckIn({
          employeeId: arr[0],
          date: dayjs(arr[1]).format('DD/MM/YYYY HH:mm:ss'),
        });
        refreshAttendanceList();
      }
    });
    return () => socket.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const checkIn = async () => {
      setLoading(true);
      if (employeeIdCheckIn && employeeIdCheckIn.employeeId) {
        const employee = (
          await employeeApi.getById(employeeIdCheckIn.employeeId)
        ).data;
        if (employee.id && employee.firstName) {
          toast.info(
            `#${employee.id}-${employee.lastName} ${employee.firstName} took attendance at ${employeeIdCheckIn.date}`,
          );
        }
      }
      const data = {
        attendanceDate: dayjs(),
        shiftId,
      };
      const response = await qrCodeApi.createQRCode(data);
      setQrCodeDataUrl(response.data);
      setLoading(false);
    };
    checkIn();
    return () => controller.abort();
  }, [shiftId, employeeIdCheckIn]);

  return (
    <Row justify={'center'} align={'middle'}>
      <Col>
        {loading ? (
          <Skeleton.Image
            active={true}
            style={{ width: '40vh', height: '40vh' }}
          />
        ) : (
          <img style={{ margin: 'auto' }} src={qrCodeDataUrl} alt="QR Code" />
        )}
      </Col>
      <Col span={24}>
        <Button
          htmlType="submit"
          type="primary"
          danger
          onClick={onClose}
          style={{
            marginTop: 20,
            width: '100%',
            height: 40,
            fontSize: 20,
            fontWeight: 'bold',
          }}
          icon={<CloseCircleFilled />}
        >
          Stop
        </Button>
      </Col>
    </Row>
  );
}

export default QRCodeTimekeeper;
