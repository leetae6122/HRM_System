import { Card, Table, Typography } from 'antd';
import departmentApi from 'api/departmentApi';
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
    title: 'Short Name',
    dataIndex: 'shortName',
    key: 'shortName',
  },
  {
    title: 'Department Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Employees',
    dataIndex: 'employeeCount',
    key: 'employees',
  },
];

function DepartmentEmployeesTable() {
  const { defaultFilter } = useSelector((state) => state.department);
  const [departmentEmployees, setDepartmentEmployees] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = await departmentApi.countEmployees();
        const data = response.data.map((item) => ({ key: item.id, ...item }));
        setDepartmentEmployees(data);
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
            {`Department's Employees`}
          </Typography.Title>
        )}
        columns={columns}
        dataSource={departmentEmployees}
        scroll={{ y: 400 }}
        pagination={false}
        loading={loadingData}
      />
    </Card>
  );
}
export default DepartmentEmployeesTable;
