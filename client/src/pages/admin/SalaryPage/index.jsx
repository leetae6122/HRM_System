import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import currencyApi from 'api/currencyApi';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditSalaryId, setFilterData } from 'reducers/salary';
import { numberWithDot } from 'utils/format';
import Swal from 'sweetalert2';
import SalaryTableHeader from './components/SalaryTableHeader';
import salaryApi from 'api/salaryApi';
import ModalAddSalary from './components/ComponentAddEdit/ModalAddSalary';
import ModalEditSalary from './components/ComponentAddEdit/ModalEditSalary';
import _ from 'lodash';

const createColumns = (
  filtersCurrency,
  toggleModalEditSalary,
  handleDeleteSalary,
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
    title: 'Basic Hourly Salary',
    dataIndex: 'basicHourlySalary',
    key: 'basicHourlySalary',
    sorter: true,
    render: (value, record) => `${numberWithDot(value)}${record.currencyData.symbol}/hr`,
  },
  {
    title: 'Hourly Overtime Salary',
    dataIndex: 'hourlyOvertimeSalary',
    key: 'hourlyOvertimeSalary',
    sorter: true,
    render: (value, record) => `${numberWithDot(value)}${record.currencyData.symbol}/hr`,
  },
  {
    title: 'Allowance',
    dataIndex: 'allowance',
    key: 'allowance',
    sorter: true,
    render: (value, record) => (value ? `${numberWithDot(value)}${record.currencyData.symbol}` : value),
  },
  {
    title: 'Currency Code',
    dataIndex: ['currencyData', 'code'],
    key: 'code',
    filters: filtersCurrency || null,
  },
  {
    title: 'Employee',
    dataIndex: ['employeeData', 'firstName'],
    key: 'employeeData',
    sorter: true,
    render: (_, record) =>
      `${record.employeeData.firstName} ${record.employeeData.lastName}`,
  },
  {
    title: 'Added By',
    dataIndex: ['adderData', 'firstName'],
    key: 'adderData',
    sorter: true,
    render: (_, record) =>
      `${record.adderData.firstName} ${record.adderData.lastName}`,
  },
  {
    title: 'Date created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    render: (date) => getFullDate(date),
  },
  {
    title: 'Date update',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
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
          onClick={() => toggleModalEditSalary(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteSalary(record.id)}
        />
      </Space>
    ),
  },
];

function SalaryPage() {
  const dispatch = useDispatch();
  const { filterData, salaryList, total, currentPage, defaultFilter } =
    useSelector((state) => state.salary);
  const [loadingData, setLoadingData] = useState(false);
  const [filtersCurrency, setFiltersCurrency] = useState([]);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openModalAddSalary, setOpenModalAddSalary] = useState(false);
  const [openModalEditSalary, setOpenModalEditSalary] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await salaryApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            salaryList: data,
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

  const refreshSalaryList = async () => {
    const response = (await salaryApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        salaryList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const handleDeleteSalary = async (salaryId) => {
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
          await salaryApi.delete(salaryId);
          Swal.fire('Deleted!', 'Salary has been deleted.', 'success');
          await refreshSalaryList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const toggleShowFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer);
  };

  const toggleModalEditSalary = (id) => {
    dispatch(setEditSalaryId(id));
    setOpenModalEditSalary(!openModalEditSalary);
  };

  const toggleModalAddSalary = () => {
    setOpenModalAddSalary(!openModalAddSalary);
  };

  const columns = createColumns(
    filtersCurrency,
    toggleModalEditSalary,
    handleDeleteSalary,
  );

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let order = defaultFilter.order;
    let modelCurrency = filterData.modelCurrency;

    modelCurrency = {
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
    setFilter({ ...filterData, page, size, order, modelCurrency });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Salary List
      </Divider>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={salaryList}
        bordered
        title={() => (
          <SalaryTableHeader
            toggleModalAddSalary={toggleModalAddSalary}
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
      {/* {openFilterDrawer && (
        <FilterDrawer
          toggleShowDrawer={toggleShowFilterDrawer}
          openDrawer={openFilterDrawer}
        />
      )} */}
      {openModalAddSalary && (
        <ModalAddSalary
          openModal={openModalAddSalary}
          toggleShowModal={toggleModalAddSalary}
          refreshSalaryList={refreshSalaryList}
        />
      )}
      {openModalEditSalary && (
        <ModalEditSalary
          openModal={openModalEditSalary}
          toggleShowModal={toggleModalEditSalary}
          refreshSalaryList={refreshSalaryList}
        />
      )}
    </>
  );
}
export default SalaryPage;
