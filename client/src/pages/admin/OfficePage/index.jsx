import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditOfficeId, setFilterData } from 'reducers/office';
import Swal from 'sweetalert2';
import OfficeTableHeader from './components/OfficeTableHeader';
import countryApi from 'api/countryApi';
import officeApi from 'api/officeApi';
import ModalAddOffice from './components/ComponentAddEdit/ModalAddOffice';
import ModalEditOffice from './components/ComponentAddEdit/ModalEditOffice';

const createColumns = (
  filtersCountry,
  toggleModalEditOffice,
  handleDeleteOffice,
) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => a.id - b.id,
    render: (id) => `#${id}`,
    width: 80,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    sorter: (a, b) => a.title.localeCompare(b.title),
  },
  {
    title: 'Street Address',
    dataIndex: 'streetAddress',
    key: 'streetAddress',
    sorter: (a, b) => a.streetAddress.localeCompare(b.streetAddress),
  },
  {
    title: 'Postal Code',
    dataIndex: 'postalCode',
    key: 'postalCode',
    sorter: (a, b) => a.postalCode - b.postalCode,
    render: (value) => (value ? value : ''),
  },
  {
    title: 'State / Province',
    dataIndex: 'stateProvince',
    key: 'stateProvince',
    sorter: (a, b) => a.stateProvince.localeCompare(b.stateProvince),
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    sorter: (a, b) => a.city.localeCompare(b.city),
  },
  {
    title: 'Country',
    dataIndex: ['countryData', 'name'],
    key: 'country',
    filters: filtersCountry || null,
    onFilter: (value, record) => record.countryData.name.indexOf(value) === 0,
  },
  {
    title: 'Date created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
          onClick={() => toggleModalEditOffice(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteOffice(record.id)}
        />
      </Space>
    ),
  },
];

function OfficePage() {
  const dispatch = useDispatch();
  const { filterData, officeList, total, currentPage, defaultFilter } =
    useSelector((state) => state.office);
  const [loadingData, setLoadingData] = useState(false);
  const [filtersCountry, setFiltersCountry] = useState([]);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openModalAddOffice, setOpenModalAddOffice] = useState(false);
  const [openModalEditOffice, setOpenModalEditOffice] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await officeApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            officeList: data,
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
        const response = (await countryApi.getAll()).data;
        const data = response.map((country) => ({
          text: country.name,
          value: country.name,
        }));
        setFiltersCountry(data);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

    const setFilter = (filter) => {
    dispatch(setFilterData(filter));
  };

  const refreshOfficeList = async () => {
    const response = (await officeApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        officeList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const handleDeleteOffice = async (officeId) => {
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
          await officeApi.delete(officeId);
          Swal.fire('Deleted!', 'Office has been deleted.', 'success');
          await refreshOfficeList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const toggleShowFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer);
  };

  const toggleModalEditOffice = (id) => {
    dispatch(setEditOfficeId(id));
    setOpenModalEditOffice(!openModalEditOffice);
  };

  const toggleModalAddOffice = () => {
    setOpenModalAddOffice(!openModalAddOffice);
  };

  const columns = createColumns(
    filtersCountry,
    toggleModalEditOffice,
    handleDeleteOffice,
  );

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Position List
      </Divider>
      <Table
        columns={columns}
        dataSource={officeList}
        bordered
        title={() => (
          <OfficeTableHeader
            toggleModalAddOffice={toggleModalAddOffice}
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
      {/* {openFilterDrawer && (
        <FilterDrawer
          toggleShowDrawer={toggleShowFilterDrawer}
          openDrawer={openFilterDrawer}
        />
      )} */}
      {openModalAddOffice && (
        <ModalAddOffice
          openModal={openModalAddOffice}
          toggleShowModal={toggleModalAddOffice}
          refreshOfficeList={refreshOfficeList}
        />
      )}
      {openModalEditOffice && (
        <ModalEditOffice
          openModal={openModalEditOffice}
          toggleShowModal={toggleModalEditOffice}
          refreshOfficeList={refreshOfficeList}
        />
      )}
    </>
  );
}
export default OfficePage;
