import React from "react";
import { Divider, Space, Table, Tag } from "antd";

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    sorter: (a, b) => a.id.localeCompare(b.id),
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    sorter: (a, b) => a.username.localeCompare(b.username),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "isActived",
    render: (_, { isActived }) => (
      <>
        <Tag
          style={{ padding: 8 }}
          color={isActived ? "green" : "red"}
          key={isActived}
        >
          {isActived ? "Actived" : "Not activated"}
        </Tag>
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
          color={isAdmin ? "blue" : "default"}
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
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a href="/">Invite {record.name}</a>
        <a href="/">Delete</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    id: "1",
    username: "john.brown",
    name: "John Brown",
    email: "john.brown@hrm_system.com",
    isActived: true,
    isAdmin: true,
  },
  {
    key: "2",
    id: "2",
    username: "Andres.green",
    name: "Andres Green",
    email: "andres.green@hrm_system.com",
    isActived: false,
    isAdmin: false,
  },
  {
    key: "3",
    id: "3",
    username: "Tom.black",
    name: "Tom Black",
    email: "Tom.black@hrm_system.com",
    isActived: true,
    isAdmin: false,
  },
];

function UserPage() {
  return (
    <>
      <Divider style={{fontSize: 20}}>User List</Divider>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        title={() => <h4>User List</h4>}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
        }}
        scroll={{ y: 240 }}
      />
    </>
  );
}
export default UserPage;
