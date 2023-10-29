import { useEffect, useState } from 'react';
import { Button, Divider, Table, Tag } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditPayrollId, setFilterData } from 'reducers/payroll';
import payrollApi from 'api/payrollApi';
import { gold } from '@ant-design/colors';
import _ from 'lodash';
import { numberWithDot } from 'utils/format';
import { getMonthName } from 'utils/handleDate';
import PayrollTableHeader from './components/PayrollTableHeader';
import ModalDetailPayroll from './components/ModalDetailPayroll';

const createColumns = (toggleModalDetailPayroll) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Handler Name',
    dataIndex: ['handlerData', 'firstName'],
    key: 'handlerData', 
    sorter: true,
    render: (_, record) =>
      `${record.handlerData.firstName} ${record.handlerData.lastName}`,
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
      <Button
        type="primary"
        style={{ background: gold[5] }}
        icon={<EyeOutlined />}
        onClick={() => toggleModalDetailPayroll(record.id)}
      />
    ),
  },
];

function PayrollPage() {
  const dispatch = useDispatch();
  const { filterData, payrollList, total, currentPage, defaultFilter } =
    useSelector((state) => state.payroll);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalDetailPayroll, setOpenModalDetailPayroll] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await payrollApi.employeeGetList(filterData)).data;
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

  const toggleModalDetailPayroll = (id) => {
    dispatch(setEditPayrollId(id));
    setOpenModalDetailPayroll(!openModalDetailPayroll);
  };

  const columns = createColumns(toggleModalDetailPayroll);

  const onChangeTable = (pagination, filters, sorter) => {
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
    setFilter({ ...filterData, where, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>Payroll List</Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={payrollList}
        bordered
        title={() => <PayrollTableHeader setFilter={setFilter} />}
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
        onChange={onChangeTable}
        scroll={{ y: 500 }}
        loading={loadingData}
      />
      {openModalDetailPayroll && (
        <ModalDetailPayroll
          openModal={openModalDetailPayroll}
          toggleShowModal={toggleModalDetailPayroll}
        />
      )}
    </>
  );
}
export default PayrollPage;
