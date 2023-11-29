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
import ModalAddEmployee from './ComponentAddEdit/ModalAddEmployee';
import defaultAvatar from 'assets/images/avatar-user.jpg';
import _ from 'lodash';
import ModalExportFile from './ExportFile/ModalExportFile';
import { setDefaultFilterData } from 'reducers/employee';

const createColumns = (
  navigator,
  toggleModalEditEmployee,
  handleDeleteEmployee,
) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
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
    sorter: true,
  },
  {
    title: 'Last Name',
    key: 'lastName',
    dataIndex: 'lastName',
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: true,
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    sorter: true,
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
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dateBirth',
    key: 'dateBirth',
    sorter: true,
    render: (date) => getFullDate(date),
  },
  {
    title: 'Day Off',
    dataIndex: 'dateOff',
    key: 'dateOff',
    sorter: true,
    render: (date) => (date ? getFullDate(date) : ''),
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
  refreshEmployeeList: PropTypes.func,
};

EmployeeListPage.defaultProps = {
  toggleModalEditEmployee: null,
  refreshEmployeeList: null,
};

function EmployeeListPage(props) {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { toggleModalEditEmployee, refreshEmployeeList } = props;
  const { filterData, employeeList, total, currentPage, defaultFilter } =
    useSelector((state) => state.employee);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddEmployee, setOpenModalAddEmployee] = useState(false);
  const [openExportFile, setOpenExportFile] = useState(false);
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

  useEffect(() => {
    if (_.isEqual(defaultFilter, filterData)) {
      setTableKey(tableKey + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const setFilter = (filter) => {
    dispatch(setFilterData(filter));
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

  const toggleModalAddEmployee = () => {
    setOpenModalAddEmployee(!openModalAddEmployee);
  };

  const toggleModalExportFile = () => {
    setOpenExportFile(!openExportFile);
  };

  const columns = createColumns(
    navigator,
    toggleModalEditEmployee,
    handleDeleteEmployee,
  );

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let where = filterData.where;
    let order = defaultFilter.order;

    where = _.omitBy(
      {
        ...where,
        gender: filters.gender,
      },
      _.isNil,
    );

    if (!_.isEmpty(sorter.column)) {
      if (_.isArray(sorter.field))
        order = [
          [...sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC'],
        ];
      else
        order = [[sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC']];
    }
    setFilter({ ...filterData, page, size, where, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        List of Employees
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={employeeList}
        bordered
        title={() => (
          <EmployeeTableHeader
            toggleModalAddEmployee={toggleModalAddEmployee}
            setFilter={setFilter}
            toggleModalExportFile={toggleModalExportFile}
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
      {openModalAddEmployee && (
        <ModalAddEmployee
          openModal={openModalAddEmployee}
          toggleShowModal={toggleModalAddEmployee}
          refreshEmployeeList={refreshEmployeeList}
        />
      )}
      {openExportFile && (
        <ModalExportFile
          toggleShowModal={toggleModalExportFile}
          openModal={openExportFile}
        />
      )}
    </>
  );
}

export default EmployeeListPage;
