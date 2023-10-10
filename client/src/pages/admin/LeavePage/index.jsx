import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table, Tag } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditLeaveId, setFilterData } from 'reducers/leave';
import Swal from 'sweetalert2';
import leaveApi from 'api/leaveApi';
import LeaveTableHeader from './components/LeaveTableHeader';
import ModalAddLeave from './components/ComponentAddEdit/ModalAddLeave';
import ModalEditLeave from './components/ComponentAddEdit/ModalEditLeave';
import { gold } from '@ant-design/colors';

const createColumns = (toggleModalEditLeave, handleDeleteLeave) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => a.id - b.id,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Name',
    key: 'name',
    render: (_, record) =>
      `${record.employeeData.firstName} ${record.employeeData.lastName}`,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    sorter: (a, b) => a.title.localeCompare(b.title),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: (status) => (
      <>
        {status === 'Pending' ? (
          <Tag color="default">{status}</Tag>
        ) : status === 'Approve' ? (
          <Tag color="success">{status}</Tag>
        ) : (
          <Tag color="error">{status}</Tag>
        )}
      </>
    ),
  },
  {
    title: 'Leave From',
    dataIndex: 'leaveFrom',
    key: 'leaveFrom',
    sorter: (a, b) => new Date(a.leaveFrom) - new Date(b.leaveFrom),
    render: (date) => getFullDate(date),
  },
  {
    title: 'Leave To',
    dataIndex: 'leaveTo',
    key: 'leaveTo',
    sorter: (a, b) => new Date(a.leaveTo) - new Date(b.leaveTo),
    render: (date) => getFullDate(date),
  },
  {
    title: 'Date created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    render: (date) => getFullDate(date),
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
            onClick={() => toggleModalEditLeave(record.id)}
          />
        ) : (
          <Button
            type="primary"
            icon={<EditFilled />}
            onClick={() => toggleModalEditLeave(record.id)}
          />
        )}

        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteLeave(record.id)}
        />
      </Space>
    ),
  },
];

function LeavePage() {
  const dispatch = useDispatch();
  const { filterData, leaveList, total, currentPage, defaultFilter } =
    useSelector((state) => state.leave);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddLeave, setOpenModalAddLeave] = useState(false);
  const [openModalEditLeave, setOpenModalEditLeave] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await leaveApi.adminGetList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            leaveList: data,
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

  const refreshLeaveList = async () => {
    const response = (await leaveApi.adminGetList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        leaveList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const toggleModalEditLeave = (id) => {
    dispatch(setEditLeaveId(id));
    setOpenModalEditLeave(!openModalEditLeave);
  };

  const toggleModalAddLeave = () => {
    setOpenModalAddLeave(!openModalAddLeave);
  };

  const handleDeleteLeave = async (leaveId) => {
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
          await leaveApi.delete(leaveId);
          Swal.fire('Deleted!', 'Currency has been deleted.', 'success');
          await refreshLeaveList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(toggleModalEditLeave, handleDeleteLeave);

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>Leave List</Divider>
      <Table
        columns={columns}
        dataSource={leaveList}
        bordered
        title={() => (
          <LeaveTableHeader
            toggleModalAddLeave={toggleModalAddLeave}
            setFilter={setFilter}
          />
        )}
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
      {openModalAddLeave && (
        <ModalAddLeave
          openModal={openModalAddLeave}
          toggleShowModal={toggleModalAddLeave}
          refreshLeaveList={refreshLeaveList}
        />
      )}
      {openModalEditLeave && (
        <ModalEditLeave
          openModal={openModalEditLeave}
          toggleShowModal={toggleModalEditLeave}
          refreshLeaveList={refreshLeaveList}
        />
      )}
    </>
  );
}
export default LeavePage;
