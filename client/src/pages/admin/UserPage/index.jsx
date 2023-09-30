import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Divider, Row, Space, Table, Tag } from "antd";
import userApi from "api/userApi";
import { toast } from "react-toastify";
import { getFullDate } from "utils/handleDate";
import {
  DeleteFilled,
  EditFilled,
  PlusCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import { green, gold } from "@ant-design/colors";
import Search from "antd/es/input/Search";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { setData, setDefaultFilterData, setFilterData } from "reducers/user";

const columns = [
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
    title: "Create At",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    render: (date) => getFullDate(date),
  },
  {
    title: "Update At",
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
        <Button type="primary" icon={<EditFilled />} />
        <Button type="primary" danger icon={<DeleteFilled />} />
      </Space>
    ),
  },
];

const defaultFilter = {
  page: 1,
  size: 10,
  where: {},
};

function UserPage() {
  const dispatch = useDispatch();
  const { filterData, userList, total, currentPage } = useSelector(
    (state) => state.user
  );
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [openModalAddUser, setOpenModalAddUser] = useState(false);

  const toggleModalAddUser = () => {
    setOpenModalAddUser(!openModalAddUser);
  };

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

  const handleSearch = (value) => {
    setLoadingSearch(true);
    dispatch(
      setFilterData({
        ...filterData,
        where: {
          username: { $like: `%${value}%` },
        },
        modelWhere: {
          $or: _.flatten(
            _.map(["firstName", "lastName", "email"], function (item) {
              return _.map(value.split(" "), function (q) {
                return { [item]: { $like: "%" + q + "%" } };
              });
            })
          ),
        },
      })
    );
    setLoadingSearch(false);
  };

  const HeaderTable = () => {
    return (
      <Row>
        <Col span={8}>
          <Search
            placeholder="Input search name or email or username"
            allowClear
            loading={loadingSearch}
            enterButton
            onSearch={handleSearch}
          />
        </Col>
        <Col span={16}>
          <Space style={{ float: "right" }}>
            {!_.isEqual(filterData, defaultFilter) && (
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => dispatch(setDefaultFilterData())}
                style={{ backgroundColor: gold.primary }}
              >
                Reset
              </Button>
            )}
            <Button
              type="primary"
              style={{ backgroundColor: green.primary }}
              icon={<PlusCircleFilled />}
              onClick={toggleModalAddUser}
            >
              Add User
            </Button>
          </Space>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Divider style={{ fontSize: 20 }}>User List</Divider>
      <Table
        columns={columns}
        dataSource={userList}
        bordered
        title={() => <HeaderTable />}
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
      {/* <ModalAddCurrency
        openModal={openModalAddCurrency}
        toggleShowModal={toggleModalAddUser}
      /> */}
    </>
  );
}
export default UserPage;
