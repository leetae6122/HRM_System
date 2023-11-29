import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import positionApi from 'api/positionApi';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditPositionId, setFilterData } from 'reducers/position';
import { numberWithDot } from 'utils/format';
import Swal from 'sweetalert2';
import FilterDrawer from './components/Filter/FilterDrawer';
import ModalAddPosition from './components/ComponentAddEdit/ModalAddPosition';
import ModalEditPosition from './components/ComponentAddEdit/ModalEditPosition';
import PositionTableHeader from './components/PositionTableHeader';
import _ from 'lodash';
import { getFullDate } from 'utils/handleDate';
import { setDefaultFilterData } from 'reducers/position';
import departmentApi from 'api/departmentApi';

const createColumns = (
  toggleModalEditPosition,
  handleDeletePosition,
  departmentFilter,
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
    title: 'Position Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'Min Hourly Wage',
    dataIndex: 'minHourlyWage',
    key: 'minHourlyWage',
    sorter: true,
    render: (value) => `${numberWithDot(value)} VNĐ/hr`,
  },
  {
    title: 'Max Hourly Wage',
    dataIndex: 'maxHourlyWage',
    key: 'maxHourlyWage',
    sorter: true,
    render: (value) => (value ? `${numberWithDot(value)} VNĐ/hr` : ''),
  },
  {
    title: 'Department',
    dataIndex: ['departmentData', 'name'],
    key: 'department',
    filters: departmentFilter,
  },
  {
    title: 'Date Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
    render: (date) => getFullDate(date),
  },
  {
    title: 'Date Updated',
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
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openModalAddPosition, setOpenModalAddPosition] = useState(false);
  const [openModalEditPosition, setOpenModalEditPosition] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    dispatch(setDefaultFilterData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const fetchDepartmentFilter = async () => {
      try {
        const response = await departmentApi.getAll();
        const options = response.data.map((department) => ({
          value: department.id,
          text: department.name,
        }));
        setDepartmentFilter(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchDepartmentFilter();
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
    dispatch(setFilterData(defaultFilter));
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
    toggleModalEditPosition,
    handleDeletePosition,
    departmentFilter,
  );

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let where = filterData.where;
    let order = defaultFilter.order;

    where = _.omitBy(
      {
        ...where,
        departmentId: filters.department,
      },
      _.isNil,
    );

    if (!_.isEmpty(sorter.column)) {
      order = [[sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC']];
    }
    setFilter({ ...filterData, page, size, where, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        List of Positions
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
