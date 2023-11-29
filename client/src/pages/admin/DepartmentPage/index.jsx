import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  setData,
  setEditDepartmentId,
  setFilterData,
} from 'reducers/department';
import Swal from 'sweetalert2';
import departmentApi from 'api/departmentApi';
import DepartmentTableHeader from './components/DepartmentTableHeader';
import ModalAddDepartment from './components/ComponentAddEdit/ModalAddDepartment';
import ModalEditDepartment from './components/ComponentAddEdit/ModalEditDepartment';
import _ from 'lodash';
import { getFullDate } from 'utils/handleDate';
import { setDefaultFilterData } from 'reducers/department';

const createColumns = (toggleModalEditDepartment, handleDeleteDepartment) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Department Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'Short Name',
    dataIndex: 'shortName',
    key: 'shortName',
    sorter: true,
  },
  {
    title: 'Manager',
    dataIndex: ['managerData', 'id'],
    key: 'managerData',
    sorter: true,
    render: (_, record) =>
      record.managerData.id
        ? `#${record.managerData.id} - ${record.managerData.lastName} ${record.managerData.firstName}`
        : 'No manager',
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
          onClick={() => toggleModalEditDepartment(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteDepartment(record.id)}
        />
      </Space>
    ),
  },
];

function DepartmentPage() {
  const dispatch = useDispatch();
  const { filterData, departmentList, total, currentPage, defaultFilter } =
    useSelector((state) => state.department);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddDepartment, setOpenModalAddDepartment] = useState(false);
  const [openModalEditDepartment, setOpenModalEditDepartment] = useState(false);
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
        const response = (await departmentApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            departmentList: data,
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
    if (_.isEqual(defaultFilter, filterData)) {
      setTableKey(tableKey + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const setFilter = (filter) => {
    dispatch(setFilterData(filter));
  };

  const refreshDepartmentList = async () => {
    const response = (await departmentApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        departmentList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
    dispatch(setFilterData(defaultFilter));
  };

  const handleDeleteDepartment = async (departmentId) => {
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
          await departmentApi.delete(departmentId);
          Swal.fire('Deleted!', 'Department has been deleted.', 'success');
          await refreshDepartmentList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const toggleModalEditDepartment = (id) => {
    dispatch(setEditDepartmentId(id));
    setOpenModalEditDepartment(!openModalEditDepartment);
  };

  const toggleModalAddDepartment = () => {
    setOpenModalAddDepartment(!openModalAddDepartment);
  };

  const columns = createColumns(
    toggleModalEditDepartment,
    handleDeleteDepartment,
  );

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let order = defaultFilter.order;

    if (!_.isEmpty(sorter.column)) {
      if (_.isArray(sorter.field))
        order = [
          [...sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC'],
        ];
      else
        order = [[sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC']];
    }

    setFilter({ ...filterData, page, size, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        List of Departments
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={departmentList}
        bordered
        title={() => (
          <DepartmentTableHeader
            toggleModalAddDepartment={toggleModalAddDepartment}
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
      {/* {openFilterDrawer && (
        <FilterDrawer
          toggleShowDrawer={toggleShowFilterDrawer}
          openDrawer={openFilterDrawer}
        />
      )} */}
      {openModalAddDepartment && (
        <ModalAddDepartment
          openModal={openModalAddDepartment}
          toggleShowModal={toggleModalAddDepartment}
          refreshDepartmentList={refreshDepartmentList}
        />
      )}
      {openModalEditDepartment && (
        <ModalEditDepartment
          openModal={openModalEditDepartment}
          toggleShowModal={toggleModalEditDepartment}
          refreshDepartmentList={refreshDepartmentList}
        />
      )}
    </>
  );
}
export default DepartmentPage;
