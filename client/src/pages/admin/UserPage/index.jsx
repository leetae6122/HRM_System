import { useEffect, useState } from "react";
import { Badge, Button, Divider, Space, Table, Tag } from "antd";
import userApi from "api/userApi";
import { toast } from "react-toastify";
import { getFullDate } from "utils/handleDate";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setDefaultFilterData,
  setEditUserId,
  setFilterData,
} from "reducers/user";
import UserTableHeader from "./components/UserTableHeader";
import ModalAddUser from "./components/ComponentAddEdit/ModalAddUser";
import Swal from "sweetalert2";
import ModalEditUser from "./components/ComponentAddEdit/ModalEditUser";

const createColumns = (toggleModalEditUser, handleDeleteUser) => [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    sorter: (a, b) => a.username.localeCompare(b.username),
  },
  {
    title: "Name",
    key: "name",
    render: (_, record) =>
      `${record.profile.firstName} ${record.profile.lastName}`,
  },
  {
    title: "Email",
    dataIndex: ["profile", "email"],
    key: "email",
    sorter: (a, b) => a.profile.email.localeCompare(b.email),
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "isActived",
    render: (_, { isActived }) => (
      <>
        {isActived ? (
          <Badge status="success" text="Actived" />
        ) : (
          <Badge status="error" text="Not activated" />
        )}
      </>
    ),
    filters: [
      {
        text: "Actived",
        value: true,
      },
      {
        text: "Not activated",
        value: false,
      },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.isActived === value,
  },
  {
    title: "Role",
    key: "role",
    dataIndex: "isAdmin",
    render: (_, { isAdmin }) => (
      <>
        <Tag
          style={{ padding: 8 }}
          color={isAdmin ? "green" : "default"}
          key={isAdmin}
        >
          {isAdmin ? "Admin" : "Staff"}
        </Tag>
      </>
    ),
    filters: [
      {
        text: "Admin",
        value: true,
      },
      {
        text: "Staff",
        value: false,
      },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.isActived === value,
  },
  {
    title: "Date created",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    render: (date) => getFullDate(date),
  },
  {
    title: "Date update",
    dataIndex: "updatedAt",
    key: "updatedAt",
    sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    render: (date) => getFullDate(date),
  },
  {
    title: "Action",
    key: "action",
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
  const { filterData, userList, total, currentPage } = useSelector(
    (state) => state.user
  );
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddUser, setOpenModalAddUser] = useState(false);
  const [openModalEditUser, setOpenModalEditUser] = useState(false);

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
          })
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

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await userApi.delete(userId);
          Swal.fire("Deleted!", "Currency has been deleted.", "success");
          dispatch(setDefaultFilterData());
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

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: "bold" }}>User List</Divider>
      <Table
        columns={columns}
        dataSource={userList}
        bordered
        title={() => (
          <UserTableHeader toggleModalAddUser={toggleModalAddUser} />
        )}
        pagination={{
          total,
          current: currentPage,
          pageSize: filterData.size,
          onChange: (page, pageSize) => {
            dispatch(
              setFilterData({
                ...filterData,
                page: page,
                size: pageSize,
              })
            );
          },
        }}
        scroll={{ y: 500 }}
        loading={loadingData}
      />
      {openModalAddUser && (
        <ModalAddUser
          openModal={openModalAddUser}
          toggleShowModal={toggleModalAddUser}
        />
      )}
      {openModalEditUser && (
        <ModalEditUser
          openModal={openModalEditUser}
          toggleShowModal={toggleModalEditUser}
        />
      )}
    </>
  );
}
export default UserPage;
