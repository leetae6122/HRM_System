import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table, Tag } from 'antd';
import rewardPunishmentApi from 'api/rewardPunishmentApi';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  setData,
  setEditRewardPunishmentId,
  setFilterData,
} from 'reducers/rewardPunishment';

import Swal from 'sweetalert2';
import _ from 'lodash';
import { numberWithDot } from 'utils/format';
import RewardPunishmentTableHeader from './components/RewardPunishmentTableHeader';
import ModalAddRewardPunishment from './components/ComponentAddEdit/ModalAddRewardPunishment';
import ModalEditRewardPunishment from './components/ComponentAddEdit/ModalEditRewardPunishment';
import FilterDrawer from './components/Filter/FilterDrawer';
import { setDefaultFilterData } from 'reducers/rewardPunishment';

const createColumns = (
  toggleModalEditRewardPunishment,
  handleDeleteRewardPunishment,
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
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          icon={<EditFilled />}
          onClick={() => toggleModalEditRewardPunishment(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteRewardPunishment(record.id)}
        />
      </Space>
    ),
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
  const [openModalAddRewardPunishment, setOpenModalAddRewardPunishment] =
    useState(false);
  const [openModalEditRewardPunishment, setOpenModalEditRewardPunishment] =
    useState(false);
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
        const response = (await rewardPunishmentApi.adminGetList(filterData))
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

  const refreshRewardPunishmentList = async () => {
    const response = (await rewardPunishmentApi.adminGetList(defaultFilter))
      .data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        rewardPunishmentList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
    dispatch(setFilterData(defaultFilter));
  };

  const toggleShowFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer);
  };

  const toggleModalEditRewardPunishment = (id) => {
    dispatch(setEditRewardPunishmentId(id));
    setOpenModalEditRewardPunishment(!openModalEditRewardPunishment);
  };

  const toggleModalAddRewardPunishment = () => {
    setOpenModalAddRewardPunishment(!openModalAddRewardPunishment);
  };

  const handleDeleteRewardPunishment = async (rewardId) => {
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
          await rewardPunishmentApi.delete(rewardId);
          Swal.fire(
            'Deleted!',
            'Reward or Punishment has been deleted.',
            'success',
          );
          await refreshRewardPunishmentList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(
    toggleModalEditRewardPunishment,
    handleDeleteRewardPunishment,
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
        List of Rewards and Punishments
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={rewardPunishmentList}
        bordered
        title={() => (
          <RewardPunishmentTableHeader
            toggleModalAddRewardPunishment={toggleModalAddRewardPunishment}
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
      {openModalAddRewardPunishment && (
        <ModalAddRewardPunishment
          openModal={openModalAddRewardPunishment}
          toggleShowModal={toggleModalAddRewardPunishment}
          refreshRewardPunishmentList={refreshRewardPunishmentList}
        />
      )}
      {openModalEditRewardPunishment && (
        <ModalEditRewardPunishment
          openModal={openModalEditRewardPunishment}
          toggleShowModal={toggleModalEditRewardPunishment}
          refreshRewardPunishmentList={refreshRewardPunishmentList}
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
export default RewardPunishmentPage;
