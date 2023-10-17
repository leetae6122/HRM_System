import { Card, Table, Typography } from 'antd';
import projectApi from 'api/projectApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    render: (id) => `#${id}`,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
  },
];

function RunningProjectsTable() {
  const { defaultFilter } = useSelector((state) => state.project);
  const [runningProjects, setRunningProjects] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = await projectApi.filterAll({
          where: { status: 'Running' },
        });
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        setRunningProjects(data);
        setLoadingData(false);
      } catch (error) {
        toast.error(error);
        setLoadingData(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [defaultFilter]);

  return (
    <Card>
      <Table
        title={() => (
          <Typography.Title level={3} style={{ margin: 0 }}>
            Running Projects
          </Typography.Title>
        )}
        columns={columns}
        dataSource={runningProjects}
        scroll={{ y: 400 }}
        pagination={false}
        loading={loadingData}
      />
    </Card>
  );
}
export default RunningProjectsTable;
