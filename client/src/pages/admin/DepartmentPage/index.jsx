import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  setData,
  setEditDepartmentId,
  setFilterData,
} from 'reducers/department';
import Swal from 'sweetalert2';
import officeApi from 'api/officeApi';
import departmentApi from 'api/departmentApi';
import DepartmentTableHeader from './components/DepartmentTableHeader';
import ModalAddDepartment from './components/ComponentAddEdit/ModalAddDepartment';
import ModalEditDepartment from './components/ComponentAddEdit/ModalEditDepartment';
import _ from 'lodash';

const createColumns = (
  filtersOffice,
  toggleModalEditDepartment,
  handleDeleteDepartment,
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
    sorter: true,
  },
  {
    title: 'Short Name',
    dataIndex: 'shortName',
    key: 'shortName',
    sorter: true,
  },
  {
    title: 'Office',
    dataIndex: ['officeData', 'title'],
    key: 'title',
    filters: filtersOffice || null,
  },
  {
    title: 'Manager',
    dataIndex: ['managerData', 'firstName'],
    key: 'managerData',
    sorter: true,
    render: (manager, record) =>
      record.managerId ? `${manager.firstName} ${manager.lastName}` : '',
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
  const [filtersOffice, setFiltersOffice] = useState([]);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openModalAddDepartment, setOpenModalAddDepartment] = useState(false);
  const [openModalEditDepartment, setOpenModalEditDepartment] = useState(false);
  const [tableKey, setTableKey] = useState(0);

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
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await officeApi.getAll()).data;
        const data = response.map((office) => ({
          text: office.title,
          value: office.title,
        }));
        setFiltersOffice(data);
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

  const toggleShowFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer);
  };

  const toggleModalEditDepartment = (id) => {
    dispatch(setEditDepartmentId(id));
    setOpenModalEditDepartment(!openModalEditDepartment);
  };

  const toggleModalAddDepartment = () => {
    setOpenModalAddDepartment(!openModalAddDepartment);
  };

  const columns = createColumns(
    filtersOffice,
    toggleModalEditDepartment,
    handleDeleteDepartment,
  );

  const onChangeTable = (pagination, filters, sorter) => {
    let order = defaultFilter.order;
    let modelOffice = filterData.modelOffice ?? {};
    modelOffice = {
      where: _.omitBy(
        {
          ...filters,
        },
        _.isNil,
      ),
    };
 
    if (!_.isEmpty(sorter.column)) {
      if (_.isArray(sorter.field))
        order = [
          [...sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC'],
        ];
      else
        order = [[sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC']];
    }
 
    setFilter({ ...filterData, modelOffice, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Department List
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={departmentList}
        bordered
        title={() => (
          <DepartmentTableHeader
            toggleModalAddDepartment={toggleModalAddDepartment}
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
