import { useEffect, useState } from 'react';
import { Badge, Button, Divider, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditShiftId, setFilterData } from 'reducers/shift';
import Swal from 'sweetalert2';
import _ from 'lodash';
import shiftApi from 'api/shiftApi';
import ShiftTableHeader from './components/ShiftTableHeader';
import ModalAddShift from './components/ComponentAddEdit/ModalAddShift';
import ModalEditShift from './components/ComponentAddEdit/ModalEditShift';

const createColumns = (toggleModalEditShift, handleDeleteShift) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
    sorter: true,
  },
  {
    title: 'End Time',
    dataIndex: 'endTime',
    key: 'endTime',
    sorter: true,
  },
  {
    title: 'Shift Type',
    dataIndex: 'overtimeShift',
    key: 'overtimeShift',
    render: (overtimeShift) => (
      <>
        {!overtimeShift ? (
          <Badge status="success" text="Main Shift" />
        ) : (
          <Badge status="warning" text="Overtime Shift" />
        )}
      </>
    ),
    filters: [
      {
        text: 'Main Shift',
        value: false,
      },
      {
        text: 'Overtime Shift',
        value: true,
      },
    ],
    filterMultiple: false,
  },
  {
    title: 'Date created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
    render: (date) => getFullDate(date),
  },
  {
    title: 'Date update',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    sorter: true,
    render: (date) => getFullDate(date),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          icon={<EditFilled />}
          onClick={() => toggleModalEditShift(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteShift(record.id)}
        />
      </Space>
    ),
  },
];

function ShiftPage() {
  const dispatch = useDispatch();
  const { filterData, shiftList, total, currentPage, defaultFilter } =
    useSelector((state) => state.shift);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddShift, setOpenModalAddShift] = useState(false);
  const [openModalEditShift, setOpenModalEditShift] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await shiftApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            shiftList: data,
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

  const refreshShiftList = async () => {
    const response = (await shiftApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        shiftList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const toggleModalEditShift = (id) => {
    dispatch(setEditShiftId(id));
    setOpenModalEditShift(!openModalEditShift);
  };

  const toggleModalAddShift = () => {
    setOpenModalAddShift(!openModalAddShift);
  };

  const handleDeleteShift = async (shiftId) => {
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
          await shiftApi.delete(shiftId);
          Swal.fire('Deleted!', 'Shift has been deleted.', 'success');
          await refreshShiftList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(toggleModalEditShift, handleDeleteShift);

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let where = filterData.where;
    let order = defaultFilter.order;

    where = _.omitBy(
      {
        ...where,
        overtimeShift: filters.overtimeShift,
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
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>Shift List</Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={shiftList}
        bordered
        title={() => (
          <ShiftTableHeader
            toggleModalAddShift={toggleModalAddShift}
            setFilter={setFilter}
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
      {openModalAddShift && (
        <ModalAddShift
          openModal={openModalAddShift}
          toggleShowModal={toggleModalAddShift}
          refreshShiftList={refreshShiftList}
        />
      )}
      {openModalEditShift && (
        <ModalEditShift
          openModal={openModalEditShift}
          toggleShowModal={toggleModalEditShift}
          refreshShiftList={refreshShiftList}
        />
      )}
    </>
  );
}
export default ShiftPage;
