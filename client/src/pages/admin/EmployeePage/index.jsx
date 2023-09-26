import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Row, Space, Table } from "antd";
import { toast } from "react-toastify";
import { getFullDate } from "utils/handleDate";
import {
  DeleteFilled,
  EditFilled,
  FilterFilled,
  PlusCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import { green, gold } from "@ant-design/colors";
import Search from "antd/es/input/Search";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setDefaultFilterData,
  setFilterData,
} from "reducers/employee";
import employeeApi from "api/employeeApi";

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
  },
  {
    title: "Last Name",
    key: "lastName",
    dataIndex: "lastName",
    sorter: (a, b) => a.lastName.localeCompare(b.lastName),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => a.profile.email.localeCompare(b.email),
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Gender",
    key: "gender",
    dataIndex: "gender",
    render: (_, { gender }) => (gender ? "Male" : "Female"),
    filters: [
      {
        text: "Male",
        value: true,
      },
      {
        text: "Female",
        value: false,
      },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.gender === value,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Date of Birth",
    dataIndex: "dateBirth",
    key: "dateBirth",
    sorter: (a, b) => new Date(a.dateBirth) - new Date(b.dateBirth),
    render: (date) => getFullDate(date),
  },
  {
    title: "Date of Job",
    dataIndex: "hireDate",
    key: "hireDate",
    sorter: (a, b) => new Date(a.hireDate) - new Date(b.hireDate),
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

function EmployeePage() {
  const dispatch = useDispatch();
  const { filterData, employeeList, total, currentPage } = useSelector(
    (state) => state.employee
  );
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [openModalAddEmployee, setOpenModalAddEmployee] = useState(false);

  const toggleModalAddEmployee = () => {
    setOpenModalAddEmployee(!openModalAddEmployee);
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await employeeApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            employeeList: data,
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
          $or: [
            {
              email: { $like: `%${value}%` },
            },
            {
              firstName: { $like: `%${value}%` },
            },
            {
              lastName: { $like: `%${value}%` },
            },
            {
              phoneNumber: { $like: `%${value}%` },
            },
          ],
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
            placeholder="Input search name, email or phone number"
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
              onClick={toggleModalAddEmployee}
            >
              Add User
            </Button>
            <Button type="primary" icon={<FilterFilled />}>
              Filter
            </Button>
          </Space>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Divider style={{ fontSize: 20 }}>Employee List</Divider>
      <Table
        columns={columns}
        dataSource={employeeList}
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
        toggleShowModal={toggleModalAddEmployee}
      /> */}
    </>
  );
}
export default EmployeePage;
