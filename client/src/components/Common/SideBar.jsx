import {
  CalendarOutlined,
  GlobalOutlined,
  IdcardOutlined,
  PieChartOutlined,
  SolutionOutlined,
  UserDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "assets/styles/sidebar.scss";
import logoHrm from "assets/images/logo-app.jpg";

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};

function SideBar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    getItem(
      <Link to={"/admin/dashboard"}>Dashboard</Link>,
      "/admin/dashboard",
      <PieChartOutlined />
    ),
    getItem(
      <Link to={"/admin/user"}>User</Link>,
      "/admin/user",
      <IdcardOutlined />
    ),
    getItem("Employee", "sub1", <UserOutlined />, [
      getItem(<Link to={"/admin/employee"}>Employee</Link>, "/admin/employee"),
      getItem(
        <Link to={"/admin/employee/position"}>Position</Link>,
        "/admin/employee/position"
      ),
    ]),
    getItem("Payroll", "sub2", <SolutionOutlined />, [
      getItem(
        <Link to={"/admin/payroll/salary"}>Salary</Link>,
        "/admin/payroll/salary"
      ),
      getItem(
        <Link to={"/admin/payroll/currency"}>Currency</Link>,
        "/admin/payroll/currency"
      ),
    ]),
    getItem("Organization", "sub3", <GlobalOutlined />, [
      getItem("Office", "7"),
      getItem("Department", "8"),
      getItem("Country", "9"),
    ]),
    getItem("Attendance", "10", <CalendarOutlined />),
    getItem("Leave", "11", <UserDeleteOutlined />),
  ];

  return (
    <Sider
      className="sider-bar"
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
    >
      <div className="demo-logo-vertical">
        <img src={logoHrm} alt="..." />
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

export default SideBar;
