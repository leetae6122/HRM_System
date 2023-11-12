import { Col, Divider, Row, Table } from 'antd';
import Clock from '../../../components/Common/Clock';
import HandleTimekeeper from './components/HandleTimekeeper';
import { useEffect, useState } from 'react';
import attendanceApi from 'api/attendanceApi';
import dayjs from 'dayjs';
import { setData } from 'reducers/attendance';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { green, red } from '@ant-design/colors';
import { getFullDate } from 'utils/handleDate';

const columns = [
  {
    title: 'Date',
    dataIndex: 'attendanceDate',
    key: 'attendanceDate',
    render: (attendanceDate) => getFullDate(attendanceDate),
  },
  {
    title: 'Shifts',
    dataIndex: ['shiftData', 'name'],
    key: 'shiftData',
    render: (_, record) =>
      `${record.shiftData.name} (${record.shiftData.startTime} - ${record.shiftData.endTime})`,
  },
  {
    title: 'Log Time',
    dataIndex: 'inTime',
    key: 'inTime',
  },
  {
    title: 'Logout Time',
    dataIndex: 'outTime',
    key: 'outTime',
  },
  {
    title: 'Status (In / Out)',
    key: 'status',
    render: (_, record) => (
      <>
        <span>
          <span
            style={{ color: record.inStatus === 'On Time' ? green[5] : red[5] }}
          >
            {record.inStatus}
          </span>
          {' / '}
          <span
            style={{
              color: record.outStatus === 'On Time' ? green[5] : red[5],
            }}
          >
            {record.outStatus}
          </span>
        </span>
      </>
    ),
  },
];

function TimekeeperPage() {
  const dispatch = useDispatch();
  const { attendanceList } = useSelector((state) => state.attendance);
  const [loadingData, setLoadingData] = useState(false);

  const getAttendance = async (dispatch) => {
    const response = (
      await attendanceApi.employeeGetList({
        page: 1,
        size: 10,
        where: {
          attendanceDate: dayjs().toDate(),
        },
      })
    ).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        attendanceList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        await getAttendance(dispatch);
        setLoadingData(false);
      } catch (error) {
        toast.error(error);
        setLoadingData(false);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [dispatch]);
  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>Timekeeper</Divider>
      <Row gutter={[8, 12]}>
        <Col span={24}>
          <Clock h24={true} />
        </Col>
        <Col span={24}>
          <HandleTimekeeper refreshAttendance={getAttendance} />
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={attendanceList}
            pagination={false}
            loading={loadingData}
          />
        </Col>
      </Row>
    </>
  );
}

export default TimekeeperPage;
