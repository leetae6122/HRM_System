import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import currencyApi from 'api/currencyApi';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditCurrencyId, setFilterData } from 'reducers/currency';
import ModalAddCurrency from './components/ComponentAddEdit/ModalAddCurrency';
import ModalEditCurrency from './components/ComponentAddEdit/ModalEditCurrency';
import CurrencyTableHeader from './components/CurrencyTableHeader';
import Swal from 'sweetalert2';
import _ from 'lodash';

const createColumns = (toggleModalEditCurrency, handleDeleteCurrency) => [
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
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    sorter: true,
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    sorter: true,
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
          onClick={() => toggleModalEditCurrency(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteCurrency(record.id)}
        />
      </Space>
    ),
  },
];

function CurrencyPage() {
  const dispatch = useDispatch();
  const { filterData, currencyList, total, currentPage, defaultFilter } =
    useSelector((state) => state.currency);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddCurrency, setOpenModalAddCurrency] = useState(false);
  const [openModalEditCurrency, setOpenModalEditCurrency] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await currencyApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            currencyList: data,
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

  const refreshCurrencyList = async () => {
    const response = (await currencyApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        currencyList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const toggleModalEditCurrency = (id) => {
    dispatch(setEditCurrencyId(id));
    setOpenModalEditCurrency(!openModalEditCurrency);
  };

  const toggleModalAddCurrency = () => {
    setOpenModalAddCurrency(!openModalAddCurrency);
  };

  const handleDeleteCurrency = async (currencyId) => {
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
          await currencyApi.delete(currencyId);
          Swal.fire('Deleted!', 'Currency has been deleted.', 'success');
          await refreshCurrencyList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(toggleModalEditCurrency, handleDeleteCurrency);

  const onChangeTable = (pagination, filters, sorter) => {
    let order = defaultFilter.order;

    if (!_.isEmpty(sorter.column)) {
      if (_.isArray(sorter.field))
        order = [
          [...sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC'],
        ];
      else
        order = [[sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC']];
    }
    setFilter({ ...filterData, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Currency List
      </Divider>
      <Table
        columns={columns}
        dataSource={currencyList}
        bordered
        title={() => (
          <CurrencyTableHeader
            toggleModalAddCurrency={toggleModalAddCurrency}
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
      {openModalAddCurrency && (
        <ModalAddCurrency
          openModal={openModalAddCurrency}
          toggleShowModal={toggleModalAddCurrency}
          refreshCurrencyList={refreshCurrencyList}
        />
      )}
      {openModalEditCurrency && (
        <ModalEditCurrency
          openModal={openModalEditCurrency}
          toggleShowModal={toggleModalEditCurrency}
          refreshCurrencyList={refreshCurrencyList}
        />
      )}
    </>
  );
}
export default CurrencyPage;
