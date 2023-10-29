import PropTypes from 'prop-types';
import { Button, Col, Row } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import attendanceApi from 'api/attendanceApi';
import { setAttendanceTimekeeper } from 'reducers/attendance';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

TimekeeperButton.propTypes = {
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  loading: PropTypes.bool,
  currentShift: PropTypes.object,
};

TimekeeperButton.defaultProps = {
  onLogin: null,
  onLogout: null,
  loading: false,
  currentShift: {},
};

function TimekeeperButton(props) {
  const dispatch = useDispatch();
  const { onLogin, onLogout, loading, currentShift } = props;
  const { attendanceTimekeeper } = useSelector((state) => state.attendance);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      if (currentShift) {
        const payload = {
          attendanceDate: dayjs().toDate(),
          shiftId: currentShift.id,
        };
        const data = (await attendanceApi.getAttendanceByShift(payload)).data;
        dispatch(setAttendanceTimekeeper(data));
      }
    };
    fetchData();
    return () => controller.abort();
  }, [dispatch, currentShift]);

  const logInAttendance = () => {
    const payload = {
      shiftId: currentShift.id,
      attendanceDate: dayjs(),
      inTime: dayjs(),
    };
    onLogin(payload);
  };

  const logOutAttendance = () => {
    const payload = {
      shiftId: currentShift.id,
      attendanceDate: dayjs(),
      outTime: dayjs(),
    };
    onLogout(payload);
  };

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={6}>
        <Button
          type="primary"
          icon={<LoginOutlined />}
          loading={loading}
          onClick={logInAttendance}
          disabled={
            attendanceTimekeeper
              ? attendanceTimekeeper.inTime
                ? true
                : false
              : true
          }
          style={{
            width: '100%',
            height: 60,
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          Login
        </Button>
      </Col>
      <Col span={6}>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          danger
          loading={loading}
          onClick={logOutAttendance}
          disabled={
            attendanceTimekeeper &&
            attendanceTimekeeper.inTime &&
            !attendanceTimekeeper.outTime &&
            dayjs() > dayjs(attendanceTimekeeper.inTime, 'HH:mm:ss')
              ? false
              : true
          }
          style={{
            width: '100%',
            height: 60,
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          Logout
        </Button>
      </Col>
    </Row>
  );
}

TimekeeperButton.propTypes = {};

export default TimekeeperButton;
