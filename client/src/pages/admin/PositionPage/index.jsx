import { useEffect, useState } from "react";
import { Button, Divider, Space, Table } from "antd";
import { toast } from "react-toastify";
import { getFullDate } from "utils/handleDate";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import positionApi from "api/positionApi";
import currencyApi from "api/currencyApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setDefaultFilterData,
  setEditPositionId,
  setFilterData,
} from "reducers/position";
import { numberWithDot } from "utils/format";
import Swal from "sweetalert2";
import FilterDrawer from "./components/Filter/FilterDrawer";
import ModalAddPosition from "./components/ComponentAddEdit/ModalAddPosition";
import ModalEditPosition from "./components/ComponentAddEdit/ModalEditPosition";
import PositionTableHeader from "./components/PositionTableHeader";

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
    render: (value) => numberWithDot(value),
  },
  {
    title: "Max Salary",
    dataIndex: "maxSalary",
    key: "maxSalary",
    sorter: (a, b) => a.maxSalary - b.maxSalary,
    render: (value) => (value ? numberWithDot(value) : ""),
  },
  {
    title: "Currency Code",
    dataIndex: ["currencyData", "code"],
    key: "currencyCode",
    filters: filtersCurrency || null,
    onFilter: (value, record) => record.currencyData.code.indexOf(value) === 0,
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

function PositionPage() {
  const dispatch = useDispatch();
  const { filterData, positionList, total, currentPage } = useSelector(
    (state) => state.position
  );
  const [loadingData, setLoadingData] = useState(false);
  const [filtersCurrency, setFiltersCurrency] = useState([]);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
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

  const toggleShowFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer);
  };

  const toggleModalEditPosition = (id) => {
    dispatch(setEditPositionId(id));
    setOpenModalEditPosition(!openModalEditPosition);
  };

  const toggleModalAddPosition = () => {
    setOpenModalAddPosition(!openModalAddPosition);
  };

  const columns = createColumns(
    filtersCurrency,
    toggleModalEditPosition,
    handleDeletePosition
  );

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: "bold" }}>Position List</Divider>
      <Table
        columns={columns}
        dataSource={positionList}
        bordered
        title={() => (
          <PositionTableHeader
            toggleModalAddPosition={toggleModalAddPosition}
            toggleShowFilterDrawer={toggleShowFilterDrawer}
          />
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
      {openFilterDrawer && (
        <FilterDrawer
          toggleShowDrawer={toggleShowFilterDrawer}
          openDrawer={openFilterDrawer}
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
