import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import allowanceApi from 'api/allowanceApi';
import { toast } from 'react-toastify';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditAllowanceId, setFilterData } from 'reducers/allowance';

import Swal from 'sweetalert2';
import _ from 'lodash';
import { numberWithDot } from 'utils/format';
import AllowanceTableHeader from './components/AllowanceTableHeader';
import ModalAddAllowance from './components/ComponentAddEdit/ModalAddAllowance';
import ModalEditAllowance from './components/ComponentAddEdit/ModalEditAllowance';
import { getMonthName } from 'utils/handleDate';
import FilterDrawer from './components/Filter/FilterDrawer';
import { setDefaultFilterData } from 'reducers/allowance';

const createColumns = (toggleModalEditAllowance, handleDeleteAllowance) => [
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
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    sorter: true,
    render: (value) => `${numberWithDot(value)} VNĐ`,
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    sorter: true,
    render: (date) => getMonthName(date),
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    sorter: true,
    render: (date) => getMonthName(date),
  },
  {
    title: 'Added By',
    dataIndex: ['adderData', 'id'],
    key: 'adderData',
    sorter: true,
    render: (_, record) =>
      `#${record.adderData.id} - ${record.adderData.lastName} ${record.adderData.firstName}`,
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          icon={<EditFilled />}
          onClick={() => toggleModalEditAllowance(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteAllowance(record.id)}
        />
      </Space>
    ),
  },
];

function AllowancePage() {
  const dispatch = useDispatch();
  const { filterData, allowanceList, total, currentPage, defaultFilter } =
    useSelector((state) => state.allowance);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddAllowance, setOpenModalAddAllowance] = useState(false);
  const [openModalEditAllowance, setOpenModalEditAllowance] = useState(false);
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
        const response = (await allowanceApi.adminGetList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            allowanceList: data,
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

  const refreshAllowanceList = async () => {
    const response = (await allowanceApi.adminGetList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        allowanceList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
    dispatch(setFilterData(defaultFilter));
  };

  const toggleShowFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer);
  };

  const toggleModalEditAllowance = (id) => {
    dispatch(setEditAllowanceId(id));
    setOpenModalEditAllowance(!openModalEditAllowance);
  };

  const toggleModalAddAllowance = () => {
    setOpenModalAddAllowance(!openModalAddAllowance);
  };

  const handleDeleteAllowance = async (allowanceId) => {
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
          await allowanceApi.delete(allowanceId);
          Swal.fire('Deleted!', 'Allowance has been deleted.', 'success');
          await refreshAllowanceList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(
    toggleModalEditAllowance,
    handleDeleteAllowance,
  );

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let order = defaultFilter.order;

    if (!_.isEmpty(sorter.column)) {
      if (_.isArray(sorter.field))
        order = [
          [...sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC'],
        ];
      else
        order = [[sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC']];
    }
    setFilter({ ...filterData, page, size, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        List of Allowances
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={allowanceList}
        bordered
        title={() => (
          <AllowanceTableHeader
            toggleModalAddAllowance={toggleModalAddAllowance}
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
      {openModalAddAllowance && (
        <ModalAddAllowance
          openModal={openModalAddAllowance}
          toggleShowModal={toggleModalAddAllowance}
          refreshAllowanceList={refreshAllowanceList}
        />
      )}
      {openModalEditAllowance && (
        <ModalEditAllowance
          openModal={openModalEditAllowance}
          toggleShowModal={toggleModalEditAllowance}
          refreshAllowanceList={refreshAllowanceList}
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
export default AllowancePage;
