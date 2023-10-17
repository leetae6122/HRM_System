import { Badge, Button, Calendar, Card, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import leaveApi from 'api/leaveApi';
import attendanceApi from 'api/attendanceApi';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);
const getListData = (current, value, attendances, leaves) => {
  const startDate = dayjs(current).startOf('month');
  const endDate = dayjs(current).endOf('month');
  if (value < startDate || value > endDate) return [];

  let listData = [];
  attendances.forEach((attendance) => {
    if (value.isSame(attendance.attendanceDate, 'day')) {
      if (attendance.status === 'Pending') {
        listData.push({
          key: attendance.id,
          title: 'attendance',
          type: 'warning',
          content: (
            <span>
              {`#${attendance.id}`} Wait
              <br />
              for approval
            </span>
          ),
        });
      }
      if (attendance.status === 'Approved') {
        listData.push({
          key: attendance.id,
          title: 'attendance',
          type: 'success',
          content: (
            <span>
              {`#${attendance.id}`}
              <br />
              Attendance
              <br />
              approved
            </span>
          ),
        });
      }
    }
  });

  leaves.forEach((leave) => {
    if (value.isBetween(leave.leaveFrom, leave.leaveTo, 'day', '[]')) {
      if (leave.status === 'Pending') {
        listData.push({
          key: leave.id,
          title: 'leave',
          type: 'warning',
          content: leave.title,
        });
      }
      if (leave.status === 'Approved') {
        listData.push({
          key: leave.id,
          title: 'leave',
          type: 'success',
          content: leave.title,
        });
      }
    }
  });
  return listData;
};

function AttendancesLeavesCalendar() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [filterAttendance, setFilterAttendance] = useState({
    where: {
      attendanceDate: {
        $between: [
          dayjs().startOf('month').utc().format(),
          dayjs().endOf('month').utc().format(),
        ],
      },
      status: ['Pending', 'Approved'],
    },
  });
  const [leaveList, setLeaveList] = useState([]);
  const [filterLeave, setFilterLeave] = useState({
    where: {
      status: ['Pending', 'Approved'],
      $or: [
        {
          leaveFrom: {
            $between: [
              dayjs().startOf('month').utc().format(),
              dayjs().endOf('month').utc().format(),
            ],
          },
        },
        {
          leaveTo: {
            $between: [
              dayjs().startOf('month').utc().format(),
              dayjs().endOf('month').utc().format(),
            ],
          },
        },
      ],
    },
  });
  const [value, setValue] = useState(dayjs());

  useEffect(() => {
    const controller = new AbortController();
    const fetchLeaves = async () => {
      try {
        const response = await leaveApi.filterAll(filterLeave);
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        setLeaveList(data);
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchAttendances = async () => {
      try {
        const response = await attendanceApi.filterAll(filterAttendance);
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        setAttendanceList(data);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchLeaves();
    fetchAttendances();
    return () => controller.abort();
  }, [filterLeave, filterAttendance]);

  const dateCellRender = (date) => {
    const listData = getListData(value, date, attendanceList, leaveList);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.key}>
            {item.title === 'attendance' ? (
              <Badge status={item.type} text={item.content} />
            ) : (
              <Tag
                icon={
                  item.type === 'success' ? (
                    <CheckCircleOutlined />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
                color={item.type}
              >
                {`#${item.key} ${item.content}`}
              </Tag>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  const disabledDate = (date) => {
    const day = dayjs(date).day();
    if (day !== 0 && day !== 6) {
      return false;
    }
    return true;
  };

  const onPanelChange = (newValue) => {
    const startDate = newValue.startOf('month').utc().format();
    const endDate = newValue.endOf('month').utc().format();
    setValue(newValue);
    setFilterAttendance({
      where: {
        attendanceDate: { $between: [startDate, endDate] },
        status: ['Pending', 'Approved'],
      },
    });
    setFilterLeave({
      where: {
        status: ['Pending', 'Approved'],
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
  };

  return (
    <Card
      title="Attendances / Leaves Calendar"
      extra={
        <Button
          onClick={() => setShowCalendar(!showCalendar)}
          style={{ height: '100%' }}
        >
          {showCalendar ? <UpOutlined /> : <DownOutlined />}
        </Button>
      }
    >
      {showCalendar ? (
        <Calendar
          value={value}
          cellRender={cellRender}
          disabledDate={disabledDate}
          onPanelChange={onPanelChange}
        />
      ) : null}
    </Card>
  );
}

export default AttendancesLeavesCalendar;
