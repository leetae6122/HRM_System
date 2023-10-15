import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table, Tag } from 'antd';
import projectApi from 'api/projectApi';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteFilled,
  EditFilled,
  SyncOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditProjectId, setFilterData } from 'reducers/project';
import Swal from 'sweetalert2';
import ProjectTableHeader from './components/ProjectTableHeader';
import ModalAddProject from './components/ComponentAddEdit/ModalAddProject';
import ModalEditProject from './components/ComponentAddEdit/ModalEditProject';

const createColumns = (toggleModalEditProject, handleDeleteProject) => [
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
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <>
        {status === 'Upcoming' ? (
          <Tag icon={<ClockCircleOutlined />} color="default">
            {status}
          </Tag>
        ) : status === 'Running' ? (
          <Tag icon={<SyncOutlined />} color="processing">
            {status}
          </Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {status}
          </Tag>
        )}
      </>
    ),
    filters: [
      {
        text: 'Upcoming',
        value: 'Upcoming',
      },
      {
        text: 'Running',
        value: 'Running',
      },
      {
        text: 'Complete',
        value: 'Complete',
      },
    ],
    onFilter: (value, record) => !!record.status === value,
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    render: (date) => getFullDate(date),
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    render: (date) => (date ? getFullDate(date) : ''),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          icon={<EditFilled />}
          onClick={() => toggleModalEditProject(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteProject(record.id)}
        />
      </Space>
    ),
  },
];

function ProjectPage() {
  const dispatch = useDispatch();
  const { filterData, projectList, total, currentPage, defaultFilter } =
    useSelector((state) => state.project);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddProject, setOpenModalAddProject] = useState(false);
  const [openModalEditProject, setOpenModalEditProject] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await projectApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            projectList: data,
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

  const refreshProjectList = async () => {
    const response = (await projectApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        projectList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const toggleModalEditProject = (id) => {
    dispatch(setEditProjectId(id));
    setOpenModalEditProject(!openModalEditProject);
  };

  const toggleModalAddProject = () => {
    setOpenModalAddProject(!openModalAddProject);
  };

  const handleDeleteProject = async (projectId) => {
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
          await projectApi.delete(projectId);
          Swal.fire('Deleted!', 'Project has been deleted.', 'success');
          await refreshProjectList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(toggleModalEditProject, handleDeleteProject);

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Project List
      </Divider>
      <Table
        columns={columns}
        dataSource={projectList}
        bordered
        title={() => (
          <ProjectTableHeader
            toggleModalAddProject={toggleModalAddProject}
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
      {openModalAddProject && (
        <ModalAddProject
          openModal={openModalAddProject}
          toggleShowModal={toggleModalAddProject}
          refreshProjectList={refreshProjectList}
        />
      )}
      {openModalEditProject && (
        <ModalEditProject
          openModal={openModalEditProject}
          toggleShowModal={toggleModalEditProject}
          refreshProjectList={refreshProjectList}
        />
      )}
    </>
  );
}
export default ProjectPage;
