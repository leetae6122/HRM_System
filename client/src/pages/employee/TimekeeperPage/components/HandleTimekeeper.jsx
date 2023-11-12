import PropTypes from 'prop-types';
import { Button, Card, Col, Row } from 'antd';
import attendanceApi from 'api/attendanceApi';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { LogoutOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';

HandleTimekeeper.propTypes = {
  refreshAttendance: PropTypes.func,
};

HandleTimekeeper.defaultProps = {
  refreshAttendance: false,
};

function HandleTimekeeper(props) {
  const { refreshAttendance } = props;
  const dispatch = useDispatch();
  const [currentAttendance, setCurrentAttendance] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCurrentAttendance = async () => {
      const data = (await attendanceApi.getCurrentAttendance()).data;
      setCurrentAttendance(data);
    };
    fetchCurrentAttendance();
    return () => controller.abort();
  }, []);

  const handleLogOutAttendance = async () => {
    setConfirmLoading(true);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout!',
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          const payload = {
            attendanceId: currentAttendance.id,
            outTime: dayjs(),
          };
          await attendanceApi.logOutAttendance(payload);
          refreshAttendance(dispatch);
          const data = (await attendanceApi.getCurrentAttendance()).data;
          setCurrentAttendance(data);
          setConfirmLoading(false);
        }
      })
      .catch((error) => {
        setConfirmLoading(false);
        toast.error(error);
      });
  };

  return (
    <Card>
      <div className="calendar shift">
        <span>
          {currentAttendance
            ? `Shifts: ${currentAttendance.shiftData.name} (${currentAttendance.shiftData.startTime} - ${currentAttendance.shiftData.endTime})`
            : 'Not currently on any shift'}
        </span>
      </div>
      {currentAttendance ? (
        <Row align={'middle'} justify={'center'}>
          <Col>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              danger
              loading={confirmLoading}
              onClick={handleLogOutAttendance}
              disabled={
                currentAttendance &&
                currentAttendance.inTime &&
                !currentAttendance.outTime &&
                dayjs() >
                  dayjs(currentAttendance.inTime, 'HH:mm:ss').add(
                    30,
                    'minute',
                  ) &&
                dayjs() >
                  dayjs(currentAttendance.shiftData.startTime, 'HH:mm:ss').add(
                    30,
                    'minute',
                  )
                  ? false
                  : true
              }
              style={{
                width: '60vh',
                height: 60,
                fontSize: 24,
                fontWeight: 'bold',
              }}
            >
              Logout
            </Button>
          </Col>
        </Row>
      ) : null}
    </Card>
  );
}

export default HandleTimekeeper;
