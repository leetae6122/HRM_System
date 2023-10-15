import { useEffect, useState } from 'react';
import { Button, Divider, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { getFullDate } from 'utils/handleDate';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setEditTaskId, setFilterData } from 'reducers/task';
import Swal from 'sweetalert2';
import taskApi from 'api/taskApi';
import TaskTableHeader from './components/TaskTableHeader';
import ModalAddTask from './components/ComponentAddEdit/ModalAddTask';
import ModalEditTask from './components/ComponentAddEdit/ModalEditTask';

const createColumns = (toggleModalEditTask, handleDeleteTask) => [
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
          onClick={() => toggleModalEditTask(record.id)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteTask(record.id)}
        />
      </Space>
    ),
  },
];

function TaskPage() {
  const dispatch = useDispatch();
  const { filterData, taskList, total, currentPage, defaultFilter } =
    useSelector((state) => state.task);
  const [loadingData, setLoadingData] = useState(false);
  const [openModalAddTask, setOpenModalAddTask] = useState(false);
  const [openModalEditTask, setOpenModalEditTask] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = (await taskApi.getList(filterData)).data;
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        dispatch(
          setData({
            taskList: data,
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

  const refreshTaskList = async () => {
    const response = (await taskApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        taskList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
  };

  const toggleModalEditTask = (id) => {
    dispatch(setEditTaskId(id));
    setOpenModalEditTask(!openModalEditTask);
  };

  const toggleModalAddTask = () => {
    setOpenModalAddTask(!openModalAddTask);
  };

  const handleDeleteTask = async (taskId) => {
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
          await taskApi.delete(taskId);
          Swal.fire('Deleted!', 'Task has been deleted.', 'success');
          await refreshTaskList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns = createColumns(toggleModalEditTask, handleDeleteTask);

  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>
        Task List
      </Divider>
      <Table
        columns={columns}
        dataSource={taskList}
        bordered
        title={() => (
          <TaskTableHeader
            toggleModalAddTask={toggleModalAddTask}
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
      {openModalAddTask && (
        <ModalAddTask
          openModal={openModalAddTask}
          toggleShowModal={toggleModalAddTask}
          refreshTaskList={refreshTaskList}
        />
      )}
      {openModalEditTask && (
        <ModalEditTask
          openModal={openModalEditTask}
          toggleShowModal={toggleModalEditTask}
          refreshTaskList={refreshTaskList}
        />
      )}
    </>
  );
}
export default TaskPage;
