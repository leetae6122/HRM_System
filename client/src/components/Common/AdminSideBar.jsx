import {
  CalendarOutlined,
  ClusterOutlined,
  FundViewOutlined,
  IdcardOutlined,
  PieChartOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'assets/styles/sidebar.scss';
import logoHrm from 'assets/images/logo-app.jpg';

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};

function AdminSideBar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    getItem(
      <Link to={'/admin/dashboard'} replace>
        Dashboard
      </Link>,
      '/admin/dashboard',
      <PieChartOutlined />,
    ),
    getItem(
      <Link to={'/admin/user'} replace>
        User
      </Link>,
      '/admin/user',
      <IdcardOutlined />,
    ),
    getItem('Employee', 'sub1', <TeamOutlined />, [
      getItem(
        <Link to={'/admin/employee'} replace>
          Employee
        </Link>,
        '/admin/employee',
      ),
      getItem(
        <Link to={'/admin/allowance'} replace>
          Allowance
        </Link>,
        '/admin/allowance',
      ),
      getItem(
        <Link to={'/admin/reward-punishment'} replace>
            Reward
            <br />
            Punishment
        </Link>,
        '/admin/reward-punishment',
      ),
    ]),
    getItem('Payroll', 'sub2', <FundViewOutlined />, [
      getItem(
        <Link to={'/admin/payroll'} replace>
          Payroll
        </Link>,
        '/admin/payroll',
      ),
      getItem(
        <Link to={'/admin/wage'} replace>
          Wage
        </Link>,
        '/admin/wage',
      ),
    ]),
    getItem(
      <Link to={'/admin/department'} replace>
        Department
      </Link>,
      '/admin/department',
      <ClusterOutlined />
    ),
    getItem(
      <Link to={'/admin/position'} replace>
        Position
      </Link>,
      '/admin/position',
      <SolutionOutlined />
    ),
    getItem('Attendance', 'sub3', <CalendarOutlined />, [
      getItem(
        <Link to={'/admin/attendance'} replace>
          Attendance
        </Link>,
        '/admin/attendance',
      ),
      getItem(
        <Link to={'/admin/shift'} replace>
          Shift
        </Link>,
        '/admin/shift',
      ),
    ]),
    getItem(
      <Link to={'/admin/leave'} replace>
        Leave
      </Link>,
      '/admin/leave',
      <UserDeleteOutlined />,
    ),
  ];

  return (
    <Sider
      className="sider-bar"
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
    >
      <div className="demo-logo-vertical">
        <img src={logoHrm} alt="logo" />
      </div>
      <Menu
        theme="dark"
        selectedKeys={pathname}
        mode="inline"
        items={items}
        style={{
          fontSize: 16,
        }}
      />
    </Sider>
  );
}

export default AdminSideBar;
