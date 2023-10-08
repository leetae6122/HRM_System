import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditCountryId, setFilterData } from 'reducers/country';

import CountryTableHeader from './components/CountryTableHeader';
import Swal from 'sweetalert2';
import countryApi from 'api/countryApi';
import ModalAddCountry from './components/ComponentAddEdit/ModalAddCountry';
import ModalEditCountry from './components/ComponentAddEdit/ModalEditCountry';

const createColumns = (toggleModalEditCountry, handleDeleteCountry) => [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => a.id - b.id,
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
    title: 'Country Code',
    dataIndex: 'countryCode',
    key: 'countryCode',
    sorter: (a, b) => a.countryCode - b.countryCode,
  },
  {
    title: 'IsoCode',
    dataIndex: 'isoCode',
    key: 'isoCode',
    sorter: (a, b) => a.isoCode.localeCompare(b.isoCode),
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
          onClick={() => toggleModalEditCountry(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteCountry(record.id)}
        />
      </Space>
    ),
  },
];

function CountryPage() {
  const dispatch = useDispatch();
  const { filterData, countryList, total, currentPage, defaultFilter } =
    useSelector((state) => state.country);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddCountry, setOpenModalAddCountry] = useState(false);
  const [openModalEditCountry, setOpenModalEditCountry] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await countryApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            countryList: data,
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

  const refreshCountryList = async () => {
    const response = (await countryApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        countryList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const toggleModalEditCountry = (id) => {
    dispatch(setEditCountryId(id));
    setOpenModalEditCountry(!openModalEditCountry);
  };

  const toggleModalAddCountry = () => {
    setOpenModalAddCountry(!openModalAddCountry);
  };

  const handleDeleteCountry = async (countryId) => {
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
          await countryApi.delete(countryId);
          Swal.fire('Deleted!', 'Country has been deleted.', 'success');
          await refreshCountryList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(toggleModalEditCountry, handleDeleteCountry);

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Country List
      </Divider>
      <Table
        columns={columns}
        dataSource={countryList}
        bordered
        title={() => (
          <CountryTableHeader toggleModalAddCountry={toggleModalAddCountry} setFilter={setFilter}/>
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
      {openModalAddCountry && (
        <ModalAddCountry
          openModal={openModalAddCountry}
          toggleShowModal={toggleModalAddCountry}
          refreshCountryList={refreshCountryList}
        />
      )}
      {openModalEditCountry && (
        <ModalEditCountry
          openModal={openModalEditCountry}
          toggleShowModal={toggleModalEditCountry}
          refreshCountryList={refreshCountryList}
        />
      )}
    </>
  );
}
export default CountryPage;
