import { Col, Row } from 'antd';
import AttendancesLeavesCalendar from './components/AttendancesLeavesCalendar';
import { countDaysInMonth } from 'utils/handleDate';
import 'assets/styles/employeeDashboard.scss';
import CardProgress from './components/CardProgress';
import { green, purple, red, yellow } from '@ant-design/colors';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import attendanceApi from 'api/attendanceApi';
import dayjs from 'dayjs';
import leaveApi from 'api/leaveApi';

const totalWorkday = countDaysInMonth();
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const thisMonth = dayjs().month() + 1;
const thisYear = dayjs().year();

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
            status: ['Pending', 'Approved'],
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
            status: ['Pending', 'Approved'],
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
            leaveFrom: {
              $between: [startDate, endDate],
            },
            leaveTo: {
              $between: [startDate, endDate],
            },
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
        hourSpent += attendance.hourSpent;
        hourOT += attendance.hourOT;
      });
      setTotalHourSpentMonth(hourSpent);
      setTotalHourOT(hourOT);
    };
    const setHoursWeek = () => {
      let hourSpent = 0;
      attendanceWeekList.forEach((attendance) => {
        hourSpent += attendance.hourSpent;
      });
      setTotalHourSpentWeek(hourSpent);
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
              content={`Number of hours worked / ${monthNames[thisMonth]} ${thisYear}`}
              backgroundColor={green[5]}
              percent={Math.round(
                (totalHourSpentMonth / (totalWorkday * 8)) * 100,
              )}
              format={`${totalHourSpentMonth}/${totalWorkday * 8} hrs`}
            />
          </Col>
          <Col span={6}>
            <CardProgress
              content="Number of hours worked / this week"
              backgroundColor={purple[5]}
              percent={Math.round((totalHourSpentWeek / (5 * 8)) * 100)}
              format={`${totalHourSpentWeek}/${5 * 8} hrs`}
            />
          </Col>
          <Col span={6}>
            <CardProgress
              content={`Overtime hours / ${monthNames[thisMonth]} ${thisYear}`}
              backgroundColor={yellow[5]}
              percent={Math.round((totalHourOT / (totalWorkday * 2)) * 100)}
              format={`${totalHourOT}/${totalWorkday * 2} hrs`}
            />
          </Col>
          <Col span={6}>
            <CardProgress
              content={`Number of leaves / ${monthNames[thisMonth]} ${thisYear}`}
              backgroundColor={red[5]}
              percent={100}
              format={`${leaveList.length} leaves`}
              status="exception"
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
