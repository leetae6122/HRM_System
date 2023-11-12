import { useNavigate, useSearchParams } from 'react-router-dom';
import 'assets/styles/authPage.scss';
import logoHrm from 'assets/images/logo-app.jpg';
import { Col, Row } from 'antd';
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
    try {
      const socket = io(import.meta.env.VITE_API_URL);
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
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Back to Login',
      }).then((result) => {
        setLoading(false);
        socket.emit('check-in', data.employeeId);
        if (result.isConfirmed) {
          socket.disconnect();
          navigate('/login');
        }
      });
    } catch (error) {
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
          </Col>
          <Col className="gutter-row" style={{ marginBottom: 10 }} span={24}>
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
