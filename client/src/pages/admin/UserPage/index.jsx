import { useEffect, useState } from 'react';
import { Badge, Button, Divider, Space, Table, Tag } from 'antd';
import userApi from 'api/userApi';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditUserId, setFilterData } from 'reducers/user';
import UserTableHeader from './components/UserTableHeader';
import ModalAddUser from './components/ComponentAddEdit/ModalAddUser';
import Swal from 'sweetalert2';
import ModalEditUser from './components/ComponentAddEdit/ModalEditUser';
import _ from 'lodash';

const createColumns = (toggleModalEditUser, handleDeleteUser) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    sorter: true,
  },
  {
    title: 'Employee',
    key: 'employee',
    dataIndex: ['profile', 'firstName'],
    sorter: true,
    render: (_, record) =>
      `${record.profile.firstName} ${record.profile.lastName}`,
  },
  {
    title: 'Email',
    dataIndex: ['profile', 'email'],
    key: 'email',
    sorter: true,
  },
  {
    title: 'Status',
    key: 'isActive',
    dataIndex: 'isActive',
    render: (isActive) => (
      <>
        {isActive ? (
          <Badge status="success" text="Actived" />
        ) : (
          <Badge status="error" text="Not activated" />
        )}
      </>
    ),
    filters: [
      {
        text: 'Actived',
        value: true,
      },
      {
        text: 'Not activated',
        value: false,
      },
    ],
    filterMultiple: false,
  },
  {
    title: 'Role',
    key: 'isAdmin',
    dataIndex: 'isAdmin',
    render: (isAdmin) => (
      <>
        <Tag
          style={{ padding: 8 }}
          color={isAdmin ? 'green' : 'default'}
          key={isAdmin}
        >
          {isAdmin ? 'Admin' : 'Staff'}
        </Tag>
      </>
    ),
    filters: [
      {
        text: 'Admin',
        value: true,
      },
      {
        text: 'Staff',
        value: false,
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
          onClick={() => toggleModalEditUser(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteUser(record.id)}
        />
      </Space>
    ),
  },
];

function UserPage() {
  const dispatch = useDispatch();
  const { filterData, userList, total, currentPage, defaultFilter } =
    useSelector((state) => state.user);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddUser, setOpenModalAddUser] = useState(false);
  const [openModalEditUser, setOpenModalEditUser] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await userApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            userList: data,
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

  const refreshUserList = async () => {
    const response = (await userApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        userList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const handleDeleteUser = async (userId) => {
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
          await userApi.delete(userId);
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          await refreshUserList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const toggleModalAddUser = () => {
    setOpenModalAddUser(!openModalAddUser);
  };

  const toggleModalEditUser = (id) => {
    dispatch(setEditUserId(id));
    setOpenModalEditUser(!openModalEditUser);
  };
  const columns = createColumns(toggleModalEditUser, handleDeleteUser);

  const onChangeTable = (pagination, filters, sorter) => {
    let where = filterData.where;
    let order = defaultFilter.order;

    where = _.omitBy(
      {
        ...where,
        isAdmin: filters.isAdmin,
        isActive: filters.isActive,
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
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>User List</Divider>
      <Table
        key={tableKey}
        onChange={onChangeTable}
        columns={columns}
        dataSource={userList}
        bordered
        title={() => (
          <UserTableHeader
            toggleModalAddUser={toggleModalAddUser}
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
      {openModalAddUser && (
        <ModalAddUser
          openModal={openModalAddUser}
          toggleShowModal={toggleModalAddUser}
          refreshUserList={refreshUserList}
        />
      )}
      {openModalEditUser && (
        <ModalEditUser
          openModal={openModalEditUser}
          toggleShowModal={toggleModalEditUser}
          refreshUserList={refreshUserList}
        />
      )}
    </>
  );
}
export default UserPage;
