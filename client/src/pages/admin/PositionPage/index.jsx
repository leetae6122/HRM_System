import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import positionApi from 'api/positionApi';
import currencyApi from 'api/currencyApi';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditPositionId, setFilterData } from 'reducers/position';
import { numberWithDot } from 'utils/format';
import Swal from 'sweetalert2';
import FilterDrawer from './components/Filter/FilterDrawer';
import ModalAddPosition from './components/ComponentAddEdit/ModalAddPosition';
import ModalEditPosition from './components/ComponentAddEdit/ModalEditPosition';
import PositionTableHeader from './components/PositionTableHeader';
import _ from 'lodash';

const createColumns = (
  filtersCurrency,
  toggleModalEditPosition,
  handleDeletePosition,
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
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Min Salary',
    dataIndex: 'minSalary',
    key: 'minSalary',
    sorter: true,
    render: (value) => numberWithDot(value),
  },
  {
    title: 'Max Salary',
    dataIndex: 'maxSalary',
    key: 'maxSalary',
    sorter: true,
    render: (value) => (value ? numberWithDot(value) : ''),
  },
  {
    title: 'Currency Code',
    dataIndex: ['currencyData', 'code'],
    key: 'code',
    filters: filtersCurrency || null,
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
  const { filterData, positionList, total, currentPage, defaultFilter } =
    useSelector((state) => state.position);
  const [loadingData, setLoadingData] = useState(false);
  const [filtersCurrency, setFiltersCurrency] = useState([]);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openModalAddPosition, setOpenModalAddPosition] = useState(false);
  const [openModalEditPosition, setOpenModalEditPosition] = useState(false);
  const [tableKey, setTableKey] = useState(0);

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

  useEffect(() => {
    if (_.isEqual(defaultFilter, filterData)) {
      setTableKey(tableKey + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const setFilter = (filter) => {
    dispatch(setFilterData(filter));
  };

  const refreshPositionList = async () => {
    const response = (await positionApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        positionList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const handleDeletePosition = async (positionId) => {
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
          await positionApi.delete(positionId);
          Swal.fire('Deleted!', 'Position has been deleted.', 'success');
          await refreshPositionList();
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
    handleDeletePosition,
  );

  const onChangeTable = (pagination, filters, sorter) => {
    let order = defaultFilter.order;
    let modelEmployee = filterData.modelEmployee ?? {};
    modelEmployee = {
      where: _.omitBy(
        {
          ...filters,
        },
        _.isNil,
      ),
    };

    if (!_.isEmpty(sorter.column)) {
      order = [[sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC']];
    }
    setFilter({ ...filterData, modelEmployee, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Position List
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={positionList}
        bordered
        title={() => (
          <PositionTableHeader
            toggleModalAddPosition={toggleModalAddPosition}
            toggleShowFilterDrawer={toggleShowFilterDrawer}
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
        onChange={onChangeTable}
        scroll={{ y: 500 }}
        loading={loadingData}
      />
      {openFilterDrawer && (
        <FilterDrawer
          toggleShowDrawer={toggleShowFilterDrawer}
          openDrawer={openFilterDrawer}
          setFilter={setFilter}
        />
      )}
      {openModalAddPosition && (
        <ModalAddPosition
          openModal={openModalAddPosition}
          toggleShowModal={toggleModalAddPosition}
          refreshPositionList={refreshPositionList}
        />
      )}
      {openModalEditPosition && (
        <ModalEditPosition
          openModal={openModalEditPosition}
          toggleShowModal={toggleModalEditPosition}
          refreshPositionList={refreshPositionList}
        />
      )}
    </>
  );
}
export default PositionPage;
