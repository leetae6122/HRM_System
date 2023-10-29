import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table, Tag } from 'antd';
import payrollApi from 'api/payrollApi';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditPayrollId, setFilterData } from 'reducers/payroll';

import Swal from 'sweetalert2';
import _ from 'lodash';
import { getMonthName } from 'utils/handleDate';
import { numberWithDot } from 'utils/format';
import { gold } from '@ant-design/colors';
import PayrollTableHeader from './components/PayrollTableHeader';
import ModalAddPayroll from './components/ComponentAddEdit/ModalAddPayroll';
import ModalEditPayroll from './components/ComponentAddEdit/ModalEditPayroll';

const createColumns = (
  toggleModalEditPayroll,
  handleDeletePayroll,
) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Employee',
    dataIndex: ['employeeData', 'firstName'],
    key: 'employeeData',
    sorter: true,
    render: (_, record) =>
      `${record.employeeData.firstName} ${record.employeeData.lastName}`,
  },
  {
    title: 'Month',
    dataIndex: 'month',
    key: 'month',
    render: (month) => getMonthName(month),
    sorter: true,
  },
  {
    title: 'Hours Worked',
    dataIndex: 'hoursWorked',
    key: 'hoursWorked',
    sorter: true,
    render: (value) => `${value} hrs`,
  },
  {
    title: 'Hours Overtime',
    dataIndex: 'hoursOvertime',
    key: 'hoursOvertime',
    sorter: true,
    render: (value) => `${value} hrs`,
  },
  {
    title: 'Deduction',
    dataIndex: 'deduction',
    key: 'deduction',
    sorter: true,
    render: (value, record) =>
      `${numberWithDot(value)} ${record.currencyData.symbol}`,
  },
  {
    title: 'Total Paid',
    dataIndex: 'totalPaid',
    key: 'totalPaid',
    sorter: true,
    render: (value, record) =>
      `${numberWithDot(value)} ${record.currencyData.symbol}`,
  },
  {
    title: 'Pay Date',
    dataIndex: 'payDate',
    key: 'payDate',
    sorter: true,
    render: (date) => (date ? getFullDate(date) : ''),
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (status) => (
      <>
        {status === 'Pending' ? (
          <Tag color="default">{status}</Tag>
        ) : status === 'Paid' ? (
          <Tag color="success">{status}</Tag>
        ) : null}
      </>
    ),
    filters: [
      {
        text: 'Paid',
        value: 'Paid',
      },
      {
        text: 'Pending',
        value: 'Pending',
      },
    ],
    filterMultiple: false,
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {record.status === 'Pending' ? (
          <>
            <Button
              type="primary"
              icon={<EditFilled />}
              onClick={() => toggleModalEditPayroll(record.id)}
            />
            <Button
              type="primary"
              danger
              icon={<DeleteFilled />}
              onClick={() => handleDeletePayroll(record.id)}
            />
          </>
        ) : (
          <Button
            type="primary"
            style={{ background: gold[5] }}
            icon={<EyeOutlined />}
            onClick={() => toggleModalEditPayroll(record.id)}
          />
        )}
      </Space>
    ),
  },
];

function PayrollPage() {
  const dispatch = useDispatch();
  const { filterData, payrollList, total, currentPage, defaultFilter } =
    useSelector((state) => state.payroll);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddPayroll, setOpenModalAddPayroll] = useState(false);
  const [openModalEditPayroll, setOpenModalEditPayroll] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await payrollApi.adminGetList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            payrollList: data,
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

  const refreshPayrollList = async () => {
    const response = (await payrollApi.adminGetList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        payrollList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const toggleModalEditPayroll = (id) => {
    dispatch(setEditPayrollId(id));
    setOpenModalEditPayroll(!openModalEditPayroll);
  };

  const toggleModalAddPayroll = () => {
    setOpenModalAddPayroll(!openModalAddPayroll);
  };

  const handleDeletePayroll = async (payrollId) => {
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
          await payrollApi.delete(payrollId);
          Swal.fire('Deleted!', 'Payroll has been deleted.', 'success');
          await refreshPayrollList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(toggleModalEditPayroll, handleDeletePayroll);

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let order = defaultFilter.order;
    let where = filterData.where;

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
        Payroll List
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={payrollList}
        bordered
        title={() => (
          <PayrollTableHeader
            toggleModalAddPayroll={toggleModalAddPayroll}
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
      {openModalAddPayroll && (
        <ModalAddPayroll
          openModal={openModalAddPayroll}
          toggleShowModal={toggleModalAddPayroll}
          refreshPayrollList={refreshPayrollList}
        />
      )}
      {openModalEditPayroll && (
        <ModalEditPayroll
          openModal={openModalEditPayroll}
          toggleShowModal={toggleModalEditPayroll}
          refreshPayrollList={refreshPayrollList}
        />
      )}
    </>
  );
}
export default PayrollPage;
