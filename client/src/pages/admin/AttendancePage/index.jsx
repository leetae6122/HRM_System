import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table, Tag } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  setData,
  setEditAttendanceId,
  setFilterData,
} from 'reducers/attendance';
import Swal from 'sweetalert2';
import { gold } from '@ant-design/colors';
import attendanceApi from 'api/attendanceApi';
import AttendanceTableHeader from './components/AttendanceTableHeader';
import ModalEditAttendance from './components/ComponentEditAttendance/ModalEditAttendance';

const createColumns = (toggleModalEditAttendance, handleDeleteAttendance) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => a.id - b.id,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Employee Name',
    key: 'employeeName',
    render: (_, record) =>
      `${record.employeeData.firstName} ${record.employeeData.lastName}`,
  },
  {
    title: 'Attendance Date',
    dataIndex: 'attendanceDate',
    key: 'attendanceDate',
    sorter: (a, b) => new Date(a.attendanceDate) - new Date(b.attendanceDate),
    render: (date) => getFullDate(date),
  },
  {
    title: 'Place',
    dataIndex: 'place',
    key: 'place',
    filters: [
      {
        text: 'Office',
        value: 'Office',
      },
      {
        text: 'At Home',
        value: 'At Home',
      },
    ],
    onFilter: (value, record) => !!record.place === value,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <>
        {status === 'Pending' ? (
          <Tag color="default">{status}</Tag>
        ) : status === 'Approved' ? (
          <Tag color="success">{status}</Tag>
        ) : (
          <Tag color="error">{status}</Tag>
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
    onFilter: (value, record) => !!record.status === value,
  },
  {
    title: 'Manager',
    key: 'manager',
    render: (_, record) =>
      record.employeeData.managerData.id
        ? `${record.employeeData.managerData.firstName} ${record.employeeData.managerData.lastName}`
        : '',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {record.status !== 'Pending' ? (
          <Button
            type="primary"
            style={{ background: gold[5] }}
            icon={<EyeOutlined />}
            onClick={() => toggleModalEditAttendance(record.id)}
          />
        ) : (
          <Button
            type="primary"
            icon={<EditFilled />}
            onClick={() => toggleModalEditAttendance(record.id)}
          />
        )}

        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteAttendance(record.id)}
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
  // const [openModalAddAttendance, setOpenModalAddAttendance] = useState(false);
  const [openModalEditAttendance, setOpenModalEditAttendance] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await attendanceApi.adminGetList(filterData)).data;
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

  const setFilter = (filter) => {
    dispatch(setFilterData(filter));
  };

  const refreshAttendanceList = async () => {
    const response = (await attendanceApi.adminGetList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        attendanceList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const toggleModalEditAttendance = (id) => {
    dispatch(setEditAttendanceId(id));
    setOpenModalEditAttendance(!openModalEditAttendance);
  };

  // const toggleModalAddAttendance = () => {
  //   setOpenModalAddAttendance(!openModalAddAttendance);
  // };

  const handleDeleteAttendance = async (attendanceId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await attendanceApi.delete(attendanceId);
          Swal.fire('Deleted!', 'Attendance has been deleted.', 'success');
          await refreshAttendanceList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(
    toggleModalEditAttendance,
    handleDeleteAttendance,
  );

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Attendance List
      </Divider>
      <Table
        columns={columns}
        dataSource={attendanceList}
        bordered
        title={() => <AttendanceTableHeader setFilter={setFilter} />}
        pagination={{
          total,
          current: currentPage,
          pageSize: filterData.size,
          onChange: (page, pageSize) => {
            setFilter({
              ...filterData,
              page: page,
              size: pageSize,
            });
          },
        }}
        scroll={{ y: 500 }}
        loading={loadingData}
      />
      {/* {openModalAddAttendance && (
        <ModalAddLeave
          openModal={openModalAddAttendance}
          toggleShowModal={toggleModalAddAttendance}
          refreshAttendanceList={refreshAttendanceList}
        />
      )} */}
      {openModalEditAttendance && (
        <ModalEditAttendance
          openModal={openModalEditAttendance}
          toggleShowModal={toggleModalEditAttendance}
          refreshAttendanceList={refreshAttendanceList}
        />
      )}
    </>
  );
}
export default AttendancePage;
