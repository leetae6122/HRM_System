import {
  Badge,
  Button,
  Calendar,
  Card,
  Col,
  Divider,
  Popover,
  Row,
  Tag,
} from 'antd';
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
      listData.push({
        key: attendance.id,
        title: 'attendance',
        type:
          attendance.adminStatus === 'Reject' ||
          attendance.managerStatus === 'Reject'
            ? 'error'
            : attendance.adminStatus === 'Pending' ||
              attendance.managerStatus === 'Pending'
            ? 'warning'
            : 'success',
        content: attendance.shiftData.name,
        detail: `${attendance.shiftData.name}: In ${attendance.inTime} - Out ${attendance.outTime}`,
      });
    }
  });

  leaves.forEach((leave) => {
    if (value.isBetween(leave.leaveFrom, leave.leaveTo, 'day', '[]')) {
      listData.push({
        key: leave.id,
        title: 'leave',
        type:
          leave.status === 'Reject'
            ? 'error'
            : leave.status === 'Pending'
            ? 'warning'
            : 'success',
        content: leave.title,
        detail: `${leave.title} - ( ${dayjs(leave.leaveFrom).format(
          'DD/MM/YYYY',
        )} - ${dayjs(leave.leaveTo).format('DD/MM/YYYY')} )`,
      });
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
    const contentDetail = listData.map((item) => (
      <li key={item.key}>
        {item.title === 'attendance' ? (
          <Badge status={item.type} text={`#${item.key} ${item.detail}`} />
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
            {`#${item.key} ${item.detail}`}
          </Tag>
        )}
      </li>
    ));

    const contentDate = listData.map((item) => (
      <li key={item.key}>
        {item.title === 'attendance' ? (
          <Badge status={item.type} text={`#${item.key} ${item.content}`} />
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
    ));

    return (
      <Popover
        content={contentDetail}
        title={dayjs(date).format('DD/MM/YYYY')}
        trigger="hover"
        placement="top"
      >
        {dayOfWeek === 6 || dayOfWeek === 0 ? (
          <ul
            style={{
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              padding: '5px',
            }}
            className="events"
          >
            {contentDate}
          </ul>
        ) : (
          <ul className="events">{contentDate}</ul>
        )}
      </Popover>
    );
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
      },
    });
    setFilterLeave({
      where: {
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
              <Badge status="warning" text="Pending" />
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
