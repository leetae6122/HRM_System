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
import { gold, green, red } from '@ant-design/colors';
import attendanceApi from 'api/attendanceApi';
import AttendanceTableHeader from './components/AttendanceTableHeader';
import ModalEditAttendance from './components/ComponentEditAttendance/ModalEditAttendance';
import _ from 'lodash';
import { setDefaultFilterData } from 'reducers/attendance';

const createColumns = (toggleModalEditAttendance, handleDeleteAttendance) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Employee Name',
    dataIndex: ['employeeData', 'firstName'],
    key: 'employeeData',
    sorter: true,
    render: (_, record) =>
      `${record.employeeData.firstName} ${record.employeeData.lastName}`,
  },
  {
    title: 'Shifts',
    dataIndex: ['shiftData', 'name'],
    key: 'shiftData',
    sorter: true,
  },
  {
    title: 'Attendance Date',
    dataIndex: 'attendanceDate',
    key: 'attendanceDate',
    sorter: true,
    render: (date) => getFullDate(date),
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
        {record.adminStatus !== 'Pending' ? (
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
  const [openModalEditAttendance, setOpenModalEditAttendance] = useState(false);
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

  useEffect(() => {
    if (_.isEqual(defaultFilter, filterData)) {
      setTableKey(tableKey + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

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
      if (_.isArray(sorter.field))
        order = [
          [...sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC'],
        ];
      else
        order = [[sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC']];
    }
    setFilter({ ...filterData, page, size, where, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        List of Attendees
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
