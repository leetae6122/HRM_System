import { useEffect, useState } from 'react';
import { Divider, Table } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { useDispatch, useSelector } from 'react-redux';
import {
  setData,
  setFilterData,
  setDefaultFilterData,
} from 'reducers/allowance';
import allowanceApi from 'api/allowanceApi';
import _ from 'lodash';
import { numberWithDot } from 'utils/format';
import AllowanceTableHeader from './components/AllowanceTableHeader';
import { getMonthName } from 'utils/handleDate';

const createColumns = () => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    render: (id) => `#${id}`,
    width: 80,
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
    dataIndex: ['adderData', 'firstName'],
    key: 'adderData',
    sorter: true,
    render: (_, record) =>
      `#${record.adderData.id} - ${record.adderData.lastName} ${record.adderData.firstName}`,
  },
  {
    title: 'Date Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
    render: (date) => getFullDate(date),
  },
  {
    title: 'Date Updated',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    sorter: true,
    render: (date) => getFullDate(date),
  },
];

function AllowancePage() {
  const dispatch = useDispatch();
  const { filterData, allowanceList, total, currentPage, defaultFilter } =
    useSelector((state) => state.allowance);
  const [loadingData, setLoadingData] = useState(false);
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
        const response = (await allowanceApi.employeeGetList(filterData)).data;
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

  const columns = createColumns();

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
        title={() => <AllowanceTableHeader setFilter={setFilter} />}
        pagination={{
          total,
          current: currentPage,
          pageSize: filterData.size,
        }}
        onChange={onChangeTable}
        scroll={{ y: 500 }}
        loading={loadingData}
      />
    </>
  );
}
export default AllowancePage;
