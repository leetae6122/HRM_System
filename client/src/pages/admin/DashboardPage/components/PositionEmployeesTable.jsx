import { Card, Table, Typography } from 'antd';
import positionApi from 'api/positionApi';
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
    title: 'Position Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Employees',
    dataIndex: 'employeeCount',
    key: 'employees',
  },
];

function PositionEmployeesTable() {
  const { defaultFilter } = useSelector((state) => state.position);
  const [positionEmployees, setPositionEmployees] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = await positionApi.countEmployees();
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        setPositionEmployees(data);
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
            {`Position's Employees`}
          </Typography.Title>
        )}
        columns={columns}
        dataSource={positionEmployees}
        scroll={{ y: 400 }}
        pagination={false}
        loading={loadingData}
      />
    </Card>
  );
}
export default PositionEmployeesTable;
