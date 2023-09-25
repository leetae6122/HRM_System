import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Row, Space, Table } from "antd";
import currencyApi from "api/currencyApi";
import { toast } from "react-toastify";
import { getFullDate } from "utils/handleDate";
import {
  DeleteOutlined,
  EditOutlined,
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
  setEditIdCurrency,
  setFilterData,
} from "reducers/currency";
import ModalAddCurrency from "./components/ModalAddCurrency";
import ModalEditCurrency from "./components/ModalEditCurrency";

const createColumns = (toggleModalEditCurrency, dispatch) => [
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
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    sorter: (a, b) => a.code.localeCompare(b.code),
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    width: 100,
    sorter: (a, b) => a.symbol.localeCompare(b.symbol),
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
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() =>
            dispatch(setEditIdCurrency(record.id)) &&
            toggleModalEditCurrency(record)
          }
        >
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

function CurrencyPage() {
  const dispatch = useDispatch();
  const { filterData, currencyList, total, currentPage } = useSelector(
    (state) => state.currency
  );
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [openModalAddCurrency, setOpenModalAddCurrency] = useState(false);
  const [openModalEditCurrency, setOpenModalEditCurrency] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await currencyApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            currencyList: data,
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

  const toggleModalEditCurrency = () => {
    setOpenModalEditCurrency(!openModalEditCurrency);
  };

  const toggleModalAddCurrency = () => {
    setOpenModalAddCurrency(!openModalAddCurrency);
  };

  const columns = createColumns(toggleModalEditCurrency, dispatch);

  const handleSearch = (value) => {
    setLoadingSearch(true);
    dispatch(
      setFilterData({
        ...filterData,
        where: {
          $or: [
            {
              name: { $like: `%${value}%` },
            },
            {
              code: { $like: `%${value}%` },
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
            placeholder="Input search name or code"
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
              onClick={toggleModalAddCurrency}
            >
              Add Currency
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
        dataSource={currencyList}
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
      {openModalAddCurrency && (
        <ModalAddCurrency
          openModal={openModalAddCurrency}
          toggleShowModal={toggleModalAddCurrency}
        />
      )}
      {openModalEditCurrency && (
        <ModalEditCurrency
          openModal={openModalEditCurrency}
          toggleShowModal={toggleModalEditCurrency}
        />
      )}
    </>
  );
}
export default CurrencyPage;
