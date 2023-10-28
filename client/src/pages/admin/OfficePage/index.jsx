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
import _ from 'lodash';

const createColumns = (
  filtersCountry,
  toggleModalEditOffice,
  handleDeleteOffice,
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
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
  },
  {
    title: 'Street Address',
    dataIndex: 'streetAddress',
    key: 'streetAddress',
    sorter: true,
  },
  {
    title: 'Postal Code',
    dataIndex: 'postalCode',
    key: 'postalCode',
    sorter: true,
    render: (value) => (value ? value : ''),
  },
  {
    title: 'State / Province',
    dataIndex: 'stateProvince',
    key: 'stateProvince',
    sorter: true,
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    sorter: true,
  },
  {
    title: 'Country',
    dataIndex: ['countryData', 'name'],
    key: 'name',
    filters: filtersCountry || null,
    filterSearch: true,
  },
  {
    title: 'Date created',
    dataIndex: 'createdAt',
    key: 'createdAt',
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
  const [tableKey, setTableKey] = useState(0);

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

  useEffect(() => {
    if (_.isEqual(defaultFilter, filterData)) {
      setTableKey(tableKey + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

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

  const onChangeTable = (pagination, filters, sorter) => {
    const page = pagination.current;
    const size = pagination.pageSize;
    let order = defaultFilter.order;

    let modelCountry = filterData.modelCountry ?? {};
    modelCountry = {
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
    setFilter({ ...filterData, page, size, modelCountry, order });
  };

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Position List
      </Divider>
      <Table
        key={tableKey}
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
