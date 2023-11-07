import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table, Tag } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  setData,
  setEditAttendanceId,
  setFilterData,
} from 'reducers/attendance';
import { gold, green, red } from '@ant-design/colors';
import attendanceApi from 'api/attendanceApi';
import AttendanceTableHeader from './components/AttendanceTableHeader';
import ModalDetailAttendance from './components/ModalDetailAttendance';
import _ from 'lodash';
import { setDefaultFilterData } from 'reducers/attendance';

const createColumns = (toggleModalDetailAttendance) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Attendance Date',
    dataIndex: 'attendanceDate',
    key: 'attendanceDate',
    sorter: true,
    render: (date) => getFullDate(date),
  },
  {
    title: 'Shifts',
    dataIndex: ['shiftData', 'name'],
    key: 'shiftData',
    render: (_, record) =>
      `${record.shiftData.name} (${record.shiftData.startTime} - ${record.shiftData.endTime})`,
    sorter: true,
  },
  {
    title: 'Total Hours Worked',
    dataIndex: 'totalHours',
    key: 'totalHours',
    sorter: true,
    render: (totalHours, record) =>
      totalHours
        ? `${totalHours} ${
            record.shiftData.overtimeShift ? 'overtime hours' : 'hours'
          }`
        : '',
  },
  {
    title: 'Status (Login)',
    dataIndex: 'inStatus',
    key: 'inStatus',
    render: (inStatus) => (
      <>
        {inStatus === 'On Time' ? (
          <Tag color={green[5]}>{inStatus}</Tag>
        ) : inStatus === 'Late In' ? (
          <Tag color={red[5]}>{inStatus}</Tag>
        ) : null}
      </>
    ),
    filters: [
      {
        text: 'On Time',
        value: 'On Time',
      },
      {
        text: 'Late In',
        value: 'Late In',
      },
    ],
    filterMultiple: false,
  },
  {
    title: 'Status (Logout)',
    dataIndex: 'outStatus',
    key: 'outStatus',
    render: (outStatus) => (
      <>
        {outStatus === 'On Time' ? (
          <Tag color={green[5]}>{outStatus}</Tag>
        ) : outStatus === 'Out Early' ? (
          <Tag color={red[5]}>{outStatus}</Tag>
        ) : null}
      </>
    ),
    filters: [
      {
        text: 'On Time',
        value: 'On Time',
      },
      {
        text: 'Out Early',
        value: 'Out Early',
      },
    ],
    filterMultiple: false,
  },
  {
    title: 'Processing Status (Manager)',
    dataIndex: 'managerStatus',
    key: 'managerStatus',
    render: (managerStatus) => (
      <>
        {managerStatus === 'Pending' ? (
          <Tag color="default">{managerStatus}</Tag>
        ) : managerStatus === 'Approved' ? (
          <Tag color="success">{managerStatus}</Tag>
        ) : (
          <Tag color="error">{managerStatus}</Tag>
        )}
      </>
    ),
    filters: [
      {
        text: 'Pending',
        value: 'Pending',
      },
      {
        text: 'Approved',
        value: 'Approved',
      },
      {
        text: 'Reject',
        value: 'Reject',
      },
    ],
  },
  {
    title: 'Processing Status (Admin)',
    dataIndex: 'adminStatus',
    key: 'adminStatus',
    render: (adminStatus) => (
      <>
        {adminStatus === 'Pending' ? (
          <Tag color="default">{adminStatus}</Tag>
        ) : adminStatus === 'Approved' ? (
          <Tag color="success">{adminStatus}</Tag>
        ) : (
          <Tag color="error">{adminStatus}</Tag>
        )}
      </>
    ),
    filters: [
      {
        text: 'Pending',
        value: 'Pending',
      },
      {
        text: 'Approved',
        value: 'Approved',
      },
      {
        text: 'Reject',
        value: 'Reject',
      },
    ],
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          style={{ background: gold[5] }}
          icon={<EyeOutlined />}
          onClick={() => toggleModalDetailAttendance(record.id)}
        />
      </Space>
    ),
  },
];

function AttendancePage() {
  const dispatch = useDispatch();
  const { filterData, attendanceList, total, currentPage, defaultFilter } =
    useSelector((state) => state.attendance);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalDetailAttendance, setOpenModalDetailAttendance] =
    useState(false);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    dispatch(setDefaultFilterData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await attendanceApi.employeeGetList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            attendanceList: data,
            total: response.total,
            currentPage: response.currentPage,
          }),
        );
        setLoadingData(false);
      } catch (error) {
        toast.error(error);
        setLoadingData(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [dispatch, filterData]);

  useEffect(() => {
    if (_.isEqual(defaultFilter, filterData)) {
      setTableKey(tableKey + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const setFilter = (filter) => {
    dispatch(setFilterData(filter));
  };

  const toggleModalDetailAttendance = (id) => {
    dispatch(setEditAttendanceId(id));
    setOpenModalDetailAttendance(!openModalDetailAttendance);
  };

  const columns = createColumns(toggleModalDetailAttendance);

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let where = filterData.where;
    let order = defaultFilter.order;

    where = _.omitBy(
      {
        ...where,
        place: filters.place,
        status: filters.status,
      },
      _.isNil,
    );

    if (!_.isEmpty(sorter.column)) {
      order = [[sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC']];
    }
    setFilter({ ...filterData, page, size, where, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        List of Attendance
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={attendanceList}
        bordered
        title={() => <AttendanceTableHeader setFilter={setFilter} />}
        pagination={{
          total,
          current: currentPage,
          pageSize: filterData.size,
        }}
        onChange={onChangeTable}
        scroll={{ y: 500 }}
        loading={loadingData}
      />
      {openModalDetailAttendance && (
        <ModalDetailAttendance
          openModal={openModalDetailAttendance}
          toggleShowModal={toggleModalDetailAttendance}
        />
      )}
    </>
  );
}
export default AttendancePage;
