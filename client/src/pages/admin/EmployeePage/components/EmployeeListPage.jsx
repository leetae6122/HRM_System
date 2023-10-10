import { Button, Divider, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import EmployeeTableHeader from './EmployeeTableHeader';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import employeeApi from 'api/employeeApi';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled, EyeOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors';
import { setData, setFilterData } from 'reducers/employee';
import FilterDrawer from './Filter/FilterDrawer';
import ModalAddEmployee from './ComponentAddEdit/ModalAddEmployee';
import defaultAvatar from 'assets/images/avatar-user.jpg';

const createColumns = (
  navigator,
  toggleModalEditEmployee,
  handleDeleteEmployee,
) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Avatar',
    dataIndex: 'avatarUrl',
    key: 'avatar',
    render: (value) => (
      <img
        src={value ? value : defaultAvatar}
        alt="avatar"
        style={{ width: '100%' }}
      />
    ),
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
  },
  {
    title: 'Last Name',
    key: 'lastName',
    dataIndex: 'lastName',
    sorter: (a, b) => a.lastName.localeCompare(b.lastName),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
  },
  {
    title: 'Gender',
    key: 'gender',
    dataIndex: 'gender',
    render: (gender) => (gender ? 'Male' : 'Female'),
    filters: [
      {
        text: 'Male',
        value: true,
      },
      {
        text: 'Female',
        value: false,
      },
    ],
    filterMultiple: false,
    onFilter: (value, record) => !!record.gender === value,
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dateBirth',
    key: 'dateBirth',
    sorter: (a, b) => new Date(a.dateBirth) - new Date(b.dateBirth),
    render: (date) => getFullDate(date),
  },
  {
    title: 'Manager',
    key: 'managerData',
    dataIndex: 'managerData',
    render: (manager) =>
      manager ? `${manager.firstName} ${manager.lastName}` : '',
  },
  {
    title: 'Action',
    key: 'action',
    width: 145,
    render: (_, record) => (
      <Space size="small">
        <Button
          type="primary"
          style={{ background: gold[5] }}
          icon={<EyeOutlined />}
          onClick={() => navigator(record.id)}
        />
        <Button
          type="primary"
          icon={<EditFilled />}
          onClick={() => toggleModalEditEmployee(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteEmployee(record.id)}
        />
      </Space>
    ),
  },
];

EmployeeListPage.propTypes = {
  toggleModalEditEmployee: PropTypes.func,
};

EmployeeListPage.defaultProps = {
  toggleModalEditEmployee: null,
};

function EmployeeListPage(props) {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { toggleModalEditEmployee } = props;
  const { filterData, employeeList, total, currentPage, defaultFilter } =
    useSelector((state) => state.employee);
  const [loadingData, setLoadingData] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openModalAddEmployee, setOpenModalAddEmployee] = useState(false);

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
  }, [dispatch, filterData]);

  const setFilter = (filter) => {
    dispatch(setFilterData(filter));
  };

  const refreshEmployeeList = async () => {
    const response = (await employeeApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        employeeList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const handleDeleteEmployee = async (employeeId) => {
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
          await employeeApi.delete(employeeId);
          Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
          await refreshEmployeeList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const toggleShowFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer);
  };

  const toggleModalAddEmployee = () => {
    setOpenModalAddEmployee(!openModalAddEmployee);
  };

  const columns = createColumns(
    navigator,
    toggleModalEditEmployee,
    handleDeleteEmployee,
  );
  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Employee List
      </Divider>
      <Table
        columns={columns}
        dataSource={employeeList}
        bordered
        title={() => (
          <EmployeeTableHeader
            toggleModalAddEmployee={toggleModalAddEmployee}
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
        scroll={{ y: 500 }}
        loading={loadingData}
      />

      {openFilterDrawer && (
        <FilterDrawer
          toggleShowDrawer={toggleShowFilterDrawer}
          openDrawer={openFilterDrawer}
          refreshEmployeeList={refreshEmployeeList}
        />
      )}
      {openModalAddEmployee && (
        <ModalAddEmployee
          openModal={openModalAddEmployee}
          toggleShowModal={toggleModalAddEmployee}
          refreshEmployeeList={refreshEmployeeList}
        />
      )}
    </>
  );
}

export default EmployeeListPage;
