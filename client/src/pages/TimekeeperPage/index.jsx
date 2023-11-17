import { useNavigate, useSearchParams } from 'react-router-dom';
import 'assets/styles/authPage.scss';
import logoHrm from 'assets/images/logo-app.jpg';
import { Col, Row, Typography } from 'antd';
import Clock from 'components/Common/Clock';
import TimekeeperLoginForm from './components/TimekeeperLoginForm';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import attendanceApi from 'api/attendanceApi';
import io from 'socket.io-client';

dayjs.extend(utc);

function TimekeeperPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const handleTimekeeperLogin = async (values) => {
    const socket = io(import.meta.env.VITE_API_URL);
    try {
      setLoading(true);
      const token = searchParams.get('token');
      if (!token) {
        toast.error('Token not found');
        setLoading(false);
        return;
      }
      const data = {
        employeeId: values.employeeId,
        inTime: dayjs().utc().format(),
        token,
      };
      const response = await attendanceApi.logInAttendance(data);
      socket.emit('check-in', values.employeeId, dayjs());
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Back to Login',
      }).then((result) => {
        setLoading(false);
        if (result.isConfirmed) {
          navigate('/login');
        }
        socket.disconnect();
      });
    } catch (error) {
      socket.disconnect();
      setLoading(false);
    }
  };
  return (
    <>
      <div className="body-auth">
        <Row>
          <Col className="gutter-row" span={24}>
            <div className="logo">
              <img src={logoHrm} alt="logo" />
            </div>
            <Typography.Title
              level={1}
              style={{ fontWeight: 'bolder', marginInline: 15 }}
            >
              Timekeeper
            </Typography.Title>
          </Col>
          <Col className="gutter-row" style={{ marginBlock: 10 }} span={24}>
            <Clock h24={true} />
          </Col>
          <Col className="gutter-row" span={24}>
            <TimekeeperLoginForm
              onSubmit={handleTimekeeperLogin}
              loading={loading}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default TimekeeperPage;
