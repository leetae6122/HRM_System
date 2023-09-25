import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Row, Space, Table } from "antd";
import { toast } from "react-toastify";
import { getFullDate } from "utils/handleDate";
import {
  DeleteOutlined,
  EditOutlined,
  FilterFilled,
  PlusCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import { green, gold } from "@ant-design/colors";
import Search from "antd/es/input/Search";
import _ from "lodash";
import positionApi from "api/positionApi";
import currencyApi from "api/currencyApi";
import FilterDrawer from "./components/FilterDrawer";

const createColumns = (filtersCurrency) => [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    sorter: (a, b) => a.id - b.id,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: "Name",
    dataIndex: "positionName",
    key: "positionName",
    sorter: (a, b) => a.positionName.localeCompare(b.positionName),
  },
  {
    title: "Min Salary",
    dataIndex: "minSalary",
    key: "minSalary",
    sorter: (a, b) => a.minSalary - b.minSalary,
  },
  {
    title: "Max Salary",
    dataIndex: "maxSalary",
    key: "maxSalary",
    sorter: (a, b) => a.maxSalary - b.maxSalary,
    render: (salary) => (salary > 0 ? salary : 0),
  },
  {
    title: "Currency Code",
    dataIndex: ["currencyData", "code"],
    key: "currencyCode",
    filters: filtersCurrency,
    onFilter: (value, record) => record.currencyData.code.indexOf(value) === 0,
  },
  {
    title: "Create At",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 120,
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    render: (date) => getFullDate(date),
  },
  {
    title: "Update At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 120,
    sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    render: (date) => getFullDate(date),
  },
  {
    title: "Action",
    key: "action",
    width: 220,
    render: (_, record) => (
      <Space size="middle">
        <Button type="primary" icon={<EditOutlined />}>
          Edit
        </Button>
        <Button type="primary" danger icon={<DeleteOutlined />}>
          Delete
        </Button>
      </Space>
    ),
  },
];

const defaultFilter = {
  page: 1,
  size: 10,
  where: {},
};

function PositionPage() {
  const [filter, setFilter] = useState(defaultFilter);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [currentPage, setCurrentPage] = useState(defaultFilter.page);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [filtersCurrency, setFiltersCurrency] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  const columns = createColumns(filtersCurrency);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await positionApi.getList(filter)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        setCurrentPage(response.currentPage);
        setTotalCount(response.total);
        setData(data);
        setLoadingData(false);
      } catch (error) {
        toast.error(error);
        setLoadingData(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [filter]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await currencyApi.getAll()).data;
        const data = response.map((currency) => ({
          text: currency.code,
          value: currency.code,
        }));
        setFiltersCurrency(data);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const handleSearch = (value) => {
    setLoadingSearch(true);
    setFilter({
      ...filter,
      where: {
        positionName: { $like: `%${value}%` },
      },
    });
    console.log(filter);
    setLoadingSearch(false);
  };

  const toggleShowDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const onFilter = (values) => {
    console.log("filter", values);
  };

  const HeaderTable = () => {
    return (
      <Row>
        <Col span={8}>
          <Search
            placeholder="Input search name"
            allowClear
            loading={loadingSearch}
            enterButton
            onSearch={handleSearch}
          />
        </Col>
        <Col span={16}>
          <Space style={{ float: "right" }}>
            {!_.isEqual(filter, defaultFilter) && (
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => setFilter(defaultFilter)}
                style={{ backgroundColor: gold.primary }}
              >
                Reset
              </Button>
            )}
            <Button
              type="primary"
              style={{ backgroundColor: green.primary }}
              icon={<PlusCircleFilled />}
            >
              Add Currency
            </Button>
            <Button type="primary" icon={<FilterFilled />} onClick={toggleShowDrawer}>
              Filter
            </Button>
          </Space>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Divider style={{ fontSize: 20 }}>Currency List</Divider>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        title={() => <HeaderTable />}
        pagination={{
          total: totalCount,
          current: currentPage,
          pageSize: filter.size,
          onChange: (page, pageSize) => {
            setFilter({
              ...filter,
              page: page,
              size: pageSize,
            });
          },
        }}
        scroll={{ y: 500 }}
        loading={loadingData}
      />
      <FilterDrawer
        onFilter={onFilter}
        toggleShowDrawer={toggleShowDrawer}
        openDrawer={openDrawer}
      />
    </>
  );
}
export default PositionPage;
