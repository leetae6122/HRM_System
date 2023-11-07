import { useEffect, useState } from 'react';
import { Divider, Table, Tag } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { useDispatch, useSelector } from 'react-redux';
import {
  setData,
  setFilterData,
  setDefaultFilterData,
} from 'reducers/rewardPunishment';
import rewardPunishmentApi from 'api/rewardPunishmentApi';
import _ from 'lodash';
import { numberWithDot } from 'utils/format';
import RewardPunishmentTableHeader from './components/RewardPunishmentTableHeader';

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
    title: 'Type',
    key: 'type',
    dataIndex: 'type',
    render: (type) => (
      <>
        <Tag
          style={{ padding: 8 }}
          color={type === 'Reward' ? 'green' : 'red'}
          key={type}
        >
          {type}
        </Tag>
      </>
    ),
    filters: [
      {
        text: 'Reward',
        value: 'Reward',
      },
      {
        text: 'Punishment',
        value: 'Punishment',
      },
    ],
    filterMultiple: false,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    sorter: true,
    render: (value, record) => (
      <span style={{ color: record.type === 'Reward' ? 'green' : 'red' }}>
        {numberWithDot(value)} VNĐ
      </span>
    ),
  },
  {
    title: 'Effective Date',
    dataIndex: 'date',
    key: 'date',
    sorter: true,
    render: (date) => getFullDate(date),
  },
  {
    title: 'Added By',
    dataIndex: ['adderData', 'firstName'],
    key: 'adderData',
    sorter: true,
    render: (_, record) =>
      `${record.adderData.firstName} ${record.adderData.lastName}`,
  },
  {
    title: 'Created Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
    render: (date) => getFullDate(date),
  },
];

function RewardPunishmentPage() {
  const dispatch = useDispatch();
  const {
    filterData,
    rewardPunishmentList,
    total,
    currentPage,
    defaultFilter,
  } = useSelector((state) => state.rewardPunishment);
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
        const response = (await rewardPunishmentApi.employeeGetList(filterData))
          .data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            rewardPunishmentList: data,
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
        List of Rewards and Punishments
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={rewardPunishmentList}
        bordered
        title={() => <RewardPunishmentTableHeader setFilter={setFilter} />}
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
export default RewardPunishmentPage;
