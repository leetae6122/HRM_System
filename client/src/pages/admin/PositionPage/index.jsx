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
import positionApi from "api/positionApi";
import currencyApi from "api/currencyApi";
import FilterDrawer from "./components/FilterDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setDefaultFilterData,
  setEditPositionId,
  setFilterData,
} from "reducers/position";
import ModalAddPosition from "./components/ComponentAddEdit/ModalAddPosition";
import Swal from "sweetalert2";
import ModalEditPosition from "./components/ComponentAddEdit/ModalEditPosition";

const createColumns = (
  filtersCurrency,
  toggleModalEditPosition,
  handleDeletePosition
) => [
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
  },
  {
    title: "Currency Code",
    dataIndex: ["currencyData", "code"],
    key: "currencyCode",
    filters: filtersCurrency || null,
    onFilter: (value, record) => record.currencyData.code.indexOf(value) === 0,
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
        <Button
          type="primary"
          icon={<EditFilled />}
          onClick={() => toggleModalEditPosition(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeletePosition(record.id)}
        />
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
  const dispatch = useDispatch();
  const { filterData, positionList, total, currentPage } = useSelector(
    (state) => state.position
  );
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [filtersCurrency, setFiltersCurrency] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModalAddPosition, setOpenModalAddPosition] = useState(false);
  const [openModalEditPosition, setOpenModalEditPosition] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await positionApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            positionList: data,
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
  }, [filterData, dispatch]);

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
    dispatch(
      setFilterData({
        ...filterData,
        where: {
          name: { $like: `%${value}%` },
        },
      })
    );
    setLoadingSearch(false);
  };

  const handleDeletePosition = async (positionId) => {
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
          await positionApi.delete(positionId);
          Swal.fire("Deleted!", "Currency has been deleted.", "success");
          dispatch(setDefaultFilterData());
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const toggleShowDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const toggleModalEditPosition = (id) => {
    dispatch(setEditPositionId(id));
    setOpenModalEditPosition(!openModalEditPosition);
  };

  const toggleModalAddPosition = () => {
    setOpenModalAddPosition(!openModalAddPosition);
  };

  const onFilter = (values) => {
    console.log("filter", values);
  };

  const columns = createColumns(
    filtersCurrency,
    toggleModalEditPosition,
    handleDeletePosition
  );

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
              onClick={toggleModalAddPosition}
            >
              Add Position
            </Button>
            <Button
              type="primary"
              icon={<FilterFilled />}
              onClick={toggleShowDrawer}
            >
              Filter
            </Button>
          </Space>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Divider style={{ fontSize: 20 }}>Position List</Divider>
      <Table
        columns={columns}
        dataSource={positionList}
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
      {openDrawer && (
        <FilterDrawer
          onFilter={onFilter}
          toggleShowDrawer={toggleShowDrawer}
          openDrawer={openDrawer}
        />
      )}
      {openModalAddPosition && (
        <ModalAddPosition
          openModal={openModalAddPosition}
          toggleShowModal={toggleModalAddPosition}
        />
      )}
      {openModalEditPosition && (
        <ModalEditPosition
          openModal={openModalEditPosition}
          toggleShowModal={toggleModalEditPosition}
        />
      )}
    </>
  );
}
export default PositionPage;
