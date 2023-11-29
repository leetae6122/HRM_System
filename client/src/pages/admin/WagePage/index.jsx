import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditWageId, setFilterData } from 'reducers/wage';
import { numberWithDot } from 'utils/format';
import Swal from 'sweetalert2';
import WageTableHeader from './components/WageTableHeader';
import wageApi from 'api/wageApi';
import ModalAddWage from './components/ComponentAddEdit/ModalAddWage';
import ModalEditWage from './components/ComponentAddEdit/ModalEditWage';
import _ from 'lodash';
import FilterDrawer from './components/Filter/FilterDrawer';
import { setDefaultFilterData } from 'reducers/wage';

const createColumns = (toggleModalEditWage, handleDeleteWage) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Basic Hourly Wage',
    dataIndex: 'basicHourlyWage',
    key: 'basicHourlyWage',
    sorter: true,
    render: (value) => `${numberWithDot(value)} VNĐ/hr`,
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
    title: 'From Date',
    dataIndex: 'fromDate',
    key: 'fromDate',
    sorter: true,
    render: (date) => getFullDate(date),
  },
  {
    title: 'To Date',
    dataIndex: 'toDate',
    key: 'toDate',
    sorter: true,
    render: (date) => (date ? getFullDate(date) : ''),
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
          onClick={() => toggleModalEditWage(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteWage(record.id)}
        />
      </Space>
    ),
  },
];

function WagePage() {
  const dispatch = useDispatch();
  const { filterData, wageList, total, currentPage, defaultFilter } =
    useSelector((state) => state.wage);
  const [loadingData, setLoadingData] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openModalAddWage, setOpenModalAddWage] = useState(false);
  const [openModalEditWage, setOpenModalEditWage] = useState(false);
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
        const response = (await wageApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            wageList: data,
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
  }, [filterData, dispatch]);

  useEffect(() => {
    if (_.isEqual(defaultFilter, filterData)) {
      setTableKey(tableKey + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const setFilter = (filter) => {
    dispatch(setFilterData(filter));
  };

  const refreshWageList = async () => {
    const response = (await wageApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        wageList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
    dispatch(setFilterData(defaultFilter));
  };

  const handleDeleteWage = async (wageId) => {
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
          await wageApi.delete(wageId);
          Swal.fire('Deleted!', 'Wage has been deleted.', 'success');
          await refreshWageList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const toggleShowFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer);
  };

  const toggleModalEditWage = (id) => {
    dispatch(setEditWageId(id));
    setOpenModalEditWage(!openModalEditWage);
  };

  const toggleModalAddWage = () => {
    setOpenModalAddWage(!openModalAddWage);
  };

  const columns = createColumns(toggleModalEditWage, handleDeleteWage);

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let where = filterData.where;
    let order = defaultFilter.order;

    where = _.omitBy(
      {
        ...where,
        isApplying: filters.isApplying,
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
        List of Wages
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={wageList}
        bordered
        title={() => (
          <WageTableHeader
            toggleModalAddWage={toggleModalAddWage}
            toggleShowFilterDrawer={toggleShowFilterDrawer}
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
      {openFilterDrawer && (
        <FilterDrawer
          toggleShowDrawer={toggleShowFilterDrawer}
          openDrawer={openFilterDrawer}
          setFilter={setFilter}
        />
      )}
      {openModalAddWage && (
        <ModalAddWage
          openModal={openModalAddWage}
          toggleShowModal={toggleModalAddWage}
          refreshWageList={refreshWageList}
        />
      )}
      {openModalEditWage && (
        <ModalEditWage
          openModal={openModalEditWage}
          toggleShowModal={toggleModalEditWage}
          refreshWageList={refreshWageList}
        />
      )}
    </>
  );
}
export default WagePage;
