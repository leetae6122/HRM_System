import {
  AlertOutlined,
  CalendarOutlined,
  DesktopOutlined,
  DollarOutlined,
  PieChartOutlined,
  RedEnvelopeOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Card, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'assets/styles/sidebar.scss';
import logoHrm from 'assets/images/logo-app.jpg';
import { useSelector } from 'react-redux';

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};

function EmployeeSideBar() {
  const { user } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    getItem(
      <Link to={'/employee/dashboard'} replace>
        Dashboard
      </Link>,
      '/employee/dashboard',
      <PieChartOutlined />,
    ),
    getItem(
      <Link to={'/employee/timekeeper'} replace>
        Timekeeper
      </Link>,
      '/employee/timekeeper',
      <AlertOutlined />,
    ),
    getItem(
      <Link to={'/employee/attendance'} replace>
        Attendance
      </Link>,
      '/employee/attendance',
      <CalendarOutlined />,
    ),
    getItem(
      <Link to={'/employee/leave'} replace>
        Leave
      </Link>,
      '/employee/leave',
      <UserDeleteOutlined />,
    ),
    getItem(
      <Link to={'/employee/allowance'} replace>
        Allowance
      </Link>,
      '/employee/allowance',
      <DollarOutlined />,
    ),
    getItem(
      <Link to={'/employee/reward-punishment'} replace>
        Reward
        <br />
        Punishment
      </Link>,
      '/employee/reward-punishment',
      <RedEnvelopeOutlined />,
    ),
    user?.profile.manageDepartment.managerEId === user?.employeeId
      ? getItem(
          <Link to={'/employee/manage-attendance'} replace>
            Manage
            <br />
            Attendance
          </Link>,
          '/employee/manage-attendance',
          <DesktopOutlined />,
        )
      : null,
  ];

  return (
    <Sider
      className="sider-bar"
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
    >
      <Card title="Employee" bordered={false} style={{ margin: 5 }}>
        <div className="demo-logo-vertical">
          <img src={logoHrm} alt="logo" />
        </div>
      </Card>
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

export default EmployeeSideBar;
