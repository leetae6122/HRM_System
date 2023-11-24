import { Col, Row } from 'antd';
import AttendancesLeavesCalendar from './components/AttendancesLeavesCalendar';
import 'assets/styles/employeeDashboard.scss';
import CardProgress from './components/CardProgress';
import { green, purple, red, yellow } from '@ant-design/colors';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import attendanceApi from 'api/attendanceApi';
import dayjs from 'dayjs';
import leaveApi from 'api/leaveApi';
import { getMonthName } from 'utils/handleDate';

function DashboardPage() {
  const [totalHourSpentMonth, setTotalHourSpentMonth] = useState(0);
  const [totalHourSpentWeek, setTotalHourSpentWeek] = useState(0);
  const [totalHourOT, setTotalHourOT] = useState(0);
  const [attendanceMonthList, setAttendanceMonthList] = useState([]);
  const [attendanceWeekList, setAttendanceWeekList] = useState([]);
  const [leaveList, setLeaveList] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const startDate = dayjs().startOf('month').utc().format();
    const endDate = dayjs().endOf('month').utc().format();
    const fetchAttendancesMonth = async () => {
      try {
        const response = await attendanceApi.filterAll({
          where: {
            attendanceDate: {
              $between: [startDate, endDate],
            },
          },
        });
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        setAttendanceMonthList(data);
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchAttendancesWeek = async () => {
      try {
        const response = await attendanceApi.filterAll({
          where: {
            attendanceDate: {
              $between: [
                dayjs().startOf('week').utc().format(),
                dayjs().endOf('week').utc().format(),
              ],
            },
          },
        });
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        setAttendanceWeekList(data);
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchLeaves = async () => {
      try {
        const response = await leaveApi.filterAll({
          where: {
            status: ['Approved'],
            $or: [
              {
                leaveFrom: {
                  $between: [startDate, endDate],
                },
              },
              {
                leaveTo: {
                  $between: [startDate, endDate],
                },
              },
            ],
          },
        });
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        setLeaveList(data);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchLeaves();
    fetchAttendancesMonth();
    fetchAttendancesWeek();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const setHoursMonth = () => {
      let hourSpent = 0;
      let hourOT = 0;
      attendanceMonthList.forEach((attendance) => {
        if (attendance.shiftData.overtimeShift) {
          hourOT += attendance.totalHours ?? 0;
        } else {
          hourSpent += attendance.totalHours ?? 0;
        }
      });
      setTotalHourSpentMonth(
        hourSpent > 0
          ? (Math.round(hourSpent * 100) / 100).toFixed(2)
          : hourSpent,
      );
      setTotalHourOT(
        hourOT > 0 ? (Math.round(hourOT * 100) / 100).toFixed(2) : hourOT,
      );
    };
    const setHoursWeek = () => {
      let hourSpent = 0;
      attendanceWeekList.forEach((attendance) => {
        if (!attendance.shiftData.overtimeShift) {
          hourSpent += attendance.totalHours ?? 0;
        }
      });
      setTotalHourSpentWeek(
        hourSpent > 0
          ? (Math.round(hourSpent * 100) / 100).toFixed(2)
          : hourSpent,
      );
    };
    setHoursMonth();
    setHoursWeek();
  }, [attendanceMonthList, attendanceWeekList]);

  return (
    <Row gutter={[8, 16]}>
      <Col span={24} style={{}}>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <CardProgress
              content={`Number of hours worked / ${getMonthName(dayjs())}`}
              backgroundColor={green[5]}
              percent={100}
              format={`${totalHourSpentMonth} hrs`}
              type={'circle'}
            />
          </Col>
          <Col span={6}>
            <CardProgress
              content="Number of hours worked / this week"
              backgroundColor={purple[5]}
              percent={100}
              format={`${totalHourSpentWeek} hrs`}
              type={'circle'}
            />
          </Col>
          <Col span={6}>
            <CardProgress
              content={`Overtime hours / ${getMonthName(dayjs())}`}
              backgroundColor={yellow[5]}
              percent={100}
              format={`${totalHourOT} hrs`}
              type={'circle'}
            />
          </Col>
          <Col span={6}>
            <CardProgress
              content={`Number of leaves / ${getMonthName(dayjs())}`}
              backgroundColor={red[5]}
              percent={100}
              format={`${leaveList.length} leaves`}
              status="exception"
              type={'circle'}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <AttendancesLeavesCalendar />
      </Col>
    </Row>
  );
}

export default DashboardPage;
