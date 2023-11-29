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
import _ from 'lodash';
import { setDefaultFilterData } from 'reducers/leave';
import FilterDrawer from './components/Filter/FilterDrawer';

const createColumns = (toggleModalEditLeave, handleDeleteLeave) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Employee Id',
    dataIndex: 'employeeId',
    key: 'employeeId',
    sorter: true,
  },
  {
    title: 'Employee',
    dataIndex: ['employeeData', 'firstName'],
    key: 'employeeData',
    sorter: true,
    render: (_, record) =>
      `${record.employeeData.lastName} ${record.employeeData.firstName}`,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
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
  },
  {
    title: 'Leave From',
    dataIndex: 'leaveFrom',
    key: 'leaveFrom',
    sorter: true,
    render: (date) => getFullDate(date),
  },
  {
    title: 'Leave To',
    dataIndex: 'leaveTo',
    key: 'leaveTo',
    sorter: true,
    render: (date) => getFullDate(date),
  },
  {
    title: 'Date Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
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
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
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

  useEffect(() => {
    if (_.isEqual(defaultFilter, filterData)) {
      setTableKey(tableKey + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

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
    dispatch(setFilterData(defaultFilter));
  };

  const toggleShowFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer);
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
          Swal.fire(
            'Deleted!',
            'Request to leave has been deleted.',
            'success',
          );
          await refreshLeaveList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(toggleModalEditLeave, handleDeleteLeave);

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let where = filterData.where;
    let order = defaultFilter.order;

    where = _.omitBy(
      {
        ...where,
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
        List of Leaves
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={leaveList}
        bordered
        title={() => (
          <LeaveTableHeader
            toggleModalAddLeave={toggleModalAddLeave}
            setFilter={setFilter}
            toggleShowFilterDrawer={toggleShowFilterDrawer}
          />
        )}
        pagination={{
          total,
          current: currentPage,
          pageSize: filterData.size,
        }}
        onChange={onChangeTable}
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
      {openFilterDrawer && (
        <FilterDrawer
          toggleShowDrawer={toggleShowFilterDrawer}
          openDrawer={openFilterDrawer}
          setFilter={setFilter}
        />
      )}
    </>
  );
}
export default LeavePage;
