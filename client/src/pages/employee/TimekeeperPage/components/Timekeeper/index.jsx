import PropTypes from 'prop-types';
import { Card } from 'antd';
import attendanceApi from 'api/attendanceApi';
import shiftApi from 'api/shiftApi';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import TimekeeperButton from './TimekeeperButton';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentShift } from 'reducers/shift';
import { setAttendanceTimekeeper } from 'reducers/attendance';

Timekeeper.propTypes = {
  refreshAttendance: PropTypes.func,
};

Timekeeper.defaultProps = {
  refreshAttendance: false,
};

function Timekeeper(props) {
  const { refreshAttendance } = props;
  const dispatch = useDispatch();
  const { currentShift } = useSelector((state) => state.shift);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCurrentShift = async () => {
      const data = (await shiftApi.getCurrentShift()).data;
      dispatch(setCurrentShift(data));
    };
    fetchCurrentShift();
    return () => controller.abort();
  }, [dispatch]);

  const getAttendanceTimekeeper = async (attendanceDate, shiftId) => {
    const data = (
      await attendanceApi.getAttendanceByShift({ attendanceDate, shiftId })
    ).data;
    dispatch(setAttendanceTimekeeper(data));
  };

  const handleLogInAttendance = async (values) => {
    try {
      setConfirmLoading(true);
      await attendanceApi.logInAttendance(values);
      await getAttendanceTimekeeper(values.attendanceDate, values.shiftId);
      refreshAttendance(dispatch);
      setConfirmLoading(false);
    } catch (error) {
      toast.error(error);
      setConfirmLoading(false);
    }
  };

  const handleLogOutAttendance = async (values) => {
    try {
      setConfirmLoading(true);
      await attendanceApi.logOutAttendance(values);
      await getAttendanceTimekeeper(values.attendanceDate, values.shiftId);
      refreshAttendance(dispatch);
      setConfirmLoading(false);
    } catch (error) {
      toast.error(error);
      setConfirmLoading(false);
    }
  };
  return (
    <Card>
      <div className="calendar shift">
        <span>
          {currentShift
            ? `Shifts: ${currentShift.name} (${currentShift.startTime} - ${currentShift.endTime})`
            : 'There are currently no shifts available'}
        </span>
      </div>
      {currentShift ? (
        <TimekeeperButton
          onLogin={handleLogInAttendance}
          onLogout={handleLogOutAttendance}
          loading={confirmLoading}
          currentShift={currentShift}
        />
      ) : null}
    </Card>
  );
}

export default Timekeeper;
