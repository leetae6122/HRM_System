import { Badge, Button, Calendar, Card, Col, Divider, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import leaveApi from 'api/leaveApi';
import attendanceApi from 'api/attendanceApi';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
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
      if (
        attendance.adminStatus === 'Pending' &&
        attendance.managerStatus === 'Pending'
      ) {
        listData.push({
          key: attendance.id,
          title: 'attendance',
          type: 'default',
          content: attendance.shiftData.name,
        });
        return;
      }
      if (
        attendance.adminStatus !== 'Pending' ||
        attendance.managerStatus !== 'Pending'
      ) {
        listData.push({
          key: attendance.id,
          title: 'attendance',
          type: 'warning',
          content: attendance.shiftData.name,
        });
        return;
      }

      if (
        attendance.adminStatus === 'Reject' ||
        attendance.managerStatus === 'Reject'
      ) {
        listData.push({
          key: attendance.id,
          title: 'attendance',
          type: 'error',
          content: attendance.shiftData.name,
        });
        return;
      }
      if (attendance.adminStatus === 'Approved') {
        listData.push({
          key: attendance.id,
          title: 'attendance',
          type: 'success',
          content: attendance.shiftData.name,
        });
        return;
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
        return;
      }
      if (leave.status === 'Reject') {
        listData.push({
          key: leave.id,
          title: 'leave',
          type: 'error',
          content: leave.title,
        });
        return;
      }
      if (leave.status === 'Approved') {
        listData.push({
          key: leave.id,
          title: 'leave',
          type: 'success',
          content: leave.title,
        });
        return;
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
    },
  });
  const [leaveList, setLeaveList] = useState([]);
  const [filterLeave, setFilterLeave] = useState({
    where: {
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
    const dayOfWeek = date.day();
    const listData = getListData(value, date, attendanceList, leaveList);
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      return (
        <div
          style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '5px' }}
        >
          <ul className="events">
            {listData.map((item) => (
              <li key={item.key}>
                {item.title === 'attendance' ? (
                  <Badge
                    status={item.type}
                    text={`#${item.key} ${item.content}`}
                  />
                ) : (
                  <Tag
                    icon={
                      item.type === 'success' ? (
                        <CheckCircleOutlined />
                      ) : item.type === 'warning' ? (
                        <ClockCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
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
        </div>
      );
    } else {
      return (
        <ul className="events">
          {listData.map((item) => (
            <li key={item.key}>
              {item.title === 'attendance' ? (
                <Badge
                  status={item.type}
                  text={`#${item.key} ${item.content}`}
                />
              ) : (
                <Tag
                  icon={
                    item.type === 'success' ? (
                      <CheckCircleOutlined />
                    ) : item.type === 'warning' ? (
                      <ClockCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
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
    }
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
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
        <>
          <Row>
            <Col span={12}>
              <span style={{ fontWeight: 'bold' }}>Attendances : </span>
              <Badge status="default" text="Pending" />
              <Divider type="vertical" style={{ backgroundColor: '#434343' }} />
              <Badge status="success" text="Approved" />
              <Divider type="vertical" style={{ backgroundColor: '#434343' }} />
              <Badge status="error" text="Reject" />
            </Col>
            <Col span={12}>
              <span style={{ fontWeight: 'bold' }}>Leaves : </span>
              <Tag color="warning" icon={<ClockCircleOutlined />}>
                Pending
              </Tag>
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Approved
              </Tag>
              <Tag color="error" icon={<CloseCircleOutlined />}>
                Reject
              </Tag>
            </Col>
          </Row>
          <Calendar
            value={value}
            cellRender={cellRender}
            onPanelChange={onPanelChange}
          />
        </>
      ) : null}
    </Card>
  );
}

export default AttendancesLeavesCalendar;
